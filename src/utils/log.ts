/**
 * @file log
 */
const Colors = require('colors');

export function error(msg: string): void {
  const message = Colors.red(msg);
  throw new Error(message);
}
