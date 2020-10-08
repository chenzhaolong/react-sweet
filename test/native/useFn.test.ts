import { renderHook, act } from '@testing-library/react-hooks';
import { useFn } from '../../src';
import { useState } from 'react';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useFn', () => {
  it('test the wrong params', () => {
    const tar1 = renderHook(() => {
      // @ts-ignore
      return useFn(() => {});
    });
    expect(() => {
      if (tar1.result.error) {
        throw new Error();
      }
    }).toThrowError();

    const tar2 = renderHook(() => {
      // @ts-ignore
      return useFn(() => {}, {});
    });
    expect(() => {
      if (tar2.result.error) {
        throw new Error();
      }
    }).toThrowError();

    const tar3 = renderHook(() => {
      // @ts-ignore
      return useFn(() => {}, { type: 'asdf' });
    });
    expect(() => {
      if (tar3.result.error) {
        throw new Error();
      }
    }).toThrowError();
  });

  it('test the debounce', () => {
    const fn = jest.fn();
    const { result } = renderHook(
      (props) => {
        const fn1 = useFn(fn, { time: 100 }, [props.id]);
        return { fn: fn1 };
      },
      { initialProps: { id: 0 } }
    );

    expect(fn).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.fn();
    });
    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(1);
    }, 100);

    act(() => {
      result.current.fn();
      result.current.fn();
      result.current.fn();
    });
    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(2);
    }, 100);

    act(() => {
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
    });
    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(3);
    }, 100);
  });

  it('test the throttle', () => {
    const fn = jest.fn();
    const { result } = renderHook(
      (props) => {
        const fn1 = useFn(fn, { time: 3, type: 'throttle' }, [props.id]);
        return { fn: fn1 };
      },
      { initialProps: { id: 0 } }
    );

    expect(fn).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
    });
    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(2);
    }, 10);

    act(() => {
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
    });
    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(2);
    }, 10);

    act(() => {
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
      result.current.fn();
    });
    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(3);
    }, 20);
  });

  it('test the data change when deps changed', () => {
    const { result, rerender } = renderHook(
      (props) => {
        const [a, setA] = useState(props.data);
        const fn = useFn(
          () => {
            setA(props.data);
          },
          { time: 3 },
          [props.id]
        );
        return { a, fn };
      },
      { initialProps: { id: 0, data: 'demo' } }
    );
    expect(result.current.a).toEqual('demo');

    rerender({ id: 1, data: 'demo1' });
    act(() => {
      result.current.fn();
    });
    setTimeout(() => {
      expect(result.current.a).toEqual('demo1');
    }, 3);

    rerender({ id: 1, data: 'demo2' });
    act(() => {
      result.current.fn();
    });
    setTimeout(() => {
      expect(result.current.a).toEqual('demo1');
    }, 3);

    rerender({ id: 2, data: 'demo2' });
    act(() => {
      result.current.fn();
    });
    setTimeout(() => {
      expect(result.current.a).toEqual('demo2');
    }, 3);
  });
});
