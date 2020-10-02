import { renderHook } from '@testing-library/react-hooks';
import { useCondition } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useCondition', () => {
  it('test the condition is function', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const { result, rerender } = renderHook(
      (props) => {
        return useCondition(
          {
            condition() {
              return props.a1 < 3;
            },
            yes() {
              fn1();
              return 'yes';
            },
            no() {
              fn2();
              return 'no';
            }
          },
          [props.a1]
        );
      },
      { initialProps: { a1: 1 } }
    );

    expect(result.current).toEqual('yes');
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(0);

    rerender();
    expect(result.current).toEqual('yes');
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(0);

    rerender({ a1: 2 });
    expect(result.current).toEqual('yes');
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(0);

    rerender({ a1: 3 });
    expect(result.current).toEqual('no');
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(1);

    rerender({ a1: 3 });
    expect(result.current).toEqual('no');
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(1);

    rerender({ a1: 4 });
    expect(result.current).toEqual('no');
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);
  });

  it('the condition has no return or return the value is not boolean', () => {
    const { rerender, result } = renderHook(
      (props) => {
        return useCondition(
          {
            // @ts-ignore
            condition() {
              return 'asd';
            },
            yes() {
              return 'yes';
            },
            no() {
              return 'no';
            }
          },
          [props.a1]
        );
      },
      { initialProps: { a1: 1 } }
    );

    expect(result.current).toBe('');

    rerender({ a1: 2 });
    expect(result.current).toBe('');

    const target = renderHook(
      (props) => {
        return useCondition(
          {
            // @ts-ignore
            condition() {
              document.title = '1';
            },
            yes() {
              return 'yes';
            },
            no() {
              return 'no';
            }
          },
          [props.a1]
        );
      },
      { initialProps: { a1: 1 } }
    );

    expect(target.result.current).toBe('');

    target.rerender({ a1: 2 });
    expect(target.result.current).toBe('');
  });
});
