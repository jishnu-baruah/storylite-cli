import { Command } from 'commander';
import chalk from 'chalk';
import {
    wrapCommand,
    ValidationError,
    formatSuccess,
    formatInfo,
    validateConfigArguments,
} from '../lib/error-handler.js';
import { ConfigManager } from '../config/config-manager.js';
import { createProgressReporter } from '../lib/progress-reporter.js';

const configManager = new ConfigManager();

export const configCommand = new Command('config')
    .description('Manage CLI configuration settings')
    .addHelpText(
        'before',
        `
${chalk.cyan.bold('CONFIGURATION COMMAND')}
Manage your StoryLite CLI settings including API endpoints and authentication.
Configuration is stored securely on your local system.
`
    )
    .addHelpText(
        'after',
        `
${chalk.yellow.bold('AVAILABLE SUBCOMMANDS:')}
  ${chalk.cyan('set-endpoint')}  Configure the Universal Minting Engine API URL
  ${chalk.cyan('set-key')}       Set optional API key for authenticated requests
  ${chalk.cyan('set-address')}   Set default wallet address for minting
  ${chalk.cyan('show')}          Display current configuration settings

${chalk.yellow.bold('DETAILED EXAMPLES:')}

  ${chalk.cyan('# Set up for local development')}
  ${chalk.gray('$ storylite config set-endpoint http://localhost:3000')}

  ${chalk.cyan('# Configure for production API')}
  ${chalk.gray('$ storylite config set-endpoint https://api.storylite.com')}

  ${chalk.cyan('# Set API key for authenticated requests')}
  ${chalk.gray('$ storylite config set-key sk_live_1234567890abcdef')}

  ${chalk.cyan('# View current settings')}
  ${chalk.gray('$ storylite config show')}

  ${chalk.cyan('# View detailed configuration with verbose output')}
  ${chalk.gray('$ storylite config show --verbose')}

${chalk.yellow.bold('CONFIGURATION WORKFLOW:')}
  1. First, set your API endpoint:
     ${chalk.gray('$ storylite config set-endpoint <your-api-url>')}
  
  2. Optionally, set an API key if required:
     ${chalk.gray('$ storylite config set-key <your-api-key>')}
  
  3. Set your default wallet address:
     ${chalk.gray('$ storylite config set-address <your-wallet-address>')}
  
  4. Verify your configuration:
     ${chalk.gray('$ storylite config show')}
  
  5. Start minting IP assets (no address needed!):
     ${chalk.gray('$ storylite mint <file>')}

${chalk.yellow.bold('SECURITY NOTES:')}
  • API keys are stored securely using OS-level encryption
  • Configuration files are stored in your user directory
  • Sensitive values are masked when displayed
  • Use --verbose to see configuration file locations

${chalk.yellow.bold('COMMON ENDPOINTS:')}
  ${chalk.cyan('Local Development:')} http://localhost:3000
  ${chalk.cyan('Testnet:')} https://testnet-api.storylite.com
  ${chalk.cyan('Mainnet:')} https://api.storylite.com
  ${chalk.cyan('Custom:')} Your own Universal Minting Engine deployment

${chalk.yellow.bold('TROUBLESHOOTING:')}
  ${chalk.red('Invalid URL:')} Ensure URL starts with http:// or https://
  ${chalk.red('Permission denied:')} Check file system permissions
  ${chalk.red('Config not found:')} Run set-endpoint to initialize configuration
  
  Use individual subcommand help for more details:
  ${chalk.gray('$ storylite config set-endpoint --help')}
`
    )
    .action(() => {
        formatInfo('📋 StoryLite CLI Configuration');
        console.log(chalk.gray('Available subcommands: set-endpoint, set-key, set-address, show'));
        console.log(chalk.gray('Use --help with any subcommand for more details'));
        console.log();
        console.log(chalk.yellow('💡 Quick start:'));
        console.log(chalk.gray('  1. storylite config set-endpoint <your-api-url>'));
        console.log(chalk.gray('  2. storylite config set-address <your-wallet-address>'));
    });

// Add subcommands with error handling
configCommand
    .command('set-endpoint')
    .description('Configure the Universal Minting Engine API endpoint')
    .argument(
        '<url>',
        'Full URL to your Universal Minting Engine API (must include http:// or https://)'
    )
    .option('-v, --verbose', 'Show detailed configuration process and file locations')
    .addHelpText(
        'after',
        `
${chalk.yellow.bold('EXAMPLES:')}
  ${chalk.cyan('# Local development server')}
  ${chalk.gray('$ storylite config set-endpoint http://localhost:3000')}

  ${chalk.cyan('# Production API')}
  ${chalk.gray('$ storylite config set-endpoint https://api.storylite.com')}

  ${chalk.cyan('# Custom deployment with verbose output')}
  ${chalk.gray('$ storylite config set-endpoint https://my-api.example.com --verbose')}

${chalk.yellow.bold('URL REQUIREMENTS:')}
  • Must start with http:// or https://
  • Should point to a running Universal Minting Engine instance
  • Port numbers are supported (e.g., :3000, :8080)
  • Subpaths are supported (e.g., /api/v1)

${chalk.yellow.bold('WHAT THIS DOES:')}
  • Validates the URL format
  • Stores the endpoint in your local configuration
  • Makes it the default for all mint operations
  • Can be overridden per-command with --endpoint flag
`
    )
    .action(
        wrapCommand(async (url: string, options: any) => {
            // Validate arguments with smart error messages
            validateConfigArguments('set-endpoint', [url]);

            const isVerbose = options.verbose || process.env.STORYLITE_VERBOSE === 'true';
            const progress = createProgressReporter(isVerbose);

            try {
                if (isVerbose) {
                    progress.info(`Validating URL format: ${url}`);
                }

                configManager.setEndpoint(url);

                if (isVerbose) {
                    progress.info('Configuration saved to local storage');
                    progress.info(`Config location: ${configManager.getConfigPath()}`);
                }

                formatSuccess(`✓ Endpoint set to: ${url}`);
            } catch (error) {
                if (isVerbose) {
                    progress.fail(`URL validation failed: ${error}`);
                }
                throw new ValidationError('Invalid URL format', 'URL must start with http:// or https://');
            }
        })
    );

configCommand
    .command('set-key')
    .description('Store API key for authenticated requests (optional)')
    .argument('<key>', 'Your API key from the Universal Minting Engine dashboard')
    .option('-v, --verbose', 'Show detailed storage process and security information')
    .addHelpText(
        'after',
        `
${chalk.yellow.bold('EXAMPLES:')}
  ${chalk.cyan('# Set API key for authenticated requests')}
  ${chalk.gray('$ storylite config set-key sk_live_1234567890abcdef')}

  ${chalk.cyan('# Set with verbose security information')}
  ${chalk.gray('$ storylite config set-key sk_test_abcdef1234567890 --verbose')}

${chalk.yellow.bold('SECURITY FEATURES:')}
  • Keys are encrypted using OS-level security
  • Stored in secure system keychain when available
  • Never logged or displayed in plain text
  • Automatically masked in configuration display

${chalk.yellow.bold('WHEN YOU NEED AN API KEY:')}
  • Some Universal Minting Engine deployments require authentication
  • Rate limiting and usage tracking
  • Access to premium features
  • Enterprise deployments

${chalk.yellow.bold('KEY FORMATS:')}
  • Usually starts with sk_live_ or sk_test_
  • Length varies by provider
  • Case-sensitive alphanumeric strings
  • Contact your API provider for the correct format
`
    )
    .action(
        wrapCommand(async (key: string, options: any) => {
            // Validate arguments with smart error messages
            validateConfigArguments('set-key', [key]);

            const isVerbose = options.verbose || process.env.STORYLITE_VERBOSE === 'true';
            const progress = createProgressReporter(isVerbose);

            try {
                if (isVerbose) {
                    progress.info(`Storing API key (length: ${key.length} characters)`);
                    progress.info('Using secure storage mechanism');
                }

                configManager.setApiKey(key);

                if (isVerbose) {
                    progress.info('API key encrypted and stored');
                    progress.info(`Config location: ${configManager.getConfigPath()}`);
                }

                formatSuccess('✓ API key stored securely');
            } catch (error) {
                if (isVerbose) {
                    progress.fail(`Failed to store API key: ${error}`);
                }
                throw new ValidationError('API key cannot be empty');
            }
        })
    );

configCommand
    .command('set-address')
    .description('Set default wallet address for minting operations')
    .argument('<address>', 'Your Ethereum wallet address (42 characters starting with 0x)')
    .option('-v, --verbose', 'Show detailed address validation and storage process')
    .addHelpText(
        'after',
        `
${chalk.yellow.bold('EXAMPLES:')}
  ${chalk.cyan('# Set default wallet address')}
  ${chalk.gray('$ storylite config set-address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532')}

  ${chalk.cyan('# Set with verbose validation output')}
  ${chalk.gray('$ storylite config set-address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532 --verbose')}

${chalk.yellow.bold('ADDRESS REQUIREMENTS:')}
  • Must be exactly 42 characters long
  • Must start with 0x
  • Must contain only hexadecimal characters (0-9, a-f, A-F)
  • Case-insensitive (will be stored in lowercase)

${chalk.yellow.bold('WHAT THIS DOES:')}
  • Validates the Ethereum address format
  • Stores the address in your local configuration
  • Makes it the default for all mint operations
  • Can still be overridden per-command with --address flag

${chalk.yellow.bold('AFTER SETTING ADDRESS:')}
  • Mint without typing address: ${chalk.gray('storylite mint file.txt')}
  • Override if needed: ${chalk.gray('storylite mint file.txt --address 0x...')}
  • View stored address: ${chalk.gray('storylite config show')}

${chalk.yellow.bold('SECURITY NOTES:')}
  • Only the address is stored, never private keys
  • Address is stored in plain text (it's public information)
  • You still need to sign transactions with your wallet
`
    )
    .action(
        wrapCommand(async (address: string, options: any) => {
            // Validate arguments with smart error messages
            validateConfigArguments('set-address', [address]);

            const isVerbose = options.verbose || process.env.STORYLITE_VERBOSE === 'true';
            const progress = createProgressReporter(isVerbose);

            try {
                if (isVerbose) {
                    progress.info(`Validating Ethereum address format: ${address}`);
                }

                configManager.setAddress(address);

                if (isVerbose) {
                    progress.info('Address validated and stored');
                    progress.info(`Config location: ${configManager.getConfigPath()}`);
                    progress.info('You can now mint without specifying --address');
                }

                formatSuccess(`✓ Default address set to: ${address}`);
                console.log(chalk.gray('💡 You can now mint files without specifying --address'));
            } catch (error) {
                if (isVerbose) {
                    progress.fail(`Address validation failed: ${error}`);
                }
                throw new ValidationError(
                    'Invalid Ethereum address format',
                    'Address must be 42 characters starting with 0x (e.g., 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532)'
                );
            }
        })
    );

configCommand
    .command('show')
    .description('Display current configuration settings')
    .option('-v, --verbose', 'Show additional details including file paths and raw configuration')
    .addHelpText(
        'after',
        `
${chalk.yellow.bold('EXAMPLES:')}
  ${chalk.cyan('# View basic configuration')}
  ${chalk.gray('$ storylite config show')}

  ${chalk.cyan('# View detailed configuration with file paths')}
  ${chalk.gray('$ storylite config show --verbose')}

${chalk.yellow.bold('DISPLAYED INFORMATION:')}
  • API endpoint URL
  • API key status (masked for security)
  • Configuration validation status
  • Default timeout settings
  • Verbose mode preference

${chalk.yellow.bold('VERBOSE MODE SHOWS:')}
  • Configuration file location
  • Raw configuration values
  • Storage mechanism details
  • Security and encryption status

${chalk.yellow.bold('CONFIGURATION STATUS:')}
  ${chalk.green('✓ Valid:')} All required settings are configured
  ${chalk.yellow('⚠ Incomplete:')} Missing required endpoint configuration
  ${chalk.red('✗ Invalid:')} Configuration has errors that need fixing
`
    )
    .action(
        wrapCommand(async (options: any) => {
            const isVerbose = options.verbose || process.env.STORYLITE_VERBOSE === 'true';
            const progress = createProgressReporter(isVerbose);
            const config = configManager.getDisplayConfig();

            if (isVerbose) {
                progress.info(`Loading configuration from: ${configManager.getConfigPath()}`);
                progress.info('Reading stored configuration values');
            }

            formatInfo('📋 Current Configuration');
            console.log();

            // Display configuration in a clean format
            Object.entries(config).forEach(([key, value]) => {
                const label = key.charAt(0).toUpperCase() + key.slice(1);
                const formattedKey = chalk.cyan(`${label}:`);
                const formattedValue =
                    key === 'apiKey' && value !== 'Not set' ? chalk.yellow(value) : chalk.white(value);

                console.log(`  ${formattedKey.padEnd(15)} ${formattedValue}`);
            });

            console.log();

            // Show validation status
            if (configManager.isValid()) {
                console.log(chalk.green('✓ Configuration is valid'));
                if (isVerbose) {
                    progress.info('All required configuration values are present');
                }
            } else {
                console.log(chalk.yellow('⚠ Configuration incomplete - set endpoint to continue'));
                if (isVerbose) {
                    progress.warn('Missing required configuration values');
                }
            }

            if (isVerbose) {
                const rawConfig = configManager.getAll();
                progress.info('Raw configuration details:');
                console.log(chalk.gray(`  Timeout: ${rawConfig.timeout}ms`));
                console.log(chalk.gray(`  Verbose: ${rawConfig.verbose}`));
            }
        })
    );
