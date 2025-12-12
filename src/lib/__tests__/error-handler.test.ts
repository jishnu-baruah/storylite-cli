import {
  ExitCode,
  StoryLiteError,
  FileNotFoundError,
  NetworkError,
  APIError,
  ConfigError,
  ValidationError,
  handleError,
  wrapCommand,
  validateFile,
  formatSuccess,
  formatInfo,
  formatWarning,
} from '../error-handler.js';
import * as fs from 'fs';
import * as path from 'path';

// Mock chalk
jest.mock('chalk', () => ({
  red: jest.fn(text => text),
  green: jest.fn(text => text),
  cyan: jest.fn(text => text),
  yellow: jest.fn(text => text),
  gray: jest.fn(text => text),
  dim: jest.fn(text => text),
}));

// Mock console methods
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called');
});

// Mock fs methods
jest.mock('fs');
jest.mock('path');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('Error Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.STORYLITE_VERBOSE;
  });

  describe('StoryLiteError classes', () => {
    test('StoryLiteError should have correct properties', () => {
      const error = new StoryLiteError(
        'Test error',
        ExitCode.GENERAL_ERROR,
        'Test suggestion',
        'Test details'
      );

      expect(error.message).toBe('Test error');
      expect(error.exitCode).toBe(ExitCode.GENERAL_ERROR);
      expect(error.suggestion).toBe('Test suggestion');
      expect(error.details).toBe('Test details');
      expect(error.name).toBe('StoryLiteError');
    });

    test('FileNotFoundError should format correctly', () => {
      const error = new FileNotFoundError('/path/to/file.txt');

      expect(error.message).toBe('File not found: /path/to/file.txt');
      expect(error.exitCode).toBe(ExitCode.FILE_NOT_FOUND);
      expect(error.suggestion).toBe('Check the file path and ensure the file exists');
      expect(error.details).toBe('Attempted to access: /path/to/file.txt');
    });

    test('NetworkError should format correctly', () => {
      const error = new NetworkError('Connection timeout', 'Server unreachable');

      expect(error.message).toBe('Network error: Connection timeout');
      expect(error.exitCode).toBe(ExitCode.NETWORK_ERROR);
      expect(error.suggestion).toBe(
        'Check your internet connection and API endpoint configuration'
      );
      expect(error.details).toBe('Server unreachable');
    });

    test('APIError should provide correct suggestion for 401', () => {
      const error = new APIError('Unauthorized', 401);

      expect(error.message).toBe('API error: Unauthorized');
      expect(error.exitCode).toBe(ExitCode.API_ERROR);
      expect(error.suggestion).toBe(
        'Check your API key configuration with: storylite config set-key <key>'
      );
    });

    test('APIError should provide generic suggestion for other status codes', () => {
      const error = new APIError('Server error', 500);

      expect(error.suggestion).toBe('Verify your API endpoint and try again');
    });

    test('ConfigError should have default suggestion', () => {
      const error = new ConfigError('Invalid config');

      expect(error.message).toBe('Configuration error: Invalid config');
      expect(error.exitCode).toBe(ExitCode.CONFIG_ERROR);
      expect(error.suggestion).toBe("Run 'storylite config --help' for configuration options");
    });

    test('ValidationError should have default suggestion', () => {
      const error = new ValidationError('Invalid input');

      expect(error.message).toBe('Validation error: Invalid input');
      expect(error.exitCode).toBe(ExitCode.VALIDATION_ERROR);
      expect(error.suggestion).toBe('Check your input parameters and try again');
    });
  });

  describe('handleError', () => {
    test('should handle StoryLiteError with clean output', () => {
      const error = new StoryLiteError('Test error', ExitCode.GENERAL_ERROR, 'Test suggestion');

      expect(() => handleError(error)).toThrow('process.exit called');
      expect(mockConsoleError).toHaveBeenCalledWith('✗ Test error');
      expect(mockConsoleError).toHaveBeenCalledWith('💡 Test suggestion');
      expect(mockProcessExit).toHaveBeenCalledWith(ExitCode.GENERAL_ERROR);
    });

    test('should show details in verbose mode', () => {
      process.env.STORYLITE_VERBOSE = 'true';
      const error = new StoryLiteError(
        'Test error',
        ExitCode.GENERAL_ERROR,
        'Test suggestion',
        'Test details'
      );

      expect(() => handleError(error)).toThrow('process.exit called');
      expect(mockConsoleError).toHaveBeenCalledWith('Details: Test details');
    });

    test('should handle regular Error objects', () => {
      const error = new Error('Regular error');

      expect(() => handleError(error)).toThrow('process.exit called');
      expect(mockConsoleError).toHaveBeenCalledWith('✗ Unexpected error: Regular error');
      expect(mockConsoleError).toHaveBeenCalledWith('💡 Run with --verbose for more details');
      expect(mockProcessExit).toHaveBeenCalledWith(ExitCode.GENERAL_ERROR);
    });

    test('should handle non-Error objects', () => {
      const error = 'String error';

      expect(() => handleError(error)).toThrow('process.exit called');
      expect(mockConsoleError).toHaveBeenCalledWith('✗ Unknown error occurred');
      expect(mockProcessExit).toHaveBeenCalledWith(ExitCode.GENERAL_ERROR);
    });
  });

  describe('wrapCommand', () => {
    test('should catch and handle errors from wrapped function', async () => {
      const mockFn = jest.fn().mockRejectedValue(new StoryLiteError('Test error'));
      const wrappedFn = wrapCommand(mockFn);

      await expect(wrappedFn('arg1', 'arg2')).rejects.toThrow('process.exit called');
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    test('should pass through successful execution', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      const wrappedFn = wrapCommand(mockFn);

      await wrappedFn('arg1', 'arg2');
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('validateFile', () => {
    beforeEach(() => {
      mockPath.resolve.mockImplementation(p => `/resolved/${p}`);
    });

    test('should throw ValidationError for empty file path', () => {
      expect(() => validateFile('')).toThrow(ValidationError);
      expect(() => validateFile('')).toThrow('File path is required');
    });

    test('should throw FileNotFoundError for non-existent file', () => {
      mockFs.existsSync.mockReturnValue(false);

      expect(() => validateFile('nonexistent.txt')).toThrow(FileNotFoundError);
      expect(() => validateFile('nonexistent.txt')).toThrow('File not found: nonexistent.txt');
    });

    test('should throw ValidationError for directory', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ isFile: () => false } as any);

      expect(() => validateFile('directory')).toThrow(ValidationError);
      expect(() => validateFile('directory')).toThrow('Path is not a file: directory');
    });

    test('should pass validation for valid file', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ isFile: () => true } as any);

      expect(() => validateFile('valid-file.txt')).not.toThrow();
    });
  });

  describe('formatting functions', () => {
    test('formatSuccess should output green checkmark', () => {
      formatSuccess('Operation completed');
      expect(mockConsoleLog).toHaveBeenCalledWith('✓ Operation completed');
    });

    test('formatInfo should output cyan info icon', () => {
      formatInfo('Information message');
      expect(mockConsoleLog).toHaveBeenCalledWith('ℹ Information message');
    });

    test('formatWarning should output yellow warning icon', () => {
      formatWarning('Warning message');
      expect(mockConsoleLog).toHaveBeenCalledWith('⚠ Warning message');
    });
  });

  describe('ExitCode enum', () => {
    test('should have correct exit code values', () => {
      expect(ExitCode.SUCCESS).toBe(0);
      expect(ExitCode.GENERAL_ERROR).toBe(1);
      expect(ExitCode.INVALID_USAGE).toBe(2);
      expect(ExitCode.FILE_NOT_FOUND).toBe(3);
      expect(ExitCode.NETWORK_ERROR).toBe(4);
      expect(ExitCode.API_ERROR).toBe(5);
      expect(ExitCode.CONFIG_ERROR).toBe(6);
      expect(ExitCode.VALIDATION_ERROR).toBe(7);
    });
  });
});
