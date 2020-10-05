import { renderHook, act } from '@testing-library/react-hooks';
import { useMethod } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useMethod', () => {
  it('test the trigger and value', () => {
    const { result } = renderHook(() => {
      // @ts-ignore
      return useMethod('demo', (value, others = '') => {
        return value + '_diy_' + others;
      });
    });

    expect(result.current.value).toEqual('demo');

    act(() => {
      result.current.trigger();
    });
    expect(result.current.value).toEqual('demo_diy_');

    act(() => {
      // @ts-ignore
      result.current.trigger('demo');
    });
    expect(result.current.value).toEqual('demo_diy__diy_demo');
  });

  it('test the  fn', () => {
    const { result } = renderHook(() => {
      // @ts-ignore
      return useMethod('demo');
    });

    expect(() => {
      if (result.error) {
        throw new Error();
      }
    }).toThrowError();
  });

  it('test the deps', () => {
    const { result, rerender } = renderHook(
      (props) => {
        // @ts-ignore
        return useMethod(
          10,
          (value, other = 0) => {
            return value + props.num + other;
          },
          [props.num]
        );
      },
      { initialProps: { num: 1 } }
    );

    act(() => {
      result.current.trigger();
    });

    expect(result.current.value).toEqual(11);

    rerender();
    act(() => {
      result.current.trigger();
    });
    expect(result.current.value).toEqual(12);

    rerender({ num: 10 });
    act(() => {
      result.current.trigger();
    });
    expect(result.current.value).toEqual(22);

    act(() => {
      // @ts-ignore
      result.current.trigger(5);
    });
    expect(result.current.value).toEqual(37);
  });
});
