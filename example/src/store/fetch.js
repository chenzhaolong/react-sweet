/**
 * @file 模拟异步
 */

export const fetch1 = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(10)
    }, 1000);
  })
};
