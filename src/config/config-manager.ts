import Conf from 'conf';

export interface CLIConfig {
  endpoint: string;
  apiKey?: string;
  address?: string;
  verbose: boolean;
  timeout: number;
}

export class ConfigManager {
  private config: Conf<CLIConfig>;
  private readonly defaultConfig: CLIConfig = {
    endpoint: 'https://surreal-base.vercel.app',
    verbose: false,
    timeout: 30000,
  };

  constructor() {
    this.config = new Conf<CLIConfig>({
      projectName: 'storylite-cli',
      defaults: this.defaultConfig,
      schema: {
        endpoint: {
          type: 'string',
          format: 'uri',
        },
        apiKey: {
          type: 'string',
        },
        verbose: {
          type: 'boolean',
        },
        address: {
          type: 'string',
        },
        timeout: {
          type: 'number',
          minimum: 1000,
          maximum: 300000,
        },
      },
    });
  }

  /**
   * Get configuration value by key
   */
  get<K extends keyof CLIConfig>(key: K): CLIConfig[K] {
    return this.config.get(key);
  }

  /**
   * Set configuration value by key
   */
  set<K extends keyof CLIConfig>(key: K, value: CLIConfig[K]): void {
    this.config.set(key, value);
  }

  /**
   * Get API endpoint URL
   */
  getEndpoint(): string {
    return this.config.get('endpoint');
  }

  /**
   * Set API endpoint URL with validation
   */
  setEndpoint(url: string): void {
    if (!this.isValidUrl(url)) {
      throw new Error('Invalid URL format. URL must start with http:// or https://');
    }
    this.config.set('endpoint', url);
  }

  /**
   * Get API key (may be undefined)
   */
  getApiKey(): string | undefined {
    return this.config.get('apiKey');
  }

  /**
   * Set API key with validation
   */
  setApiKey(key: string): void {
    if (!key || key.trim().length === 0) {
      throw new Error('API key cannot be empty');
    }
    this.config.set('apiKey', key.trim());
  }

  /**
   * Get wallet address (may be undefined)
   */
  getAddress(): string | undefined {
    return this.config.get('address');
  }

  /**
   * Set wallet address with validation
   */
  setAddress(address: string): void {
    if (!this.isValidEthereumAddress(address)) {
      throw new Error(
        'Invalid Ethereum address format. Address must be 42 characters starting with 0x'
      );
    }
    this.config.set('address', address.toLowerCase());
  }

  /**
   * Get all configuration values
   */
  getAll(): CLIConfig {
    return {
      endpoint: this.config.get('endpoint'),
      apiKey: this.config.get('apiKey'),
      address: this.config.get('address'),
      verbose: this.config.get('verbose'),
      timeout: this.config.get('timeout'),
    };
  }

  /**
   * Reset configuration to defaults
   */
  reset(): void {
    this.config.clear();
  }

  /**
   * Check if configuration has required values
   */
  isValid(): boolean {
    const endpoint = this.config.get('endpoint');
    return !!endpoint && this.isValidUrl(endpoint);
  }

  /**
   * Get configuration for display (with sensitive data masked)
   */
  getDisplayConfig(): Record<string, string> {
    const config = this.getAll();
    return {
      endpoint: config.endpoint,
      apiKey: config.apiKey ? this.maskApiKey(config.apiKey) : 'Not set',
      address: config.address ? this.maskAddress(config.address) : 'Not set',
      verbose: config.verbose.toString(),
      timeout: `${config.timeout}ms`,
    };
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Get the path to the configuration file
   */
  getConfigPath(): string {
    return this.config.path;
  }

  /**
   * Validate Ethereum address format
   */
  private isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Mask API key for display
   */
  private maskApiKey(key: string): string {
    if (key.length <= 8) {
      return '*'.repeat(key.length);
    }
    return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
  }

  /**
   * Mask wallet address for display
   */
  private maskAddress(address: string): string {
    if (address.length !== 42) {
      return address;
    }
    return address.substring(0, 6) + '...' + address.substring(address.length - 4);
  }
}
