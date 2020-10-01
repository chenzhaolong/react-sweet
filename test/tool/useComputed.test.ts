import { renderHook } from '@testing-library/react-hooks';
import { useComputed } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useComputed', () => {
  it('test the params is empty', () => {
    const { result } = renderHook(
      () => {
        // @ts-ignore
        return useComputed();
      },
      { initialProps: { a1: 1, a2: 2 } }
    );

    expect(() => {
      if (result.error) {
        throw new Error();
      }
    }).toThrowError();
  });

  it('test the computed value', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const fn3 = jest.fn();
    const { result, rerender } = renderHook(
      ({ a1, a2, a3 }) => {
        return useComputed({
          b1: {
            value() {
              fn1();
              return a1;
            },
            deps: { a1 }
          },
          b2: {
            value() {
              fn2();
              return a2 + 10;
            },
            deps: { a2 }
          },
          b3: {
            value() {
              fn3();
              return a3 * 10;
            },
            deps: { a3 }
          }
        });
      },
      { initialProps: { a1: 1, a2: 2, a3: 3 } }
    );

    expect(result.current['b1']).toEqual(1);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(result.current['b2']).toEqual(12);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(result.current['b3']).toEqual(30);
    expect(fn3).toHaveBeenCalledTimes(1);

    // a1 change
    rerender({ a1: 2, a2: 2, a3: 3 });
    expect(result.current['b1']).toEqual(2);
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(result.current['b2']).toEqual(12);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(result.current['b3']).toEqual(30);
    expect(fn3).toHaveBeenCalledTimes(1);

    // a2 change
    rerender({ a1: 2, a2: 5, a3: 3 });
    expect(result.current['b1']).toEqual(2);
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(result.current['b2']).toEqual(15);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(result.current['b3']).toEqual(30);
    expect(fn3).toHaveBeenCalledTimes(1);

    // a3 change
    rerender({ a1: 2, a2: 5, a3: 5 });
    expect(result.current['b1']).toEqual(2);
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(result.current['b2']).toEqual(15);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(result.current['b3']).toEqual(50);
    expect(fn3).toHaveBeenCalledTimes(2);

    // a1, a3 change
    rerender({ a1: 3, a2: 5, a3: 6 });
    expect(result.current['b1']).toEqual(3);
    expect(fn1).toHaveBeenCalledTimes(3);
    expect(result.current['b2']).toEqual(15);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(result.current['b3']).toEqual(60);
    expect(fn3).toHaveBeenCalledTimes(3);
  });
});
