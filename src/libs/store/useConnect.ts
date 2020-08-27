/**
 * @file store of connection
 */
interface Options {
  relateKey: string;
  mapState: { [key: string]: (store: any) => object };
  mapDispatch: { [key: string]: (store: any) => any };
}

type Action = { type: string; payload: any };

interface Result {
  state: (path: string) => any;
  emit: (action: Action) => any;
}

function useConnect(options: Options): Result {
  console.log(options);
  return {
    state(path) {
      console.log(path);
    },
    emit(action: Action) {
      console.log(action);
    }
  };
}

export default useConnect;
