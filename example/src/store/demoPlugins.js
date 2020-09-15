/**
 * @file demo中间件
 */

export function demoPlugins(globalState) {
  return (next) => {
    return (action) => {
      if (typeof action === 'function') {
        action(globalState, next)
      } else {
        next(action)
      }
    }
  }
}