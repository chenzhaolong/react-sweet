/**
 * @file render the list item
 */
import { useMemo } from 'react';
import { isArray, hasProperty } from '../../utils/tools';
import { error } from '../../utils/log';

interface ListOptions {
  render: (item: object, index?: number) => Array<any>;
  source: Array<any>;
}

function useFor(options: ListOptions): Array<any> {
  if (!hasProperty(options, 'render')) {
    error('the params of useRenderList must has the property of render');
    return [];
  }
  if (!hasProperty(options, 'render')) {
    error('the params of useRenderList must has the property of render');
    return [];
  }
  if (!hasProperty(options, 'source')) {
    error('the params of useRenderList must has the property of source');
    return [];
  }
  if (!isArray(options.source)) {
    error('the property of source in useRenderList must be Array');
    return [];
  }
  const { render, source } = options;
  return useMemo(() => {
    return source.map((item, index) => {
      return render(item, index);
    });
  }, [source]);
}

export default useFor;
