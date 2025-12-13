import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { MintRequest, MintResult, CLIConfig } from '../types/index.js';
import { NetworkError, APIError, ValidationError, FileNotFoundError } from './error-handler.js';
import { ProgressReporter } from './progress-reporter.js';

export class APIClient {
  private client: AxiosInstance;
  private config: CLIConfig;
  private progressReporter?: ProgressReporter;

  constructor(config: CLIConfig, progressReporter?: ProgressReporter) {
    this.config = config;
    this.progressReporter = progressReporter;
    this.client = axios.create({
      baseURL: config.endpoint,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'StoryLite-CLI/1.0.0',
        ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      config => {
        if (this.config.verbose) {
          console.log(`Making request to: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => {
        if (this.config.verbose) {
          console.log(`Response received: ${response.status} ${response.statusText}`);
        }
        return response;
      },
      error => {
        return Promise.reject(this.handleAxiosError(error));
      }
    );
  }

  /**
   * Validate that the API endpoint is reachable and compatible
   */
  async validateEndpoint(url?: string): Promise<boolean> {
    const testUrl = url || this.config.endpoint;

    try {
      const response = await axios.get(`${testUrl}/api/health`, {
        timeout: 5000,
        headers: {
          'User-Agent': 'StoryLite-CLI/1.0.0',
        },
      });

      return response.status === 200;
    } catch (error) {
      if (this.config.verbose) {
        console.log(`Endpoint validation failed for ${testUrl}:`, error);
      }
      return false;
    }
  }

  /**
   * Read a file from the filesystem and create a MintRequest
   */
  async readFile(filePath: string, title?: string, description?: string): Promise<MintRequest> {
    try {
      const resolvedPath = resolve(filePath);

      // Check if file exists
      try {
        await fs.access(resolvedPath);
      } catch (error) {
        throw new FileNotFoundError(filePath);
      }

      // Get file stats
      const stats = await fs.stat(resolvedPath);
      if (!stats.isFile()) {
        throw new ValidationError(
          `Path is not a file: ${filePath}`,
          'Provide a path to a regular file, not a directory'
        );
      }

      // Read file with progress tracking for large files
      const fileSize = stats.size;
      const filename = filePath.split(/[/\\]/).pop() || 'unknown';

      if (this.config.verbose) {
        console.log(`Reading file: ${filename} (${this.formatFileSize(fileSize)})`);
      }

      let fileBuffer: Buffer;

      if (fileSize > 10 * 1024 * 1024) {
        // 10MB threshold for progress tracking
        fileBuffer = await this.readFileWithProgress(resolvedPath, fileSize);
      } else {
        fileBuffer = await fs.readFile(resolvedPath);
      }

      return {
        file: fileBuffer,
        filename,
        title,
        description,
      };
    } catch (error) {
      if (error instanceof FileNotFoundError || error instanceof ValidationError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new ValidationError(`Failed to read file: ${message}`);
    }
  }

  /**
   * Mint a file as an IP asset through the Universal Minting Engine
   */
  async mintFile(mintRequest: MintRequest, userAddress: string): Promise<MintResult> {
    try {
      // Validate inputs
      this.validateMintRequest(mintRequest, userAddress);

      // Prepare request payload for the prepare-mint endpoint (same as web demo)
      const payload = {
        userAddress,
        ipMetadata: {
          title: mintRequest.title || mintRequest.filename,
          description: mintRequest.description || `IP asset for ${mintRequest.filename}`,
          creators: [{
            name: `User-${userAddress.slice(2, 8)}...${userAddress.slice(-4)}`,
            address: userAddress,
            contributionPercent: 100
          }],
          createdAt: new Date().toISOString(),
          mediaType: this.detectContentType(mintRequest.filename)
        },
        nftMetadata: {
          name: mintRequest.title || mintRequest.filename,
          description: mintRequest.description || `NFT for ${mintRequest.filename}`,
          attributes: [
            { key: 'File Name', value: mintRequest.filename },
            { key: 'File Size', value: this.formatFileSize(mintRequest.file.length) },
            { key: 'Content Type', value: this.detectContentType(mintRequest.filename) }
          ]
        },
        // Note: File upload temporarily disabled - API may not have IPFS configured
        // files: [{
        //   data: mintRequest.file.toString('base64'),
        //   filename: mintRequest.filename,
        //   contentType: this.detectContentType(mintRequest.filename),
        //   purpose: 'media'
        // }],
        ...mintRequest.metadata,
      };

      if (this.config.verbose) {
        console.log('Request payload:', {
          userAddress: payload.userAddress,
          ipTitle: payload.ipMetadata.title,
          nftName: payload.nftMetadata.name,
          filename: mintRequest.filename,
          contentType: this.detectContentType(mintRequest.filename),
          fileDataLength: mintRequest.file.length,
          hasCustomMetadata: !!mintRequest.metadata
        });
      }

      if (this.config.verbose) {
        console.log(
          `Uploading file: ${mintRequest.filename} (${this.formatFileSize(mintRequest.file.length)})`
        );
      }

      // Configure upload progress tracking for large files
      const config =
        mintRequest.file.length > 5 * 1024 * 1024
          ? {
            // 5MB threshold
            onUploadProgress: (progressEvent: any) => {
              if (this.config.verbose && progressEvent.total) {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                process.stdout.write(`\rUploading: ${progress}%`);
              }
            },
          }
          : {};

      const response: AxiosResponse = await this.client.post('/api/prepare-mint', payload, config);

      if (this.config.verbose && mintRequest.file.length > 5 * 1024 * 1024) {
        process.stdout.write('\n');
      }

      if (!response.data.success) {
        throw new APIError(
          response.data.error?.message || 'Minting failed',
          response.status,
          response.data.error?.details
        );
      }

      // Extract relevant data from the CLI response
      const result: MintResult = {
        success: true,
        transactionHash: response.data.transaction?.hash,
        ipAssetId: response.data.additionalData?.ipAssetId,
        ipfsHash: response.data.metadata?.ipfsHash,
        error: undefined,
        // Store transaction data for display
        transactionData: response.data.transaction,
      };

      if (this.config.verbose) {
        console.log('Mint response received:', {
          ipfsHash: result.ipfsHash,
          hasTransaction: !!result.transactionHash,
        });
      }

      return result;
    } catch (error) {
      if (
        error instanceof APIError ||
        error instanceof NetworkError ||
        error instanceof ValidationError
      ) {
        throw error;
      }

      // Handle unexpected errors
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new APIError(`Failed to mint file: ${message}`);
    }
  }

  /**
   * Test the connection to the API endpoint
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const isValid = await this.validateEndpoint();

      if (isValid) {
        return {
          success: true,
          message: 'Connection successful',
        };
      } else {
        return {
          success: false,
          message: 'Endpoint is not reachable or not compatible',
        };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connection test failed';
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Handle axios errors and convert them to appropriate CLI errors
   */
  private handleAxiosError(error: AxiosError): Error {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return new NetworkError(
        'Unable to connect to API endpoint',
        `Check if the endpoint ${this.config.endpoint} is correct and accessible`
      );
    }

    if (error.code === 'ECONNABORTED') {
      return new NetworkError(
        'Request timeout',
        `Request took longer than ${this.config.timeout}ms to complete`
      );
    }

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 400:
          if (this.config.verbose) {
            console.log('Validation error details:', {
              status: error.response.status,
              statusText: error.response.statusText,
              errorCode: data?.error?.code,
              errorMessage: data?.error?.message,
              errorDetails: JSON.stringify(data?.error?.details, null, 2)
            });
          }
          return new ValidationError(
            data?.error?.message || 'Invalid request parameters',
            'Check your input parameters and try again'
          );
        case 401:
          return new APIError('Authentication failed', status, 'Check your API key configuration');
        case 403:
          return new APIError(
            'Access forbidden',
            status,
            'Your API key may not have sufficient permissions'
          );
        case 404:
          return new APIError(
            'API endpoint not found',
            status,
            'Check your endpoint configuration'
          );
        case 429:
          return new APIError('Rate limit exceeded', status, 'Wait a moment before trying again');
        case 500:
          if (this.config.verbose) {
            console.log('Server error details:', {
              status: error.response.status,
              statusText: error.response.statusText,
              errorCode: data?.error?.code,
              errorMessage: data?.error?.message,
              errorDetails: JSON.stringify(data?.error?.details, null, 2)
            });
          }
          return new APIError(
            data?.error?.message || 'Server error',
            status,
            'The API server encountered an error. Try again later.'
          );
        default:
          return new APIError(
            data?.error?.message || `HTTP ${status} error`,
            status,
            data?.error?.details
          );
      }
    }

    // Network error without response
    return new NetworkError(
      error.message || 'Network request failed',
      'Check your internet connection and API endpoint'
    );
  }

  /**
   * Validate mint request parameters
   */
  private validateMintRequest(mintRequest: MintRequest, userAddress: string): void {
    if (!mintRequest.file || mintRequest.file.length === 0) {
      throw new ValidationError('File data is required and cannot be empty');
    }

    if (!mintRequest.filename || mintRequest.filename.trim() === '') {
      throw new ValidationError('Filename is required');
    }

    if (!userAddress || !userAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new ValidationError(
        'Valid Ethereum address is required',
        'Provide a valid Ethereum address (0x followed by 40 hex characters)'
      );
    }

    // Validate file size (max 50MB for reasonable upload)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (mintRequest.file.length > maxSize) {
      throw new ValidationError(
        `File size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`,
        'Try compressing the file or use a smaller file'
      );
    }
  }

  /**
   * Read a large file with progress tracking
   */
  private async readFileWithProgress(filePath: string, fileSize: number): Promise<Buffer> {
    const chunkSize = 1024 * 1024; // 1MB chunks
    const chunks: Buffer[] = [];
    let bytesRead = 0;

    const fileHandle = await fs.open(filePath, 'r');

    try {
      while (bytesRead < fileSize) {
        const remainingBytes = fileSize - bytesRead;
        const currentChunkSize = Math.min(chunkSize, remainingBytes);

        const buffer = Buffer.alloc(currentChunkSize);
        const { bytesRead: chunkBytesRead } = await fileHandle.read(
          buffer,
          0,
          currentChunkSize,
          bytesRead
        );

        if (chunkBytesRead === 0) break;

        chunks.push(buffer.slice(0, chunkBytesRead));
        bytesRead += chunkBytesRead;

        // Show progress for large files
        if (this.config.verbose) {
          const progress = Math.round((bytesRead / fileSize) * 100);
          process.stdout.write(`\rReading file: ${progress}%`);
        }
      }

      if (this.config.verbose) {
        process.stdout.write('\n');
      }

      return Buffer.concat(chunks);
    } finally {
      await fileHandle.close();
    }
  }

  /**
   * Format file size in human-readable format
   */
  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }

  /**
   * Detect content type from filename
   */
  private detectContentType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();

    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      mp4: 'video/mp4',
      webm: 'video/webm',
      mov: 'video/quicktime',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      pdf: 'application/pdf',
      txt: 'text/plain',
      md: 'text/markdown',
      json: 'application/json',
      js: 'application/javascript',
      ts: 'application/typescript',
      py: 'text/x-python',
      html: 'text/html',
      css: 'text/css',
    };

    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}
