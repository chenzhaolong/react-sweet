import { renderHook } from '@testing-library/react-hooks';
import { useUpdates } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useUpdates', () => {
  it('the params must array', () => {
    const fn = jest.fn();
    const { rerender } = renderHook(() => {
      // @ts-ignore
      return useUpdates(fn);
    });
    expect(fn).toHaveBeenCalledTimes(0);

    rerender();
    expect(fn).toHaveBeenCalledTimes(0);
  });

  it('test then mul deps', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const { rerender } = renderHook(
      (props) => {
        return useUpdates([
          {
            update: fn1,
            deps: [props.a1]
          },
          {
            update: fn2,
            deps: [props.a2]
          }
        ]);
      },
      { initialProps: { a1: 1, a2: 1 } }
    );
    expect(fn1).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);

    rerender({ a1: 1, a2: 2 });
    expect(fn1).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(1);

    rerender({ a1: 2, a2: 2 });
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    rerender({ a1: 3, a2: 3 });
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);

    rerender({ a1: 3, a2: 3 });
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);

    rerender({ a1: 3, a2: 4 });
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(3);
  });
});
