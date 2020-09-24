import { renderHook } from '@testing-library/react-hooks';
import { useMount } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useMount', () => {
  it('test the params is function when invoke useMount', () => {
    const fn = jest.fn();
    renderHook(() => {
      return useMount(fn);
    });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
