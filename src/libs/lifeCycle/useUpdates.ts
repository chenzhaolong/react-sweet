/**
 * @file serialize the useUpdate
 */

import { useUpdate } from '../../index';
import { isArray } from '../../utils/tools';
import { error } from '../../utils/log';

interface Option {
  update(): any;
  deps: Array<any>;
}

function useUpdates(options: Array<Option> | Option) {
  if (isArray(options)) {
    // @ts-ignore
    options.forEach((item: Option) => {
      useUpdate(item.update, item.deps);
    });
  } else if (typeof options === 'object') {
    // @ts-ignore
    const cb: () => any = options['update'];
    // @ts-ignore
    const deps: Array<any> = options['deps'];
    useUpdate(cb, deps);
  } else {
    error('the input in useUpdates must be array or object');
  }
}

export default useUpdates;
