import chalk from "chalk";

const DEBUG = true;

export const logger = {
  info(...args: unknown[]) {
    if (DEBUG) {
      console.log(chalk.cyan("[INFO]"), ...args);
    }
  },

  success(...args: unknown[]) {
    if (DEBUG) {
      console.log(chalk.green("[SUCCESS]"), ...args);
    }
  },

  warn(...args: unknown[]) {
    if (DEBUG) {
      console.log(chalk.yellow("[WARN]"), ...args);
    }
  },

  error(...args: unknown[]) {
    if (DEBUG) {
      console.log(chalk.red("[ERROR]"), ...args);
    }
  },
};
