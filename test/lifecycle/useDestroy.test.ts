import { renderHook } from '@testing-library/react-hooks';
import { useDestroy } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useDestroy', () => {
  it('the function only invoke once when invoke component destroy', () => {
    const fn = jest.fn();
    const { unmount, rerender } = renderHook(() => {
      return useDestroy(() => {
        fn();
      });
    });
    expect(fn).toHaveBeenCalledTimes(0);

    rerender();
    expect(fn).toHaveBeenCalledTimes(0);

    unmount();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
