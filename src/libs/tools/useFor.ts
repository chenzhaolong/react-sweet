/**
 * @file render the list item
 */
import { ReactElement, useMemo } from 'react';
import { isArray, hasProperty } from '../../utils/tools';
import { error } from '../../utils/log';
import { isFunction } from 'lodash';

type fn = () => number;

interface ListOptions {
  render: (item: object, index?: number) => Array<any>;
  source: Array<any>;
  container?: ReactElement;
  itemHeight?: number | fn;
  lazyRender?: (item: object, index?: number) => Array<any>;
}

function useFor(options: ListOptions): Array<any> {
  if (!hasProperty(options, 'render')) {
    error('the params of useFor must has the property of render');
  }
  if (!hasProperty(options, 'source')) {
    error('the params of useFor must has the property of source');
  }
  if (!isArray(options.source)) {
    error('the property of source in useFor must be Array');
  }
  const { render, source, lazyRender } = options;

  return useMemo(() => {
    if (isFunction(lazyRender)) {
      return source.map((item, index) => {
        return lazyRender(item, index);
      });
    } else {
      return source.map((item, index) => {
        return render(item, index);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);
}

export default useFor;
