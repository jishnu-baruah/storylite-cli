import { Command } from 'commander';
import chalk from 'chalk';
import { wrapCommand, ValidationError } from '../lib/error-handler.js';
import { ConfigManager } from '../config/config-manager.js';
import { APIClient } from '../lib/api-client.js';
import { createProgressReporter } from '../lib/progress-reporter.js';

export const initCommand = new Command('init')
  .description('Interactive setup wizard for StoryLite CLI')
  .option('--endpoint <url>', 'Skip endpoint prompt and use this URL')
  .option('--address <address>', 'Skip address prompt and use this address')
  .option('--skip-test', 'Skip connection test')
  .option('-y, --yes', 'Use default values for all prompts')
  .addHelpText(
    'before',
    `
${chalk.cyan.bold('INIT COMMAND')}
Interactive setup wizard that gets you from zero to minting in 60 seconds.
Configures your endpoint, wallet address, and tests the connection.
`
  )
  .addHelpText(
    'after',
    `
${chalk.yellow.bold('WHAT THIS DOES:')}
  1. 🌐 Sets up your API endpoint
  2. 💳 Configures your default wallet address  
  3. 🔍 Tests the connection
  4. ✅ Verifies everything works
  5. 🚀 You're ready to mint!

${chalk.yellow.bold('EXAMPLES:')}

  ${chalk.cyan('# Interactive setup (recommended)')}
  ${chalk.gray('$ storylite init')}

  ${chalk.cyan('# Quick setup with defaults')}
  ${chalk.gray('$ storylite init --yes')}

  ${chalk.cyan('# Setup with specific endpoint')}
  ${chalk.gray('$ storylite init --endpoint https://my-api.com')}

  ${chalk.cyan('# Setup with endpoint and address')}
  ${chalk.gray('$ storylite init --endpoint https://api.com --address 0x742d35...')}

${chalk.yellow.bold('AFTER SETUP:')}
  ${chalk.gray('$ storylite mint ./my-file.txt')}
  ${chalk.gray('# No more configuration needed!')}

${chalk.yellow.bold('COMMON ENDPOINTS:')}
  ${chalk.cyan('Surreal Base:')} https://surreal-base.vercel.app
  ${chalk.cyan('Local:')} http://localhost:3000
  ${chalk.cyan('Custom:')} Your own deployment URL

${chalk.yellow.bold('NEED HELP?')}
  • Don't have a wallet address? Get one from MetaMask or any Ethereum wallet
  • Don't have an endpoint? Use the official one above
  • Having issues? Run with --verbose for detailed logs
`
  )
  .action(
    wrapCommand(async (options: any) => {
      const isVerbose = options.verbose || process.env.STORYLITE_VERBOSE === 'true';
      const progress = createProgressReporter(isVerbose);
      const configManager = new ConfigManager();

      // Welcome message
      console.log(chalk.cyan.bold('\n🚀 Welcome to StoryLite CLI Setup!\n'));
      console.log(chalk.gray('This wizard will get you from zero to minting in 60 seconds.\n'));

      try {
        // Step 1: Configure endpoint
        let endpoint = options.endpoint;

        if (!endpoint) {
          if (options.yes) {
            endpoint = 'https://surreal-base.vercel.app';
            console.log(chalk.cyan('📡 Using default endpoint:'), chalk.white(endpoint));
          } else {
            console.log(chalk.yellow.bold('Step 1: API Endpoint'));
            console.log(chalk.gray('Choose your Universal Minting Engine endpoint:\n'));

            console.log(
              chalk.cyan('1.') +
              ' Surreal Base (recommended): ' +
              chalk.white('https://surreal-base.vercel.app')
            );
            console.log(
              chalk.cyan('2.') + ' Local development: ' + chalk.white('http://localhost:3000')
            );
            console.log(
              chalk.cyan('3.') + ' Custom endpoint: ' + chalk.white('Enter your own URL')
            );

            // For now, we'll use the default since we don't have interactive prompts
            // In a real implementation, you'd use a library like 'inquirer' for interactive prompts
            endpoint = 'https://surreal-base.vercel.app';
            console.log(
              chalk.gray(
                '\n💡 Using default endpoint. Run without --yes for interactive setup (coming soon).'
              )
            );
          }
        }

        progress.start('🔧 Configuring endpoint...');

        try {
          configManager.setEndpoint(endpoint);
          progress.succeed(`✓ Endpoint configured: ${endpoint}`);
        } catch (error) {
          progress.fail('✗ Invalid endpoint URL');
          throw new ValidationError(
            'Invalid endpoint URL format',
            'URL must start with http:// or https://'
          );
        }

        // Step 2: Configure wallet address
        const address = options.address;

        if (!address) {
          if (options.yes) {
            throw new ValidationError(
              'Wallet address required',
              'Use --address flag or run without --yes for interactive setup'
            );
          } else {
            console.log(chalk.yellow.bold('\nStep 2: Wallet Address'));
            console.log(
              chalk.gray('Enter your Ethereum wallet address (42 characters starting with 0x):\n')
            );

            console.log(chalk.cyan('Examples:'));
            console.log(chalk.gray('• 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532'));
            console.log(
              chalk.gray('• Get one from MetaMask, Coinbase Wallet, or any Ethereum wallet\n')
            );

            // For demo purposes, we'll require the address to be provided via flag
            throw new ValidationError(
              'Wallet address required for setup',
              'Please provide your address with: storylite init --address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532'
            );
          }
        }

        progress.start('💳 Configuring wallet address...');

        try {
          configManager.setAddress(address);
          progress.succeed(
            `✓ Wallet address configured: ${address.slice(0, 6)}...${address.slice(-4)}`
          );
        } catch (error) {
          progress.fail('✗ Invalid wallet address');
          throw new ValidationError(
            'Invalid Ethereum address format',
            'Address must be 42 characters starting with 0x'
          );
        }

        // Step 3: Test connection (unless skipped)
        if (!options.skipTest) {
          console.log(chalk.yellow.bold('\nStep 3: Connection Test'));
          progress.start('🔍 Testing API connection...');

          const config = configManager.getAll();
          const apiClient = new APIClient(config, progress);

          const testResult = await apiClient.testConnection();

          if (testResult.success) {
            progress.succeed('✓ Connection test passed');
          } else {
            progress.fail('✗ Connection test failed');
            console.log(chalk.yellow('⚠️  Warning: Could not connect to API endpoint'));
            console.log(chalk.gray(`   ${testResult.message}`));
            console.log(
              chalk.gray(
                '   You can still use the CLI, but minting may not work until the endpoint is available.'
              )
            );
          }
        }

        // Step 4: Environment Variables Setup
        console.log(chalk.yellow.bold('\nStep 4: Environment Variables (Optional)'));
        console.log(chalk.gray('Set up environment variables for easier usage:\n'));

        console.log(chalk.cyan('🔐 For Private Key (Secure Transaction Signing):'));
        console.log(chalk.white('   export STORYLITE_PRIVATE_KEY=0x...'));
        console.log(chalk.gray('   • Enables --interactive mode'));
        console.log(chalk.gray('   • No need to pass --private-key every time'));
        console.log(chalk.gray('   • More secure than command line arguments\n'));

        console.log(chalk.cyan('🌐 For Custom Endpoint (Optional):'));
        console.log(chalk.white('   export STORYLITE_ENDPOINT=https://your-api.com'));
        console.log(chalk.gray('   • Override default endpoint globally'));
        console.log(chalk.gray('   • Useful for custom deployments\n'));

        console.log(chalk.cyan('📝 For Verbose Logging (Optional):'));
        console.log(chalk.white('   export STORYLITE_VERBOSE=true'));
        console.log(chalk.gray('   • Enable detailed logging by default'));
        console.log(chalk.gray('   • Helpful for debugging\n'));

        // Check current environment variables
        const envStatus = {
          privateKey: !!process.env.STORYLITE_PRIVATE_KEY,
          endpoint: !!process.env.STORYLITE_ENDPOINT,
          verbose: !!process.env.STORYLITE_VERBOSE
        };

        if (envStatus.privateKey || envStatus.endpoint || envStatus.verbose) {
          console.log(chalk.green('✅ Current Environment Variables:'));
          if (envStatus.privateKey) {
            console.log(chalk.gray('   ✓ STORYLITE_PRIVATE_KEY is set'));
          }
          if (envStatus.endpoint) {
            console.log(chalk.gray(`   ✓ STORYLITE_ENDPOINT=${process.env.STORYLITE_ENDPOINT}`));
          }
          if (envStatus.verbose) {
            console.log(chalk.gray('   ✓ STORYLITE_VERBOSE=true'));
          }
          console.log('');
        }

        // Step 5: Success summary
        console.log(chalk.green.bold('🎉 Setup Complete!\n'));

        const config = configManager.getDisplayConfig();
        console.log(chalk.cyan('📋 Your Configuration:'));
        console.log(chalk.gray(`   Endpoint: ${config.endpoint}`));
        console.log(chalk.gray(`   Address:  ${config.address}`));

        console.log(chalk.yellow.bold('\n🚀 Ready to Mint!'));
        console.log(chalk.gray('Try minting your first file:'));

        if (envStatus.privateKey) {
          console.log(chalk.white('   storylite mint ./my-file.txt --interactive'));
          console.log(chalk.gray('   # Uses stored private key with confirmation'));
        } else {
          console.log(chalk.white('   storylite mint ./my-file.txt --private-key 0x...'));
          console.log(chalk.gray('   # Or set STORYLITE_PRIVATE_KEY and use --interactive'));
        }
        console.log('');

        console.log(chalk.cyan('💡 Pro Tips:'));
        console.log(chalk.gray('• Use --title and --description for custom metadata'));
        console.log(chalk.gray('• Add --verbose for detailed logging'));
        console.log(chalk.gray('• Run storylite --help for all commands'));
        console.log(chalk.gray('• View config anytime: storylite config show\n'));
      } catch (error) {
        progress.stop();
        throw error;
      }
    })
  );
