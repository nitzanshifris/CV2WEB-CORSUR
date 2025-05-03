interface LogOptions {
  level?: "debug" | "info" | "warn" | "error";
  timestamp?: boolean;
  context?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  private options: LogOptions = {
    level: "info",
    timestamp: true,
    context: {},
  };

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  configure(options: LogOptions): void {
    this.options = { ...this.options, ...options };
  }

  private formatMessage(
    message: string,
    options: LogOptions = {}
  ): string {
    const { level = this.options.level, timestamp = this.options.timestamp } = {
      ...this.options,
      ...options,
    };

    let formattedMessage = "";

    if (timestamp) {
      formattedMessage += `[${new Date().toISOString()}] `;
    }

    formattedMessage += `[${level.toUpperCase()}] ${message}`;

    if (options.context) {
      formattedMessage += ` ${JSON.stringify(options.context)}`;
    }

    return formattedMessage;
  }

  debug(message: string, options: LogOptions = {}): void {
    if (this.options.level === "debug") {
      console.debug(this.formatMessage(message, { ...options, level: "debug" }));
    }
  }

  info(message: string, options: LogOptions = {}): void {
    if (["debug", "info"].includes(this.options.level || "")) {
      console.info(this.formatMessage(message, { ...options, level: "info" }));
    }
  }

  warn(message: string, options: LogOptions = {}): void {
    if (["debug", "info", "warn"].includes(this.options.level || "")) {
      console.warn(this.formatMessage(message, { ...options, level: "warn" }));
    }
  }

  error(message: string, options: LogOptions = {}): void {
    console.error(this.formatMessage(message, { ...options, level: "error" }));
  }

  withContext(context: Record<string, any>): Logger {
    const logger = Logger.getInstance();
    logger.configure({ context: { ...this.options.context, ...context } });
    return logger;
  }
}

export const logger = Logger.getInstance();

export function createLogger(options: LogOptions = {}): Logger {
  const logger = Logger.getInstance();
  logger.configure(options);
  return logger;
}

export function logError(error: Error, context: Record<string, any> = {}): void {
  logger.error(error.message, {
    context: {
      ...context,
      stack: error.stack,
    },
  });
}

export function logPerformance(
  name: string,
  duration: number,
  context: Record<string, any> = {}
): void {
  logger.info(`Performance: ${name} took ${duration}ms`, {
    context: {
      ...context,
      duration,
    },
  });
}

export function logRequest(
  method: string,
  url: string,
  status: number,
  duration: number,
  context: Record<string, any> = {}
): void {
  logger.info(`${method} ${url} ${status} ${duration}ms`, {
    context: {
      ...context,
      method,
      url,
      status,
      duration,
    },
  });
}

export function logEvent(
  name: string,
  data: Record<string, any>,
  context: Record<string, any> = {}
): void {
  logger.info(`Event: ${name}`, {
    context: {
      ...context,
      ...data,
    },
  });
} 