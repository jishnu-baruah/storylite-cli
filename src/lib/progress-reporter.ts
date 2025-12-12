import ora, { Ora } from 'ora';
import chalk from 'chalk';

export interface ProgressReporter {
  start(message: string): void;
  update(message: string): void;
  succeed(message: string): void;
  fail(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  stop(): void;
}

export class SpinnerProgressReporter implements ProgressReporter {
  private spinner: Ora | null = null;
  private isVerbose: boolean;

  constructor(verbose: boolean = false) {
    this.isVerbose = verbose;
  }

  start(message: string): void {
    if (this.spinner) {
      this.spinner.stop();
    }

    this.spinner = ora({
      text: message,
      color: 'cyan',
      spinner: 'dots',
    }).start();

    if (this.isVerbose) {
      console.log(chalk.gray(`[VERBOSE] Starting: ${message}`));
    }
  }

  update(message: string): void {
    if (this.spinner) {
      this.spinner.text = message;
    }

    if (this.isVerbose) {
      console.log(chalk.gray(`[VERBOSE] Update: ${message}`));
    }
  }

  succeed(message: string): void {
    if (this.spinner) {
      this.spinner.succeed(chalk.green(message));
      this.spinner = null;
    } else {
      console.log(chalk.green(`✓ ${message}`));
    }

    if (this.isVerbose) {
      console.log(chalk.gray(`[VERBOSE] Success: ${message}`));
    }
  }

  fail(message: string): void {
    if (this.spinner) {
      this.spinner.fail(chalk.red(message));
      this.spinner = null;
    } else {
      console.log(chalk.red(`✗ ${message}`));
    }

    if (this.isVerbose) {
      console.log(chalk.gray(`[VERBOSE] Failed: ${message}`));
    }
  }

  info(message: string): void {
    if (this.spinner) {
      this.spinner.info(chalk.cyan(message));
    } else {
      console.log(chalk.cyan(`ℹ ${message}`));
    }

    if (this.isVerbose) {
      console.log(chalk.gray(`[VERBOSE] Info: ${message}`));
    }
  }

  warn(message: string): void {
    if (this.spinner) {
      this.spinner.warn(chalk.yellow(message));
    } else {
      console.log(chalk.yellow(`⚠ ${message}`));
    }

    if (this.isVerbose) {
      console.log(chalk.gray(`[VERBOSE] Warning: ${message}`));
    }
  }

  stop(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }
}

// Factory function to create progress reporter based on environment
export function createProgressReporter(verbose: boolean = false): ProgressReporter {
  return new SpinnerProgressReporter(verbose);
}
