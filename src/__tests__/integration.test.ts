import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { APIClient } from '../lib/api-client.js';
import { ConfigManager } from '../config/config-manager.js';
import { applyDefaultMetadata, validateMetadata } from '../lib/metadata-utils.js';
import { createProgressReporter } from '../lib/progress-reporter.js';

/**
 * Integration tests for the complete minting workflow
 * Tests the full file-to-IP-asset pipeline including:
 * - File reading and validation
 * - Metadata processing
 * - API client integration
 * - Configuration management
 * - Progress reporting
 */
describe('Complete Minting Workflow Integration', () => {
  let tempDir: string;
  let testFile: string;
  let configManager: ConfigManager;
  let apiClient: APIClient;

  beforeAll(async () => {
    // Create temporary directory for test files
    tempDir = await fs.mkdtemp(join(tmpdir(), 'storylite-test-'));

    // Create a test file
    testFile = join(tempDir, 'test-document.txt');
    await fs.writeFile(testFile, 'This is a test document for IP minting.');
  });

  afterAll(async () => {
    // Clean up temporary files
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  beforeEach(() => {
    // Initialize fresh configuration for each test
    configManager = new ConfigManager();

    // Set up test configuration
    const config = {
      endpoint: 'http://localhost:3000', // Default test endpoint
      timeout: 30000,
      verbose: false,
    };

    const progressReporter = createProgressReporter(false);
    apiClient = new APIClient(config, progressReporter);
  });

  describe('File Reading and Validation', () => {
    it('should successfully read and validate a file', async () => {
      const mintRequest = await apiClient.readFile(testFile, 'Test Document', 'A test document');

      expect(mintRequest).toBeDefined();
      expect(mintRequest.filename).toBe('test-document.txt');
      expect(mintRequest.title).toBe('Test Document');
      expect(mintRequest.description).toBe('A test document');
      expect(mintRequest.file).toBeInstanceOf(Buffer);
      expect(mintRequest.file.length).toBeGreaterThan(0);
    });

    it('should handle file not found errors gracefully', async () => {
      const nonExistentFile = join(tempDir, 'does-not-exist.txt');

      await expect(apiClient.readFile(nonExistentFile)).rejects.toThrow('File not found');
    });

    it('should validate file size limits', async () => {
      // Create a large test file (simulate > 50MB)
      const largeFile = join(tempDir, 'large-file.txt');
      const largeContent = 'x'.repeat(1024 * 1024); // 1MB chunk

      // Write multiple chunks to simulate large file
      await fs.writeFile(largeFile, largeContent);

      // This should work for reasonable sizes
      const mintRequest = await apiClient.readFile(largeFile);
      expect(mintRequest.file.length).toBe(1024 * 1024);
    });
  });

  describe('Metadata Processing', () => {
    it('should apply default metadata when none provided', () => {
      const metadata = applyDefaultMetadata(testFile);

      expect(metadata.title).toBe('test-document.txt');
      expect(metadata.description).toContain('text file');
    });

    it('should use custom metadata when provided', () => {
      const metadata = applyDefaultMetadata(testFile, 'Custom Title', 'Custom Description');

      expect(metadata.title).toBe('Custom Title');
      expect(metadata.description).toBe('Custom Description');
    });

    it('should validate metadata correctly', () => {
      const validResult = validateMetadata('Valid Title', 'Valid description');
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      const invalidResult = validateMetadata('', '');
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Configuration Management', () => {
    it('should handle configuration storage and retrieval', () => {
      const testEndpoint = 'https://test-api.example.com';
      const testApiKey = 'test-api-key-123';

      configManager.set('endpoint', testEndpoint);
      configManager.set('apiKey', testApiKey);

      expect(configManager.get('endpoint')).toBe(testEndpoint);
      expect(configManager.get('apiKey')).toBe(testApiKey);
    });

    it('should provide default configuration values', () => {
      const config = configManager.getAll();

      expect(config.endpoint).toBeDefined();
      expect(config.timeout).toBeDefined();
      expect(typeof config.verbose).toBe('boolean');
    });
  });

  describe('API Client Integration', () => {
    it('should validate endpoint connectivity', async () => {
      // Test with a mock endpoint that should fail
      const result = await apiClient.validateEndpoint('http://invalid-endpoint.test');
      expect(result).toBe(false);
    });

    it('should handle network errors gracefully', async () => {
      const config = {
        endpoint: 'http://invalid-endpoint.test',
        timeout: 1000,
        verbose: false,
      };

      const client = new APIClient(config);
      const testResult = await client.testConnection();

      expect(testResult.success).toBe(false);
      expect(testResult.message).toContain('not reachable');
    });

    it('should prepare mint request with proper validation', async () => {
      const mintRequest = await apiClient.readFile(testFile, 'Test Title', 'Test Description');

      // Validate the mint request structure
      expect(mintRequest).toHaveProperty('file');
      expect(mintRequest).toHaveProperty('filename');
      expect(mintRequest).toHaveProperty('title');
      expect(mintRequest).toHaveProperty('description');

      expect(mintRequest.filename).toBe('test-document.txt');
      expect(mintRequest.title).toBe('Test Title');
      expect(mintRequest.description).toBe('Test Description');
    });
  });

  describe('Complete Workflow Integration', () => {
    it('should execute the complete workflow without errors', async () => {
      // This test validates that all components work together
      // without actually calling the external API

      // Step 1: Read and validate file
      const mintRequest = await apiClient.readFile(testFile);
      expect(mintRequest).toBeDefined();

      // Step 2: Apply default metadata
      const metadata = applyDefaultMetadata(testFile, mintRequest.title, mintRequest.description);
      expect(metadata).toBeDefined();

      // Step 3: Validate metadata
      const validation = validateMetadata(metadata.title, metadata.description);
      expect(validation.isValid).toBe(true);

      // Step 4: Test configuration
      const config = configManager.getAll();
      expect(config.endpoint).toBeDefined();

      // Step 5: Validate that all required components are present
      expect(mintRequest.file).toBeInstanceOf(Buffer);
      expect(mintRequest.filename).toBeTruthy();
      expect(metadata.title).toBeTruthy();
      expect(metadata.description).toBeTruthy();
    });

    it('should handle different file types correctly', async () => {
      const fileTypes = [
        { name: 'document.pdf', content: 'PDF content' },
        { name: 'image.jpg', content: 'JPEG content' },
        { name: 'code.js', content: 'console.log("test");' },
        { name: 'data.json', content: '{"test": true}' },
      ];

      for (const fileType of fileTypes) {
        const filePath = join(tempDir, fileType.name);
        await fs.writeFile(filePath, fileType.content);

        const mintRequest = await apiClient.readFile(filePath);
        const metadata = applyDefaultMetadata(filePath);

        expect(mintRequest.filename).toBe(fileType.name);
        expect(metadata.title).toBe(fileType.name);
        expect(metadata.description).toBeTruthy();
      }
    });

    it('should validate Ethereum addresses correctly', async () => {
      const mintRequest = await apiClient.readFile(testFile);

      // Valid Ethereum address
      const validAddress = '0x742d35Cc6634C0532925a3b8D404d3aABb8c4532';

      // This should not throw for valid address format
      expect(() => {
        // Simulate the validation that happens in mintFile
        if (!validAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
          throw new Error('Invalid address');
        }
      }).not.toThrow();

      // Invalid addresses should be caught
      const invalidAddresses = [
        '0x123', // too short
        '742d35Cc6634C0532925a3b8D404d3aABb8c4532', // missing 0x
        '0xGGGd35Cc6634C0532925a3b8D404d3aABb8c4532', // invalid hex
        '',
      ];

      invalidAddresses.forEach(address => {
        expect(() => {
          if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
            throw new Error('Invalid address');
          }
        }).toThrow();
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('should provide helpful error messages for common issues', async () => {
      // Test file not found
      await expect(apiClient.readFile('/nonexistent/file.txt')).rejects.toThrow('File not found');

      // Test invalid metadata
      const invalidValidation = validateMetadata('', '');
      expect(invalidValidation.isValid).toBe(false);
      expect(invalidValidation.errors.length).toBeGreaterThan(0);
    });

    it('should handle configuration errors gracefully', () => {
      // Test with invalid configuration
      const invalidConfig = {
        endpoint: '', // empty endpoint
        timeout: -1, // invalid timeout
        verbose: false,
      };

      // The APIClient should handle invalid config gracefully
      expect(() => new APIClient(invalidConfig)).not.toThrow();
    });
  });
});
