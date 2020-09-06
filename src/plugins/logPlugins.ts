/**
 * @file 日志插件
 */
const Colors = require('colors');

type Action = { type: string; payload: any };

type Dispatch = (action: Action) => any;

export function logPlugins(globalState: object) {
  return (rootDispatch: Dispatch) => {
    return (action: Action) => {
      console.log(Colors.green(`${action.type}-prevState: ${globalState}`));
      rootDispatch(action);
      console.log(Colors.green(`${action.type}-nextState: ${globalState}`));
    };
  };
}
