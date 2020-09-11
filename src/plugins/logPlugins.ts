/**
 * @file 日志插件
 */
type Action = { type: string; payload: any };

type Dispatch = (action: Action) => any;

export function logPlugins(globalState: object) {
  return (rootDispatch: Dispatch) => {
    return (action: Action) => {
      console.log(`%c${action.type}-prevState:`, 'color: green', { ...globalState });
      rootDispatch(action);
      console.log(`%c${action.type}-nextState:`, 'color: green', globalState);
    };
  };
}
