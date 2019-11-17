/**
 * @file log
 */
const Colors = require('colors');

export function error(msg: string): void {
  const message = Colors.red(msg);
  throw new Error(message);
}

export function warning(msg: string): void {
  if (process.env.NODE_ENV === 'development') {
    const message = Colors.red(msg);
    console.warn(`warning: ${message}`);
  }
}
