/**
 * @file render the list item1
 */
import { useMemo, useCallback, useState } from 'react';
import { isArray, hasProperty } from '../../utils/tools';
import { error, warning } from '../../utils/log';
import { isFunction, isNumber, get, isObject } from 'lodash';

type fn = () => number;

interface ListOptions {
  render: (item: object, index?: number) => Array<any>;
  source: Array<any>;
  container?: any;
  itemHeight?: number | fn;
  openLazyRender?: boolean;
  deps: Array<any>;
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
  const { render, source, container, itemHeight, deps, openLazyRender = false } = options;

  const [offset, setOffset] = useState(1);

  let realDeps = [source, offset];

  if (isArray(deps) && deps.length > 0) {
    realDeps = realDeps.concat(deps);
  }

  const handleLazyLoadFn = useCallback((container: any, height: number) => {
    const offsetHeight = container.offsetHeight;
    const limitSize = Math.ceil(offsetHeight / height) * offset;
    const renderItemSource = limitSize > source.length ? source : source.slice(0, limitSize);

    container.addEventListener('scroll', () => {
      const offsetTop = container.scrollTop;
      if (offset === 1 && offsetTop > 0) {
        setOffset(2);
      } else if (offsetTop > (offset - 1) * limitSize) {
        setOffset((val) => val + 1);
      }
    });

    return renderItemSource.map((item, index) => {
      return render(item, index);
    });
  }, []);

  return useMemo(() => {
    if (openLazyRender && isObject(container)) {
      // 判断container是否具有高度
      const offsetHeight = get(container, 'offsetHeight', 0);
      if (offsetHeight <= 0) {
        warning('if openLazyRender is true, then the height of container must be exist in useFor');
        return source.map((item, index) => {
          return render(item, index);
        });
      }

      // 校验item的高度
      let height = 0;
      if (isFunction(itemHeight)) {
        height = itemHeight();
      } else {
        // @ts-ignore
        height = itemHeight;
      }
      if (!isNumber(height) || height <= 0) {
        warning(
          'if openLazyRender is true, then the itemHeight must be number when large than 0 or be a computed function when return number in useFor'
        );
        return source.map((item, index) => {
          return render(item, index);
        });
      }

      return handleLazyLoadFn(container, height);
    } else {
      return source.map((item, index) => {
        return render(item, index);
      });
    }
  }, realDeps);
}

export default useFor;
