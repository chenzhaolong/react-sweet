/**
 * @file render the list item
 * todo: 候选添加limit和limitRender等对渲染较多数据的性能进行优化
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
    error('the params of useFor must has the property of render');
  }
  if (!hasProperty(options, 'source')) {
    error('the params of useFor must has the property of source');
  }
  if (!isArray(options.source)) {
    error('the property of source in useFor must be Array');
  }
  const { render, source } = options;
  return useMemo(() => {
    return source.map((item, index) => {
      return render(item, index);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);
}

export default useFor;
