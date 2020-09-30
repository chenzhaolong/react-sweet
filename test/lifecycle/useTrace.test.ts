import { renderHook } from '@testing-library/react-hooks';
import { useTrace } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useTrace', () => {
  it('test the return value of useTrace', () => {
    const { result, rerender } = renderHook(() => {
      return useTrace();
    });

    expect(result.current.status).toBe('mounted');
    expect(result.current.updateTimes).toEqual(0);

    rerender();
    expect(result.current.status).toBe('update');
    expect(result.current.updateTimes).toEqual(1);

    rerender();
    expect(result.current.status).toBe('update');
    expect(result.current.updateTimes).toEqual(2);

    rerender();
    expect(result.current.status).toBe('update');
    expect(result.current.updateTimes).toEqual(3);
  });
});
