import chalk from "chalk";

class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development';
  }

  // Current timestamp for logs
  getTimestamp() {
    const now = new Date();
    return `[${now.toISOString()}]`;
  }

  // Format log message
  formatMessage(level, message, data = null) {
    const timestamp = this.getTimestamp();
    let formattedMessage = `${timestamp} [${level}] ${message}`;
    
    if (data) {
      formattedMessage += ` ${JSON.stringify(data)}`;
    }
    
    return formattedMessage;
  }

  // Info level logging
  info(message, data = null) {
    if (this.isDevelopment) {
      console.log(chalk.blue(this.formatMessage('INFO', message, data)));
    }
  }

  // Success level logging
  success(message, data = null) {
    console.log(chalk.green(this.formatMessage('SUCCESS', message, data)));
  }

  // Warning level logging
  warn(message, data = null) {
    console.warn(chalk.yellow(this.formatMessage('WARN', message, data)));
  }

  // Error level logging
  error(message, error = null) {
    const errorData = error ? {
      message: error.message,
      stack: this.isDevelopment ? error.stack : undefined,
      code: error.code,
      status: error.status
    } : null;

    console.error(chalk.red(this.formatMessage('ERROR', message, errorData)));
  }

  // Debug level logging (only in development)
  debug(message, data = null) {
    if (this.isDevelopment) {
      console.log(chalk.gray(this.formatMessage('DEBUG', message, data)));
    }
  }

  // HTTP request logging
  http(method, url, status, duration = null) {
    const statusColor = status >= 400 ? 'red' : status >= 300 ? 'yellow' : 'green';
    const durationText = duration ? `(${duration}ms)` : '';
    
    console.log(
      chalk[statusColor](
        this.formatMessage('HTTP', `${method} ${url} ${status} ${durationText}`)
      )
    );
  }

  // Database operation logging
  db(operation, collection, data = null) {
    this.info(`DB ${operation.toUpperCase()} on ${collection}`, data);
  }

  // Authentication logging
  auth(action, userId = null, details = null) {
    this.info(`AUTH ${action.toUpperCase()}`, { userId, ...details });
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;

