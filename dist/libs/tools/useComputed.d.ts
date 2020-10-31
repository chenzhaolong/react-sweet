interface Computed {
  value: () => any;
  deps: object;
}
declare type ComputedObj = {
  [key: string]: Computed;
};
declare function useComputed(computedObj: ComputedObj): object;
export default useComputed;
