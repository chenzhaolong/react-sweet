/**
 * @file the performance of function component when rendering
 */
import { useRef, useState, useEffect } from 'react';
import { get } from 'lodash';

interface Offset {
  offsetTop: number;
  offsetLeft: number;
  offsetWidth: number;
  offsetHeight: number;
}

type empty = {};

interface Result {
  element: object;
  offset: empty | Offset;
}

function useOffset(deps?: Array<any>): Result {
  const element = useRef({});
  const [offset, setOffset] = useState({});
  const realDeps = deps ? deps : [];

  useEffect(() => {
    const newOffset: Offset = {
      offsetTop: get(element, 'current.offsetTop', 0),
      offsetLeft: get(element, 'current.offsetLeft', 0),
      offsetWidth: get(element, 'current.offsetWidth', 0),
      offsetHeight: get(element, 'current.offsetHeight', 0)
    };
    setOffset(newOffset);
  }, realDeps);
  return { element, offset };
}

export default useOffset;
