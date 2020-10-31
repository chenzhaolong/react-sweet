/**
 * @file the mount of life cycle in react hook for functional component
 */
interface Params {
  mount(): any;
  clean?(): void;
}
declare function useMount(cb: () => any | Params): void;
export default useMount;
