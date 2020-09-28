import { renderHook } from '@testing-library/react-hooks';
import { useUpdate } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useUpdate', () => {
  it('the fn will invoke when update', () => {
    const fn = jest.fn();
    const { rerender, unmount } = renderHook(() => {
      return useUpdate(() => {
        fn();
      });
    });
    expect(fn).toHaveBeenCalledTimes(0);

    rerender();
    expect(fn).toHaveBeenCalledTimes(1);

    rerender();
    expect(fn).toHaveBeenCalledTimes(2);

    unmount();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('useUpdate will throw error when the deps is empty array ', () => {
    const fn = jest.fn();
    const { rerender } = renderHook(() => {
      return useUpdate(fn, []);
    });
    rerender();
    expect(fn).toHaveBeenCalledTimes(0);
  });

  it('the function can only invoke when the deps changed', () => {
    const fn = jest.fn();
    const { rerender } = renderHook(
      (params) => {
        return useUpdate(fn, [params.a]);
      },
      { initialProps: { a: 1 } }
    );

    expect(fn).toHaveBeenCalledTimes(0);

    rerender({ a: 2 });
    expect(fn).toHaveBeenCalledTimes(1);

    rerender({ a: 2 });
    expect(fn).toHaveBeenCalledTimes(1);

    rerender({ a: 3 });
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
