interface Options {
  time: number;
  type?: string;
}
declare function useFn(cb: () => any, options: Options, deps: Array<any> | string): () => any;
export default useFn;
