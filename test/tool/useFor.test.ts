import { renderHook } from '@testing-library/react-hooks';
import { useFor } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test the useFor', () => {
  it('useFor has no render property', () => {
    const { result } = renderHook(() => {
      // @ts-ignore
      return useFor({
        source: [{}, {}]
      });
    });

    expect(() => {
      if (result.error) {
        throw new Error();
      }
    }).toThrow();
  });

  it('useFor has no source property', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => {
      // @ts-ignore
      return useFor({
        render: fn
      });
    });

    expect(() => {
      if (result.error) {
        throw new Error();
      }
    }).toThrow();

    expect(fn).toHaveBeenCalledTimes(0);
  });

  it('the source is not array', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => {
      return useFor({
        render: fn,
        // @ts-ignore
        source: {}
      });
    });

    expect(() => {
      if (result.error) {
        throw new Error();
      }
    }).toThrowError();
  });

  it('render the list', () => {
    const { result, rerender } = renderHook(
      (props) => {
        return useFor({
          source: props.list,
          // @ts-ignore
          render(item) {
            return item;
          }
        });
      },
      { initialProps: { list: [{}, {}, {}] } }
    );

    expect(result.current.length).toEqual(3);

    rerender();
    expect(result.current.length).toEqual(3);

    rerender({ list: [{}, {}, {}, {}] });
    expect(result.current.length).toEqual(4);
  });
});
