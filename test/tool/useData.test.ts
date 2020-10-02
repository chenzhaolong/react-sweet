import { renderHook, act } from '@testing-library/react-hooks';
import { useData } from '../../src';
import { useEffect } from 'react';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useData', () => {
  it('the params is empty', () => {
    const obj = { a: { b: 1, c: { d: 3 } }, e: { a: 4 } };
    const { result, rerender } = renderHook(() => {
      return useData(obj);
    });

    expect(result.current.data.a.b).toEqual(1);

    rerender();
    expect(result.current.data.a.b).toEqual(1);

    act(() => {
      result.current.changeData('a.c.d', 'yes');
    });
    expect(result.current.data.a.c.d).toEqual('yes');

    act(() => {
      result.current.changeData('a.b', 'demo');
    });
    expect(result.current.data.a.b).toEqual('demo');
    expect(result.current.data.a.c.d).toEqual('yes');
    expect(result.current.data.e.a).toEqual(4);
  });

  it('the data has not change, useEffect has not execute', () => {
    const fn = jest.fn();
    const { result, rerender } = renderHook(() => {
      const result = useData({ a: 1, b: ['asd'] });
      useEffect(() => {
        fn();
      }, [result.data.a]);
      return result;
    });

    expect(result.current.data.a).toEqual(1);
    expect(fn).toHaveBeenCalledTimes(1);

    rerender();
    expect(result.current.data.a).toEqual(1);
    expect(fn).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.changeData('a', 2);
    });
    expect(result.current.data.a).toEqual(2);
    expect(fn).toHaveBeenCalledTimes(2);

    act(() => {
      result.current.changeData('a', 2);
    });
    expect(result.current.data.a).toEqual(2);
    expect(fn).toHaveBeenCalledTimes(2);

    act(() => {
      result.current.changeData('a', { c: 3 });
    });
    expect(result.current.data.a.c).toEqual(3);
    expect(fn).toHaveBeenCalledTimes(3);

    act(() => {
      result.current.changeData('a', { c: 4 });
    });
    expect(result.current.data.a.c).toEqual(4);
    expect(fn).toHaveBeenCalledTimes(4);
  });
});
