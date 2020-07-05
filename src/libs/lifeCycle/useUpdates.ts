/**
 * @file serialize the useUpdate
 */

import { useUpdate } from '../../index';
import { isArray } from '../../utils/tools';
import { error } from '../../utils/log';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Option {
  update(): () => any;
  deps: Array<any>;
}

const errorMsg = 'deps can not be empty array in useUpdates! please make sure your deps.';

function useUpdates(options: Array<Option> | Option): void {
  if (isArray(options)) {
    // @ts-ignore
    options.forEach((item: Option) => {
      /* eslint-disable react-hooks/rules-of-hooks */
      useUpdate(item.update, item.deps, errorMsg);
    });
  } else if (typeof options === 'object') {
    error('the input is object, maybe you can use the hook of useUpdate');
  } else {
    error('the input in useUpdates must be array');
  }
}

export default useUpdates;
