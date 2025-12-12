import { Command } from 'commander';
import { wrapCommand } from './error-handler.js';

export interface CommandOptions {
  verbose?: boolean;
  noColor?: boolean;
}

export abstract class BaseCommand {
  protected command: Command;

  constructor(name: string, description: string) {
    this.command = new Command(name);
    this.command.description(description);
  }

  protected addGlobalOptions(): this {
    this.command
      .option('-v, --verbose', 'Enable verbose output')
      .option('--no-color', 'Disable colored output');
    return this;
  }

  protected wrapAction<T extends any[]>(
    action: (...args: T) => Promise<void>
  ): (...args: T) => Promise<void> {
    return wrapCommand(action);
  }

  public getCommand(): Command {
    return this.command;
  }

  protected isVerbose(): boolean {
    return process.env.STORYLITE_VERBOSE === 'true';
  }
}

export interface CLICommand {
  execute(...args: any[]): Promise<void>;
}
