interface ListOptions {
  render: (item: object, index?: number) => Array<any>;
  source: Array<any>;
}
declare function useFor(options: ListOptions): Array<any>;
export default useFor;
