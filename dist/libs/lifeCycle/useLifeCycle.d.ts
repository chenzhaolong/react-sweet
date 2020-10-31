interface Queue {
  mount: () => any;
  update: () => any;
  destroy: () => any;
}
interface LifeCycle {
  queue: Queue;
  mount: (cb: Function) => any;
  update: (cb: Function, deps?: Array<any>) => any;
  destroy: (cb: Function) => any;
}
declare function useLifeCycle(deps?: Array<any>): LifeCycle;
export default useLifeCycle;
