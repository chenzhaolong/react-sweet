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
});
