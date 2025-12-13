// TypeScript type definitions

export interface CommandArgs {
  [key: string]: any;
}

export interface Command {
  name: string;
  description: string;
  execute(args: CommandArgs): Promise<void>;
}

export interface MintRequest {
  file: Buffer;
  filename: string;
  title?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface MintResult {
  success: boolean;
  transactionHash?: string;
  ipAssetId?: string;
  ipfsHash?: string;
  error?: string;
  transactionData?: {
    to?: string;
    data?: string;
    value?: string;
    gasEstimate?: number;
  };
}

export interface SignedTransaction {
  hash: string;
  success: boolean;
  error?: string;
  ipAssetId?: string; // Add IP Asset ID to signed transaction result
}

export interface CLIConfig {
  endpoint: string;
  apiKey?: string;
  verbose: boolean;
  timeout: number;
}

export interface APIClientInterface {
  readFile(filePath: string, title?: string, description?: string): Promise<MintRequest>;
  mintFile(mintRequest: MintRequest, userAddress: string): Promise<MintResult>;
  validateEndpoint(url?: string): Promise<boolean>;
  testConnection(): Promise<{ success: boolean; message: string }>;
}

export interface ConfigManager {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
  getEndpoint(): string;
  getApiKey(): string | undefined;
}

export interface ProgressReporter {
  start(message: string): void;
  update(message: string): void;
  succeed(message: string): void;
  fail(message: string): void;
}

export interface Metadata {
  title?: string;
  description?: string;
  [key: string]: any;
}
