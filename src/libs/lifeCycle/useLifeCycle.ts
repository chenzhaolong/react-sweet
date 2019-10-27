/**
 * @file this function can return a promise that can touch the section in
 * lifeCycle in a component.
 * eg:
 *    useLifeCycle().mount(cb).update(cb).destroy(cb)
 */

function useLifeCycle() {
  console.log('lifeCycle');
}

export default useLifeCycle;
