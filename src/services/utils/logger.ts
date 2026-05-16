const LOG_PREFIX = '[FishRecognizer]';

export const logger = {
  log: (message: string, ...args: any[]) => {
    console.log(`${LOG_PREFIX} ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`${LOG_PREFIX} ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`${LOG_PREFIX} ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.log(`${LOG_PREFIX} [DEBUG] ${message}`, ...args);
    }
  },

