/**
 * @file 日志插件
 */
type Action = { type: string; payload: any };

type Dispatch = (action: Action) => any;

export function logPlugins(globalState: object) {
  return (rootDispatch: Dispatch) => {
    return (action: Action) => {
      console.log(`${action.type}-prevState:`, globalState);
      rootDispatch(action);
      console.log(`${action.type}-nextState:`, globalState);
    };
  };
}
