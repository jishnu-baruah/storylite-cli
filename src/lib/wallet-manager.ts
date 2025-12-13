import { privateKeyToAccount, Account } from 'viem/accounts';
import { createWalletClient, createPublicClient, http, WalletClient, PublicClient } from 'viem';
import { aeneid, mainnet } from '@story-protocol/core-sdk';
import { ConfigManager } from '../config/config-manager.js';

export interface WalletInfo {
  address: string;
  isConnected: boolean;
  network: 'aeneid' | 'mainnet';
}

export interface TransactionRequest {
  to: string;
  data: string;
  value: string;
  gasEstimate: number;
}

export interface SignedTransaction {
  hash: string;
  success: boolean;
  error?: string;
}

/**
 * Wallet Manager handles transaction signing for StoryLite CLI
 *
 * IMPORTANT SECURITY NOTE:
 * This implementation shows the architecture but does NOT store private keys.
 * In production, this would integrate with:
 * - Hardware wallets (Ledger, Trezor)
 * - Browser wallets (MetaMask via WalletConnect)
 * - Encrypted keystore files
 * - Environment variables for CI/CD
 */
export class WalletManager {
  private configManager: ConfigManager;
  private walletClient: WalletClient | null = null;
  private publicClient: PublicClient | null = null;
  private account: Account | null = null;

  constructor() {
    this.configManager = new ConfigManager();
  }

  /**
   * Get wallet information for the configured address
   */
  getWalletInfo(): WalletInfo {
    const address = this.configManager.getAddress();

    if (!address) {
      throw new Error('No wallet address configured. Run: storylite config set-address <address>');
    }

    return {
      address,
      isConnected: this.isConnected(),
      network: this.getNetwork(),
    };
  }

  /**
   * Check if wallet is connected and ready to sign
   */
  isConnected(): boolean {
    return this.walletClient !== null && this.account !== null;
  }

  /**
   * Get the current network (aeneid testnet or mainnet)
   */
  getNetwork(): 'aeneid' | 'mainnet' {
    // In production, this would be configurable
    // For now, default to aeneid testnet
    return process.env.STORY_NETWORK === 'mainnet' ? 'mainnet' : 'aeneid';
  }

  /**
   * Initialize wallet connection
   *
   * SECURITY NOTE: This is a simplified implementation for demonstration.
   * In production, you would:
   * 1. Use hardware wallets (Ledger/Trezor)
   * 2. Use WalletConnect for browser wallets
   * 3. Use encrypted keystore files
   * 4. Use environment variables for CI/CD
   */
  async connectWallet(
    options: {
      privateKey?: string;
      useHardwareWallet?: boolean;
      useWalletConnect?: boolean;
    } = {}
  ): Promise<void> {
    const network = this.getNetwork();
    const chain = network === 'mainnet' ? mainnet : aeneid;
    const rpcUrl =
      network === 'mainnet' ? 'https://mainnet.storyrpc.io' : 'https://aeneid.storyrpc.io';

    if (options.privateKey) {
      // Method 1: Private key (for CI/CD or development)
      this.account = privateKeyToAccount(options.privateKey as `0x${string}`);

      this.walletClient = createWalletClient({
        account: this.account,
        chain,
        transport: http(rpcUrl),
      });

      this.publicClient = createPublicClient({
        chain,
        transport: http(rpcUrl),
      });
    } else if (options.useHardwareWallet) {
      // Method 2: Hardware wallet integration (future implementation)
      throw new Error('Hardware wallet support coming soon! Use --private-key for now.');
    } else if (options.useWalletConnect) {
      // Method 3: WalletConnect integration (future implementation)
      throw new Error('WalletConnect support coming soon! Use --private-key for now.');
    } else {
      // Method 4: Interactive wallet selection (future implementation)
      throw new Error('Interactive wallet selection coming soon! Use --private-key for now.');
    }

    // Verify the account matches configured address
    const configuredAddress = this.configManager.getAddress();
    if (
      configuredAddress &&
      this.account.address.toLowerCase() !== configuredAddress.toLowerCase()
    ) {
      throw new Error(
        `Wallet address mismatch!\n` +
          `  Configured: ${configuredAddress}\n` +
          `  Wallet:     ${this.account.address}\n` +
          `  Run: storylite config set-address ${this.account.address}`
      );
    }
  }

  /**
   * Sign and send a transaction
   */
  async signTransaction(txRequest: TransactionRequest): Promise<SignedTransaction> {
    if (!this.walletClient || !this.account) {
      throw new Error('Wallet not connected. Call connectWallet() first.');
    }

    try {
      console.log(`🔐 Signing and sending transaction...`);
      console.log(`   To: ${txRequest.to}`);
      console.log(`   Data: ${txRequest.data.substring(0, 20)}...`);
      console.log(`   Gas Estimate: ${txRequest.gasEstimate}`);

      // Use provided gas estimate or estimate gas for the transaction
      let gasEstimate: bigint;
      try {
        gasEstimate = await this.estimateGas(txRequest);
      } catch (error) {
        // Fall back to provided estimate if gas estimation fails
        gasEstimate = BigInt(txRequest.gasEstimate);
      }

      // Sign and send the transaction
      const hash = await this.walletClient.sendTransaction({
        account: this.account,
        to: txRequest.to as `0x${string}`,
        data: txRequest.data as `0x${string}`,
        value: BigInt(txRequest.value),
        gas: gasEstimate,
        chain: this.walletClient.chain,
      });

      console.log(`✅ Transaction sent: ${hash}`);

      return {
        hash,
        success: true,
      };
    } catch (error) {
      console.error(`❌ Transaction failed:`, error);
      return {
        hash: '',
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed',
      };
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(txRequest: TransactionRequest): Promise<bigint> {
    if (!this.walletClient || !this.account) {
      throw new Error('Wallet not connected. Call connectWallet() first.');
    }

    try {
      // Use public client for gas estimation
      if (!this.publicClient) {
        throw new Error('Public client not initialized');
      }
      const gas = await this.publicClient.estimateGas({
        account: this.account.address,
        to: txRequest.to as `0x${string}`,
        data: txRequest.data as `0x${string}`,
        value: BigInt(txRequest.value),
      });

      return gas;
    } catch (error) {
      // Return the provided estimate if gas estimation fails
      return BigInt(txRequest.gasEstimate);
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(): Promise<{ balance: string; formatted: string }> {
    if (!this.walletClient || !this.account) {
      throw new Error('Wallet not connected. Call connectWallet() first.');
    }

    try {
      // Use public client for balance query
      if (!this.publicClient) {
        throw new Error('Public client not initialized');
      }
      const balance = await this.publicClient.getBalance({
        address: this.account.address,
      });

      // Convert from wei to ETH
      const formatted = (Number(balance) / 1e18).toFixed(4);

      return {
        balance: balance.toString(),
        formatted: `${formatted} ETH`,
      };
    } catch (error) {
      throw new Error(
        `Failed to get balance: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.walletClient = null;
    this.publicClient = null;
    this.account = null;
  }
}

/**
 * Transaction signing strategies for different environments
 */
export class TransactionSigner {
  private walletManager: WalletManager;

  constructor() {
    this.walletManager = new WalletManager();
  }

  /**
   * Sign transaction for development/testing
   */
  async signForDevelopment(
    txRequest: TransactionRequest,
    privateKey: string
  ): Promise<SignedTransaction> {
    await this.walletManager.connectWallet({ privateKey });
    return this.walletManager.signTransaction(txRequest);
  }

  /**
   * Sign transaction for CI/CD (using environment variables)
   */
  async signForCICD(txRequest: TransactionRequest): Promise<SignedTransaction> {
    const privateKey = process.env.STORYLITE_PRIVATE_KEY;

    if (!privateKey) {
      throw new Error(
        'STORYLITE_PRIVATE_KEY environment variable required for CI/CD signing.\n' +
          'Set it in your CI/CD environment with your wallet private key.'
      );
    }

    await this.walletManager.connectWallet({ privateKey });
    return this.walletManager.signTransaction(txRequest);
  }

  /**
   * Sign transaction interactively (future implementation)
   */
  async signInteractively(_txRequest: TransactionRequest): Promise<SignedTransaction> {
    // Future: Integrate with hardware wallets, WalletConnect, etc.
    throw new Error('Interactive signing coming soon! Use --private-key for now.');
  }

  /**
   * Get signing options available to user
   */
  getAvailableSigningMethods(): string[] {
    const methods = ['private-key'];

    if (process.env.STORYLITE_PRIVATE_KEY) {
      methods.push('environment');
    }

    // Future methods:
    // methods.push('hardware-wallet', 'wallet-connect', 'interactive');

    return methods;
  }
}
