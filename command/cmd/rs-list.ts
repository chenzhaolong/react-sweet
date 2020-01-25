/**
 * @file list指令入口
 */

module.exports = {
  name: 'rs-list.ts',

  description: 'wea',

  args: [['--mode', 'production']],

  run(args: any, a: any) {
    console.log('args', args);
    return Promise.resolve();
  }
};
