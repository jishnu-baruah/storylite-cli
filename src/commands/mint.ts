import { Command } from 'commander';
import chalk from 'chalk';
import {
  wrapCommand,
  validateFile,
  ValidationError,
  validateMintArguments,
} from '../lib/error-handler.js';
import { ConfigManager } from '../config/config-manager.js';
import { APIClient } from '../lib/api-client.js';
import { applyDefaultMetadata, validateMetadata } from '../lib/metadata-utils.js';
import { createProgressReporter } from '../lib/progress-reporter.js';
import { TransactionSigner } from '../lib/wallet-manager.js';

export const mintCommand = new Command('mint')
  .description('Mint a file as an IP asset on Story Protocol')
  .argument('<file>', 'Path to the file you want to mint as an IP asset')
  .option('-t, --title <title>', 'Custom title for the IP asset (defaults to filename)')
  .option(
    '-d, --description <description>',
    'Custom description for the IP asset (defaults to file type description)'
  )
  .option('--endpoint <url>', 'Override the configured API endpoint for this operation')
  .option('--address <address>', 'Your wallet address (optional if default address is set)')
  .option('--private-key <key>', 'Private key for transaction signing (use with caution)')
  .option('--dry-run', 'Prepare transaction but do not sign or send')
  .option('-v, --verbose', 'Enable detailed logging and progress information')
  .addHelpText(
    'before',
    `
${chalk.cyan.bold('MINT COMMAND')}
Transform any file into a registered intellectual property asset on Story Protocol.
This command uploads your file and creates an immutable record of ownership.
`
  )
  .addHelpText(
    'after',
    `
${chalk.yellow.bold('BASIC USAGE:')}
  ${chalk.gray('$ storylite mint <file>')}
  ${chalk.gray('# Uses default address from config, or specify with --address')}

${chalk.yellow.bold('DETAILED EXAMPLES:')}

  ${chalk.cyan('# Mint a Python script with custom metadata (uses default address)')}
  ${chalk.gray('$ storylite mint ./ml-algorithm.py \\')}
  ${chalk.gray('    --title "Machine Learning Algorithm" \\')}
  ${chalk.gray('    --description "Advanced neural network for image classification"')}

  ${chalk.cyan('# Mint an image with automatic metadata')}
  ${chalk.gray('$ storylite mint ./digital-art.png')}
  ${chalk.gray('  # Title: "digital-art.png", Description: "PNG image file"')}

  ${chalk.cyan('# Override default address for one mint')}
  ${chalk.gray('$ storylite mint ./file.txt --address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532')}

  ${chalk.cyan('# Mint a document with verbose output')}
  ${chalk.gray('$ storylite mint ./research-paper.pdf \\')}
  ${chalk.gray('    --title "Blockchain Scalability Research" \\')}
  ${chalk.gray('    --verbose \\')}
  ${chalk.gray('    --address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532')}

  ${chalk.cyan('# Use custom API endpoint')}
  ${chalk.gray('$ storylite mint ./source-code.js --endpoint https://my-custom-api.com')}

  ${chalk.cyan('# Mint multiple files (run separately)')}
  ${chalk.gray('$ storylite mint ./file1.txt --address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532')}
  ${chalk.gray('$ storylite mint ./file2.jpg --address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532')}

${chalk.yellow.bold('METADATA BEHAVIOR:')}
  • If no --title is provided, the filename will be used
  • If no --description is provided, a default based on file type is generated
  • Both title and description are validated for length and content
  • Special characters in filenames are handled automatically

${chalk.yellow.bold('SUPPORTED FILE FORMATS:')}
  ${chalk.green('✓')} Text files: .txt, .md, .rtf
  ${chalk.green('✓')} Documents: .pdf, .doc, .docx
  ${chalk.green('✓')} Images: .jpg, .png, .gif, .svg, .webp
  ${chalk.green('✓')} Code: .js, .ts, .py, .java, .cpp, .rs, .go, .php
  ${chalk.green('✓')} Audio: .mp3, .wav, .flac, .aac, .ogg
  ${chalk.green('✓')} Video: .mp4, .avi, .mov, .webm, .mkv
  ${chalk.green('✓')} Archives: .zip, .tar, .gz, .rar
  ${chalk.green('✓')} Data: .json, .xml, .csv, .yaml
  ${chalk.green('✓')} And many more...

${chalk.yellow.bold('WHAT HAPPENS WHEN YOU MINT:')}
  1. File is validated and read from your local system
  2. File is uploaded to IPFS for decentralized storage
  3. Metadata is prepared and validated
  4. IP asset is registered on Story Protocol blockchain
  5. You receive transaction hash and IP asset ID

${chalk.yellow.bold('REQUIREMENTS:')}
  • Valid Ethereum wallet address (set with config or --address parameter)
  • Private key for transaction signing (see signing options below)
  • File must exist and be readable
  • API endpoint must be configured or provided
  • Internet connection for blockchain interaction

${chalk.yellow.bold('FIRST TIME SETUP:')}
  1. Quick setup: ${chalk.gray('storylite init')}
  2. Or manual: ${chalk.gray('storylite config set-endpoint <url> && storylite config set-address <address>')}

${chalk.yellow.bold('TRANSACTION SIGNING:')}
  ${chalk.cyan('Development:')} ${chalk.gray('storylite mint file.txt --private-key 0x...')}
  ${chalk.cyan('CI/CD:')} ${chalk.gray('export STORYLITE_PRIVATE_KEY=0x... && storylite mint file.txt')}
  ${chalk.cyan('Dry Run:')} ${chalk.gray('storylite mint file.txt --dry-run')}
  
  ${chalk.red('⚠️  Security:')} Never commit private keys to version control!

${chalk.yellow.bold('TROUBLESHOOTING:')}
  ${chalk.red('File not found:')} Check the file path is correct
  ${chalk.red('Invalid address:')} Ensure address starts with 0x and is 42 characters
  ${chalk.red('Upload failed:')} Check internet connection and API endpoint
  ${chalk.red('Transaction failed:')} Check wallet address and try again
  
  Use --verbose flag for detailed error information.
`
  )
  .action(
    wrapCommand(async (file: string, options: any) => {
      // Validate all arguments with smart error messages
      validateMintArguments(file, options);

      // Validate file exists after argument validation
      validateFile(file);

      // Initialize configuration
      const configManager = new ConfigManager();
      const config = configManager.getAll();

      // Override endpoint if provided
      if (options.endpoint) {
        config.endpoint = options.endpoint;
      }

      // Set verbose mode if enabled
      const isVerbose = options.verbose || process.env.STORYLITE_VERBOSE === 'true';
      if (isVerbose) {
        config.verbose = true;
      }

      // Initialize progress reporter
      const progress = createProgressReporter(isVerbose);

      // Get wallet address (from option or config default)
      let walletAddress = options.address;
      if (!walletAddress) {
        walletAddress = configManager.getAddress();
        if (!walletAddress) {
          throw new ValidationError(
            'No wallet address provided',
            'Either use --address flag or set default address with: storylite config set-address <address>'
          );
        }
        if (isVerbose) {
          progress.info(`Using default address from config: ${walletAddress}`);
        }
      } else if (isVerbose) {
        progress.info(`Using provided address: ${walletAddress}`);
      }

      // Initialize API client with progress reporter
      const apiClient = new APIClient(config, progress);

      try {
        // Apply default metadata if not provided
        const metadata = applyDefaultMetadata(file, options.title, options.description);

        // Validate metadata before proceeding
        const validation = validateMetadata(metadata.title, metadata.description);
        if (!validation.isValid) {
          throw new ValidationError(
            `Invalid metadata: ${validation.errors.join(', ')}`,
            'Check your title and description parameters'
          );
        }

        if (isVerbose) {
          progress.info(`Using title: "${metadata.title}"`);
          progress.info(`Using description: "${metadata.description}"`);
        }

        progress.start('📁 Reading file...');

        // Read file and prepare mint request with validated metadata
        const mintRequest = await apiClient.readFile(file, metadata.title, metadata.description);

        progress.update('🚀 Minting IP asset...');

        // Prepare the minting transaction
        const result = await apiClient.mintFile(mintRequest, walletAddress);

        if (!result.success) {
          progress.fail('✗ Transaction preparation failed');
          throw new Error(result.error || 'Failed to prepare minting transaction');
        }

        progress.update('📝 Transaction prepared, ready to sign...');

        // Handle dry run mode
        if (options.dryRun) {
          progress.succeed('✓ Transaction prepared successfully (dry run)');

          console.log(chalk.cyan('\n📋 Transaction Details:'));
          console.log(chalk.gray(`   To: ${result.transactionData?.to || 'Unknown'}`));
          console.log(
            chalk.gray(`   Gas Estimate: ${result.transactionData?.gasEstimate || 'Unknown'}`)
          );
          console.log(chalk.gray(`   Data: ${result.transactionData?.data || '0x'}`));
          console.log(chalk.gray(`   IPFS Hash: ${result.ipfsHash || 'Unknown'}`));

          console.log(chalk.yellow('\n💡 This was a dry run. To actually mint:'));
          console.log(
            chalk.gray('   storylite mint ' + file + ' --private-key <your-private-key>')
          );
          return;
        }

        // Sign and send transaction
        progress.update('🔐 Signing transaction...');

        const transactionSigner = new TransactionSigner();
        let signedTx;

        try {
          if (options.privateKey) {
            // Sign with provided private key
            signedTx = await transactionSigner.signForDevelopment(
              {
                to: result.transactionHash || '', // API returns transaction data in these fields
                data: result.ipAssetId || '0x',
                value: '0',
                gasEstimate: result.ipfsHash || '500000',
              },
              options.privateKey
            );
          } else if (process.env.STORYLITE_PRIVATE_KEY) {
            // Sign with environment variable (CI/CD)
            signedTx = await transactionSigner.signForCICD({
              to: result.transactionHash || '',
              data: result.ipAssetId || '0x',
              value: '0',
              gasEstimate: result.ipfsHash || '500000',
            });
          } else {
            // No signing method available
            progress.fail('✗ No signing method available');
            console.log(chalk.yellow('\n💡 To sign transactions, you need either:'));
            console.log(
              chalk.gray(
                '   1. Use --private-key flag: storylite mint file.txt --private-key 0x...'
              )
            );
            console.log(
              chalk.gray('   2. Set environment variable: export STORYLITE_PRIVATE_KEY=0x...')
            );
            console.log(chalk.gray('   3. Use dry run mode: storylite mint file.txt --dry-run'));
            throw new Error('No transaction signing method configured');
          }

          if (signedTx.success) {
            progress.succeed('✓ IP Asset created successfully!');

            console.log(chalk.cyan(`🔗 Transaction Hash: ${signedTx.hash}`));
            console.log(
              chalk.cyan(`📋 IP Asset ID: ${result.ipAssetId || 'Pending confirmation'}`)
            );

            if (result.ipfsHash) {
              console.log(chalk.gray(`📦 IPFS Hash: ${result.ipfsHash}`));
            }

            // Show explorer links
            const network = process.env.STORY_NETWORK === 'mainnet' ? 'mainnet' : 'aeneid';
            const explorerUrl =
              network === 'mainnet' ? 'https://storyscan.io' : 'https://aeneid.storyscan.io';

            console.log(chalk.gray(`🔍 View on explorer: ${explorerUrl}/tx/${signedTx.hash}`));
          } else {
            progress.fail('✗ Transaction failed');
            throw new Error(signedTx.error || 'Transaction signing failed');
          }
        } catch (signingError) {
          progress.fail('✗ Transaction signing failed');
          throw signingError;
        }
      } catch (error) {
        progress.stop();
        // Re-throw to be handled by wrapCommand
        throw error;
      }
    })
  );
