import { BaseCommand, CommandOptions, CLICommand } from '../base-command.js';
import { Command } from 'commander';

// Mock the error handler module
jest.mock('../error-handler', () => ({
  wrapCommand: jest.fn(fn => fn),
}));

// Create a concrete implementation for testing
class TestCommand extends BaseCommand implements CLICommand {
  constructor() {
    super('test', 'Test command description');
    this.addGlobalOptions();
    this.command.action(this.wrapAction(this.execute.bind(this)));
  }

  async execute(): Promise<void> {
    // Test implementation
  }

  // Public methods for testing
  public testIsVerbose(): boolean {
    return this.isVerbose();
  }

  public testWrapAction<T extends any[]>(
    action: (...args: T) => Promise<void>
  ): (...args: T) => Promise<void> {
    return this.wrapAction(action);
  }
}

describe('BaseCommand', () => {
  let testCommand: TestCommand;
  let command: Command;

  beforeEach(() => {
    testCommand = new TestCommand();
    command = testCommand.getCommand();
    delete process.env.STORYLITE_VERBOSE;
  });

  describe('constructor', () => {
    test('should create command with correct name and description', () => {
      expect(command.name()).toBe('test');
      expect(command.description()).toBe('Test command description');
    });
  });

  describe('addGlobalOptions', () => {
    test('should add verbose option', () => {
      const options = command.options;
      const verboseOption = options.find(opt => opt.long === '--verbose');

      expect(verboseOption).toBeDefined();
      expect(verboseOption?.short).toBe('-v');
      expect(verboseOption?.description).toBe('Enable verbose output');
    });

    test('should add no-color option', () => {
      const options = command.options;
      const noColorOption = options.find(opt => opt.long === '--no-color');

      expect(noColorOption).toBeDefined();
      expect(noColorOption?.description).toBe('Disable colored output');
    });
  });

  describe('isVerbose', () => {
    test('should return false when STORYLITE_VERBOSE is not set', () => {
      expect(testCommand.testIsVerbose()).toBe(false);
    });

    test('should return true when STORYLITE_VERBOSE is set to true', () => {
      process.env.STORYLITE_VERBOSE = 'true';
      expect(testCommand.testIsVerbose()).toBe(true);
    });

    test('should return false when STORYLITE_VERBOSE is set to false', () => {
      process.env.STORYLITE_VERBOSE = 'false';
      expect(testCommand.testIsVerbose()).toBe(false);
    });
  });

  describe('wrapAction', () => {
    test('should return a function that calls the original action', async () => {
      const mockAction = jest.fn().mockResolvedValue(undefined);
      const wrappedAction = testCommand.testWrapAction(mockAction);

      await wrappedAction('arg1', 'arg2');
      expect(mockAction).toHaveBeenCalledWith('arg1', 'arg2');
    });

    test('should handle errors from the wrapped action', async () => {
      const mockAction = jest.fn().mockRejectedValue(new Error('Test error'));
      const wrappedAction = testCommand.testWrapAction(mockAction);

      // The wrapCommand function should catch the error and call handleError
      await expect(wrappedAction()).rejects.toThrow();
    });
  });

  describe('getCommand', () => {
    test('should return the Commander.js command instance', () => {
      const returnedCommand = testCommand.getCommand();
      expect(returnedCommand).toBeInstanceOf(Command);
      expect(returnedCommand.name()).toBe('test');
    });
  });

  describe('CommandOptions interface', () => {
    test('should define correct optional properties', () => {
      const options: CommandOptions = {
        verbose: true,
        noColor: false,
      };

      expect(typeof options.verbose).toBe('boolean');
      expect(typeof options.noColor).toBe('boolean');
    });

    test('should allow undefined properties', () => {
      const options: CommandOptions = {};

      expect(options.verbose).toBeUndefined();
      expect(options.noColor).toBeUndefined();
    });
  });

  describe('CLICommand interface', () => {
    test('should require execute method', () => {
      expect(typeof testCommand.execute).toBe('function');
    });

    test('should allow execute method to accept any arguments', async () => {
      const command: CLICommand = {
        async execute(...args: any[]): Promise<void> {
          expect(args).toEqual(['test', 'args']);
        },
      };

      await command.execute('test', 'args');
    });
  });
});
