import * as colors from 'ansi-colors';
import * as figlet from 'figlet';

const createColoredMessage = (
  message: string,
  color: keyof typeof colors = 'green',
  prefix: string = '',
): string => {
  const colorFunc = colors[color] || colors.green;

  if (typeof colorFunc !== 'function') {
    return message;
  }

  const coloredMessage = colorFunc(message);
  return (
    prefix
      ? `${new Date().toUTCString()} ${prefix} ${coloredMessage}`
      : coloredMessage
  ) as string;
};

export const logger = {
  /* ASCII art logger with callback support */
  ascii: (
    message: string,
    callback: () => void,
    color: keyof typeof colors = 'greenBright',
    ...optionalParams: any[]
  ): void => {
    figlet(message, (err, data) => {
      if (err) {
        console.error('Error generating ASCII art:', err);
        return;
      }
      const coloredMessage = createColoredMessage(data, color);
      console.error('\n' + coloredMessage + '\n', ...optionalParams);
      callback();
    });
  },

  /* Generic log message with cyan color and [LOG] prefix */
  log: (message: string, ...optionalParams: any[]): void => {
    const coloredMessage = createColoredMessage(
      message,
      'cyan',
      colors.bgCyan('[LOG]'),
    );
    console.log(coloredMessage, ...optionalParams);
  },

  /* Info log with blue color and [INFO] prefix */
  info: (message: string, ...optionalParams: any[]): void => {
    const coloredMessage = createColoredMessage(
      message,
      'blue',
      colors.bgBlue('[INFO]'),
    );
    console.info(coloredMessage, ...optionalParams);
  },

  /* Debug log with magenta color and [DEBUG] prefix */
  debug: (message: string, ...optionalParams: any[]): void => {
    const coloredMessage = createColoredMessage(
      message,
      'magenta',
      colors.bgMagenta('[DEBUG]'),
    );
    console.debug(coloredMessage, ...optionalParams);
  },

  /* Warning log with yellow color and [WARN] prefix */
  warn: (message: string, ...optionalParams: any[]): void => {
    const coloredMessage = createColoredMessage(
      message,
      'yellow',
      colors.bgYellow('[WARN]'),
    );
    console.warn(coloredMessage, ...optionalParams);
  },

  /* Error log with red color and [ERROR] prefix */
  error: (message: string, ...optionalParams: any[]): void => {
    const coloredMessage = createColoredMessage(
      message,
      'red',
      colors.bgRed('[ERROR]'),
    );
    console.error(coloredMessage, ...optionalParams);
  },
};
