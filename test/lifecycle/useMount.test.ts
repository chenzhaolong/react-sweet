import { renderHook } from '@testing-library/react-hooks';
import { useMount } from '../../src';
import { useState } from 'react';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useMount', () => {
  it('test the params is function when invoke useMount', () => {
    const fn = jest.fn();
    const { rerender } = renderHook(() => {
      return useMount(fn);
    });
    expect(fn).toHaveBeenCalledTimes(1);

    rerender();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('test the function of params is invoke when mount', () => {
    const { result, unmount, rerender } = renderHook(() => {
      const [a, setA] = useState(0);
      useMount(() => {
        setA((val: any) => val + 1);
      });
      return { a };
    });

    expect(result.current.a).toEqual(1);

    rerender();
    expect(result.current.a).toEqual(1);

    unmount();
    expect(result.current.a).toEqual(1);
  });

  it('the params is object when invoke useMount', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const { unmount, rerender } = renderHook(() => {
      return useMount({
        // @ts-ignore
        mount: fn1,
        clean: fn2
      });
    });

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(0);

    rerender();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(0);

    unmount();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
  });
});
