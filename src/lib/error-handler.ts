import chalk from 'chalk';
import { existsSync, statSync } from 'fs';
import { resolve } from 'path';

export enum ExitCode {
  SUCCESS = 0,
  GENERAL_ERROR = 1,
  INVALID_USAGE = 2,
  FILE_NOT_FOUND = 3,
  NETWORK_ERROR = 4,
  API_ERROR = 5,
  CONFIG_ERROR = 6,
  VALIDATION_ERROR = 7,
}

export interface CLIError extends Error {
  exitCode: ExitCode;
  suggestion?: string;
  details?: string;
}

export class StoryLiteError extends Error implements CLIError {
  public exitCode: ExitCode;
  public suggestion?: string;
  public details?: string;

  constructor(
    message: string,
    exitCode: ExitCode = ExitCode.GENERAL_ERROR,
    suggestion?: string,
    details?: string
  ) {
    super(message);
    this.name = 'StoryLiteError';
    this.exitCode = exitCode;
    this.suggestion = suggestion;
    this.details = details;
  }
}

export class FileNotFoundError extends StoryLiteError {
  constructor(filePath: string) {
    super(
      `File not found: ${filePath}`,
      ExitCode.FILE_NOT_FOUND,
      `Check the file path and ensure the file exists`,
      `Attempted to access: ${filePath}`
    );
  }
}

export class NetworkError extends StoryLiteError {
  constructor(message: string, details?: string) {
    super(
      `Network error: ${message}`,
      ExitCode.NETWORK_ERROR,
      'Check your internet connection and API endpoint configuration',
      details
    );
  }
}

export class APIError extends StoryLiteError {
  constructor(message: string, statusCode?: number, details?: string) {
    super(
      `API error: ${message}`,
      ExitCode.API_ERROR,
      statusCode === 401
        ? 'Check your API key configuration with: storylite config set-key <key>'
        : 'Verify your API endpoint and try again',
      details
    );
  }
}

export class ConfigError extends StoryLiteError {
  constructor(message: string, suggestion?: string) {
    super(
      `Configuration error: ${message}`,
      ExitCode.CONFIG_ERROR,
      suggestion || "Run 'storylite config --help' for configuration options"
    );
  }
}

export class ValidationError extends StoryLiteError {
  constructor(message: string, suggestion?: string) {
    super(
      `Validation error: ${message}`,
      ExitCode.VALIDATION_ERROR,
      suggestion || 'Check your input parameters and try again'
    );
  }
}

export function handleError(error: unknown): never {
  const isVerbose = process.env.STORYLITE_VERBOSE === 'true';

  if (error instanceof StoryLiteError) {
    // Format CLI errors with clean output
    console.error(chalk.red(`✗ ${error.message}`));

    if (error.suggestion) {
      console.error(chalk.gray(`💡 ${error.suggestion}`));
    }

    if (isVerbose && error.details) {
      // Sanitize details to remove sensitive information
      const sanitizedDetails = sanitizeForLogging(error.details);
      console.error(chalk.dim(`Details: ${sanitizedDetails}`));
    }

    if (isVerbose && error.stack) {
      // Sanitize stack trace to remove sensitive information
      const sanitizedStack = sanitizeForLogging(error.stack);
      console.error(chalk.dim(sanitizedStack));
    }

    process.exit(error.exitCode);
  } else if (error instanceof Error) {
    // Handle unexpected errors
    console.error(chalk.red(`✗ Unexpected error: ${error.message}`));
    console.error(chalk.gray('💡 Run with --verbose for more details'));

    if (isVerbose && error.stack) {
      // Sanitize stack trace to remove sensitive information
      const sanitizedStack = sanitizeForLogging(error.stack);
      console.error(chalk.dim(sanitizedStack));
    }

    process.exit(ExitCode.GENERAL_ERROR);
  } else {
    // Handle non-Error objects
    console.error(chalk.red(`✗ Unknown error occurred`));
    console.error(chalk.gray('💡 Run with --verbose for more details'));

    if (isVerbose) {
      // Sanitize error object to remove sensitive information
      const sanitizedError = sanitizeForLogging(String(error));
      console.error(chalk.dim(sanitizedError));
    }

    process.exit(ExitCode.GENERAL_ERROR);
  }
}

export function wrapCommand<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<void> {
  return async (...args: T): Promise<void> => {
    try {
      await fn(...args);
    } catch (error) {
      handleError(error);
      // Never reach here due to process.exit in handleError
    }
  };
}

export function validateFile(filePath: string): void {
  if (!filePath) {
    throw new ValidationError('File path is required');
  }

  const resolvedPath = resolve(filePath);

  if (!existsSync(resolvedPath)) {
    throw new FileNotFoundError(filePath);
  }

  const stats = statSync(resolvedPath);
  if (!stats.isFile()) {
    throw new ValidationError(
      `Path is not a file: ${filePath}`,
      'Provide a path to a regular file, not a directory'
    );
  }
}

export function formatSuccess(message: string): void {
  console.log(chalk.green(`✓ ${message}`));
}

export function formatInfo(message: string): void {
  console.log(chalk.cyan(`ℹ ${message}`));
}

export function formatWarning(message: string): void {
  console.log(chalk.yellow(`⚠ ${message}`));
}

export class InvalidArgumentError extends StoryLiteError {
  constructor(message: string, suggestion?: string, examples?: string[]) {
    const fullSuggestion = suggestion || 'Check your command arguments and try again';
    const exampleText =
      examples && examples.length > 0
        ? `\n\nExamples:\n${examples.map(ex => `  ${ex}`).join('\n')}`
        : '';

    super(`Invalid arguments: ${message}`, ExitCode.INVALID_USAGE, fullSuggestion + exampleText);
  }
}

export function validateMintArguments(file: string, options: any): void {
  const errors: string[] = [];
  const suggestions: string[] = [];
  const examples: string[] = [];

  // Check for missing file argument
  if (!file || file.trim() === '') {
    errors.push('File path is required');
    suggestions.push('Provide a file path as the first argument');
    examples.push('storylite mint ./my-file.txt --address 0x1234...');
  }

  // Address is now optional - will be handled by mint command logic

  // Validate address format if provided
  if (options.address && !options.address.match(/^0x[a-fA-F0-9]{40}$/)) {
    errors.push('Invalid wallet address format');
    suggestions.push('Address must be a valid Ethereum address (0x followed by 40 hex characters)');
    examples.push('storylite mint ./file.txt --address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532');
  }

  // Check for invalid endpoint format
  if (options.endpoint && !options.endpoint.match(/^https?:\/\/.+/)) {
    errors.push('Invalid endpoint URL format');
    suggestions.push('Endpoint must start with http:// or https://');
    examples.push(
      'storylite mint ./file.txt --endpoint https://api.example.com --address 0x1234...'
    );
  }

  // Check for empty title or description
  if (options.title !== undefined && options.title.trim() === '') {
    errors.push('Title cannot be empty');
    suggestions.push('Provide a meaningful title or omit the --title flag to use filename');
    examples.push('storylite mint ./file.txt --title "My Creation" --address 0x1234...');
  }

  if (options.description !== undefined && options.description.trim() === '') {
    errors.push('Description cannot be empty');
    suggestions.push(
      'Provide a meaningful description or omit the --description flag for auto-generation'
    );
    examples.push(
      'storylite mint ./file.txt --description "My amazing creation" --address 0x1234...'
    );
  }

  // Check for overly long metadata
  if (options.title && options.title.length > 100) {
    errors.push('Title is too long (maximum 100 characters)');
    suggestions.push('Shorten your title to 100 characters or less');
    examples.push('storylite mint ./file.txt --title "Concise Title" --address 0x1234...');
  }

  if (options.description && options.description.length > 500) {
    errors.push('Description is too long (maximum 500 characters)');
    suggestions.push('Shorten your description to 500 characters or less');
    examples.push(
      'storylite mint ./file.txt --description "Brief but informative description" --address 0x1234...'
    );
  }

  // Check for common mistakes
  if (file && file.startsWith('--')) {
    errors.push('File path appears to be a flag');
    suggestions.push('File path should be the first argument, before any flags');
    examples.push('storylite mint ./my-file.txt --address 0x1234... (not --address ./my-file.txt)');
  }

  // Check for missing protocol in address (common mistake)
  if (options.address && options.address.match(/^[a-fA-F0-9]{40}$/)) {
    errors.push('Address missing 0x prefix');
    suggestions.push('Ethereum addresses must start with 0x');
    examples.push(`storylite mint ./file.txt --address 0x${options.address}`);
  }

  // If there are errors, throw with helpful information
  if (errors.length > 0) {
    const message = errors.join(', ');
    const suggestion = suggestions.join('\n💡 ');
    const uniqueExamples = [...new Set(examples)];

    throw new InvalidArgumentError(message, suggestion, uniqueExamples);
  }
}

export function validateConfigArguments(command: string, args: any[]): void {
  const errors: string[] = [];
  const suggestions: string[] = [];
  const examples: string[] = [];

  switch (command) {
    case 'set-endpoint':
      if (!args[0] || args[0].trim() === '') {
        errors.push('URL is required');
        suggestions.push('Provide a valid URL as the first argument');
        examples.push('storylite config set-endpoint https://api.example.com');
      } else if (!args[0].match(/^https?:\/\/.+/)) {
        errors.push('Invalid URL format');
        suggestions.push('URL must start with http:// or https://');
        examples.push('storylite config set-endpoint https://api.example.com');
        examples.push('storylite config set-endpoint http://localhost:3000');
      }
      break;

    case 'set-key':
      if (!args[0] || args[0].trim() === '') {
        errors.push('API key is required');
        suggestions.push('Provide your API key as the first argument');
        examples.push('storylite config set-key sk_live_1234567890abcdef');
      } else if (args[0].length < 10) {
        errors.push('API key appears to be too short');
        suggestions.push('Verify you have the complete API key from your provider');
        examples.push('storylite config set-key sk_live_1234567890abcdef');
      }
      break;

    case 'set-address':
      if (!args[0] || args[0].trim() === '') {
        errors.push('Wallet address is required');
        suggestions.push('Provide a valid Ethereum address as the first argument');
        examples.push('storylite config set-address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532');
      } else if (!args[0].match(/^0x[a-fA-F0-9]{40}$/)) {
        errors.push('Invalid Ethereum address format');
        suggestions.push('Address must be 42 characters starting with 0x');
        examples.push('storylite config set-address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532');
      }
      break;

    case 'show':
      // No specific validation needed for show command
      break;

    default:
      if (command && !['set-endpoint', 'set-key', 'set-address', 'show'].includes(command)) {
        errors.push(`Unknown config subcommand: ${command}`);
        suggestions.push('Use one of the available subcommands');
        examples.push('storylite config set-endpoint <url>');
        examples.push('storylite config set-key <key>');
        examples.push('storylite config set-address <address>');
        examples.push('storylite config show');
      }
      break;
  }

  if (errors.length > 0) {
    const message = errors.join(', ');
    const suggestion = suggestions.join('\n💡 ');
    const uniqueExamples = [...new Set(examples)];

    throw new InvalidArgumentError(message, suggestion, uniqueExamples);
  }
}

export function suggestCommand(unknownCommand: string): string {
  const availableCommands = ['mint', 'config'];
  const suggestions: string[] = [];

  // Simple fuzzy matching for common typos
  for (const cmd of availableCommands) {
    if (cmd.includes(unknownCommand) || unknownCommand.includes(cmd)) {
      suggestions.push(cmd);
    }
  }

  // Check for common typos
  const typoMap: Record<string, string> = {
    min: 'mint',
    mnt: 'mint',
    create: 'mint',
    upload: 'mint',
    cfg: 'config',
    conf: 'config',
    configure: 'config',
    settings: 'config',
    setup: 'config',
  };

  if (typoMap[unknownCommand.toLowerCase()]) {
    suggestions.push(typoMap[unknownCommand.toLowerCase()]);
  }

  if (suggestions.length > 0) {
    const uniqueSuggestions = [...new Set(suggestions)];
    return `Did you mean: ${uniqueSuggestions.map(s => `'${s}'`).join(' or ')}?`;
  }

  return `Available commands: ${availableCommands.map(s => `'${s}'`).join(', ')}`;
}

/**
 * Sanitize text for logging by removing sensitive information
 */
function sanitizeForLogging(text: string): string {
  if (!text) return text;

  let sanitized = text;

  // Remove API keys (patterns like Bearer tokens, API keys)
  sanitized = sanitized.replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/g, 'Bearer [REDACTED]');
  sanitized = sanitized.replace(
    /api[_-]?key['":\s]*[A-Za-z0-9\-._~+/]+=*/gi,
    'api_key: [REDACTED]'
  );

  // Remove private keys and secrets
  sanitized = sanitized.replace(
    /private[_-]?key['":\s]*[A-Za-z0-9\-._~+/]+=*/gi,
    'private_key: [REDACTED]'
  );
  sanitized = sanitized.replace(/secret['":\s]*[A-Za-z0-9\-._~+/]+=*/gi, 'secret: [REDACTED]');

  // Remove wallet addresses and transaction hashes (but keep format for debugging)
  sanitized = sanitized.replace(/0x[a-fA-F0-9]{40}/g, '0x[ADDRESS_REDACTED]');
  sanitized = sanitized.replace(/0x[a-fA-F0-9]{64}/g, '0x[HASH_REDACTED]');

  // Remove potential passwords
  sanitized = sanitized.replace(/password['":\s]*[^\s"',}]*/gi, 'password: [REDACTED]');

  // Remove Authorization headers
  sanitized = sanitized.replace(/Authorization['":\s]*[^\s"',}]*/gi, 'Authorization: [REDACTED]');

  return sanitized;
}
