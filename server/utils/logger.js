const chalk = require('chalk');

const logger = {
  info: (msg) => console.log(chalk.blue('[INFO]'), msg),
  warn: (msg) => console.log(chalk.yellow('[WARN]'), msg),
  error: (msg) => console.log(chalk.red('[ERROR]'), msg),
  success: (msg) => console.log(chalk.green('[SUCCESS]'), msg),
  debug: (msg) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(chalk.gray('[DEBUG]'), msg);
    }
  }
};

module.exports = logger;
