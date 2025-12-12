#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { mintCommand } from './commands/mint.js';
import { configCommand } from './commands/config.js';
import { initCommand } from './commands/init.js';
import { suggestCommand, handleError } from './lib/error-handler.js';

// Set up global error handlers to prevent stack traces in production
process.on('uncaughtException', error => {
  if (process.env.STORYLITE_VERBOSE !== 'true') {
    // In non-verbose mode, just exit cleanly
    process.exit(1);
  } else {
    handleError(error);
  }
});

process.on('unhandledRejection', reason => {
  if (process.env.STORYLITE_VERBOSE !== 'true') {
    // In non-verbose mode, just exit cleanly
    process.exit(1);
  } else {
    handleError(reason);
  }
});

const program = new Command();

program
  .name('storylite')
  .description(
    'The cURL for Intellectual Property - A CLI tool for minting IP assets via Story Protocol'
  )
  .version('1.0.0')
  .option('-v, --verbose', 'Enable verbose output')
  .option('--no-color', 'Disable colored output')
  .addHelpText(
    'before',
    `
${chalk.cyan.bold('StoryLite CLI - The cURL for Intellectual Property')}

A streamlined command-line tool for minting intellectual property assets
through Story Protocol. Perfect for developers, creators, and CI/CD pipelines.
`
  )
  .addHelpText(
    'after',
    `
${chalk.yellow.bold('QUICK START:')}
  1. Run the setup wizard:
     ${chalk.gray('$ storylite init')}
  
  2. Mint your first IP asset:
     ${chalk.gray('$ storylite mint ./my-file.txt --private-key 0x...')}

${chalk.yellow.bold('COMMON EXAMPLES:')}
  ${chalk.cyan('# Quick setup wizard')}
  ${chalk.gray('$ storylite init')}
  
  ${chalk.cyan('# Mint a source code file')}
  ${chalk.gray('$ storylite mint ./algorithm.py --title "ML Algorithm" --private-key 0x...')}
  
  ${chalk.cyan('# Mint with environment variable (CI/CD)')}
  ${chalk.gray('$ export STORYLITE_PRIVATE_KEY=0x... && storylite mint ./artwork.png')}
  
  ${chalk.cyan("# Dry run (prepare but don't send)")}
  ${chalk.gray('$ storylite mint ./document.pdf --dry-run')}

${chalk.yellow.bold('CONFIGURATION:')}
  ${chalk.gray('$ storylite init                         # Interactive setup wizard')}
  ${chalk.gray('$ storylite config set-endpoint <url>    # Set API endpoint')}
  ${chalk.gray('$ storylite config set-address <addr>    # Set wallet address')}
  ${chalk.gray('$ storylite config show                  # View current settings')}

${chalk.yellow.bold('GETTING HELP:')}
  ${chalk.gray('$ storylite --help                       # Show this help')}
  ${chalk.gray('$ storylite <command> --help             # Command-specific help')}
  ${chalk.gray('$ storylite mint --help                  # Mint command help')}
  ${chalk.gray('$ storylite config --help                # Config command help')}

${chalk.yellow.bold('SUPPORTED FILE TYPES:')}
  Documents: .pdf, .txt, .md, .doc, .docx
  Images: .jpg, .jpeg, .png, .gif, .svg, .webp
  Code: .js, .ts, .py, .java, .cpp, .rs, .go
  Audio: .mp3, .wav, .flac, .aac
  Video: .mp4, .avi, .mov, .webm
  Archives: .zip, .tar, .gz
  And many more...

${chalk.yellow.bold('NEED HELP?')}
  Documentation: https://docs.story.foundation
  Issues: https://github.com/story-protocol/storylite-cli/issues
  Community: https://discord.gg/storyprotocol
`
  )
  .hook('preAction', thisCommand => {
    // Set global options that can be accessed by all commands
    const opts = thisCommand.opts();
    if (opts.noColor) {
      chalk.level = 0;
    }
    if (opts.verbose) {
      process.env.STORYLITE_VERBOSE = 'true';
    }
  });

// Add commands
program.addCommand(initCommand);
program.addCommand(mintCommand);
program.addCommand(configCommand);

// Custom help formatting
program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: cmd => cmd.name() + ' ' + cmd.usage(),
});

// Enhanced error handling for unknown commands with smart suggestions
program.on('command:*', operands => {
  const unknownCommand = operands[0];
  console.error(chalk.red(`✗ Unknown command: ${unknownCommand}`));

  // Provide smart suggestions
  const suggestion = suggestCommand(unknownCommand);
  console.log(chalk.gray(`💡 ${suggestion}`));

  console.log(chalk.gray("💡 Run 'storylite --help' to see all available commands"));

  // Show common examples for quick reference
  console.log();
  console.log(chalk.yellow('Quick examples:'));
  console.log(chalk.gray('  storylite mint ./file.txt --address 0x1234...'));
  console.log(chalk.gray('  storylite config set-endpoint https://api.example.com'));
  console.log(chalk.gray('  storylite --help'));

  process.exit(1);
});

// Handle unknown options with helpful messages
program.configureOutput({
  writeErr: str => {
    // Enhance error messages for common mistakes
    let enhancedStr = str;

    if (str.includes('unknown option')) {
      const match = str.match(/unknown option '([^']+)'/);
      if (match) {
        const unknownOption = match[1];
        enhancedStr = chalk.red(`✗ Unknown option: ${unknownOption}\n`);

        // Suggest common alternatives
        const optionSuggestions: Record<string, string> = {
          '--addr': '--address',
          '--url': '--endpoint',
          '--key': 'Use: storylite config set-key <key>',
          '--help': '--help (already available)',
          '-h': '--help',
          '--version': '--version (already available)',
          '-V': '--version',
        };

        if (optionSuggestions[unknownOption]) {
          enhancedStr += chalk.gray(`💡 Did you mean: ${optionSuggestions[unknownOption]}\n`);
        } else {
          enhancedStr += chalk.gray(
            "💡 Run 'storylite <command> --help' to see available options\n"
          );
        }

        enhancedStr += chalk.gray(
          '💡 Common options: --address, --title, --description, --verbose\n'
        );
      }
    } else if (str.includes('missing required argument')) {
      enhancedStr = chalk.red('✗ Missing required argument\n');
      enhancedStr += chalk.gray('💡 Example: storylite mint ./file.txt --address 0x1234...\n');
      enhancedStr += chalk.gray("💡 Run 'storylite --help' for usage information\n");
    }

    process.stderr.write(enhancedStr);
  },
  writeOut: str => process.stdout.write(str),
});

// Show help when no command is provided (before parsing)
if (!process.argv.slice(2).length) {
  console.log(chalk.cyan.bold('StoryLite CLI - The cURL for Intellectual Property\n'));
  program.help();
  process.exit(0);
}

// Parse command line arguments
program.parse();
