/**
 * @file this function can return a promise that can touch the section in
 * lifeCycle in a component.
 * eg:
 *    useLifeCycle([deps]).mount(cb).update(cb).destroy(cb)
 */
import { useMemo } from 'react';
import { useMount, useUpdate } from '../../index';

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

function useLifeCycle(deps?: Array<any>): LifeCycle {
  // @ts-ignore
  const lifeCycle: LifeCycle = useMemo(() => {
    return {
      queue: {
        mount: (): any => {},
        update: (): void => {},
        destroy: (): void => {}
      },
      mount(cb: () => any): any {
        if (cb && typeof cb === 'function') {
          this.queue.mount = cb;
        }
        return this;
      },
      update(cb: () => any): any {
        if (cb && typeof cb === 'function') {
          this.queue.update = cb;
        }
        return this;
      },
      destroy(cb: () => any): any {
        if (cb && typeof cb === 'function') {
          this.queue.destroy = cb;
        }
        return this;
      }
    };
  }, []);

  useMount({
    // @ts-ignore
    mount: () => {
      lifeCycle.queue.mount();
    },
    clean: () => {
      // @ts-ignore
      const result = lifeCycle.queue.mount();
      if (result && typeof result === 'function') {
        result();
      } else {
        // @ts-ignore
        lifeCycle.queue.destroy();
      }
    }
  });

  useUpdate(() => {
    lifeCycle.queue.update();
  }, deps);

  return lifeCycle;
}

export default useLifeCycle;
