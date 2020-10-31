/**
 * @file serialize the useUpdate
 */
interface Option {
  update(): () => any;
  deps: Array<any>;
}
declare function useUpdates(options: Array<Option> | Option): void;
export default useUpdates;
