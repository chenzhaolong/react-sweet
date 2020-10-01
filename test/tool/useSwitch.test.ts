import { renderHook } from '@testing-library/react-hooks';
import { useSwitch } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useStyle', () => {
  it('test the object of params', () => {
    const { result, rerender } = renderHook(
      ({ mode }) => {
        return useSwitch(
          {
            // @ts-ignore
            add: {
              color: 'red'
            },
            // @ts-ignore
            edit: {
              color: 'blue'
            }
          },
          { add: mode === 'add', edit: mode === 'edit' },
          [mode]
        );
      },
      { initialProps: { mode: 'add' } }
    );

    expect(result.current['color']).toEqual('red');

    rerender();
    expect(result.current['color']).toEqual('red');

    rerender({ mode: 'edit' });
    expect(result.current['color']).toEqual('blue');

    rerender({ mode: 'detail' });
    expect(result.current['color']).toBeUndefined();
  });

  it('test the function of params', () => {
    const { rerender, result } = renderHook(
      ({ mode }) => {
        return useSwitch(
          {
            // @ts-ignore
            add: {
              color: 'red'
            },
            // @ts-ignore
            edit: {
              color: 'blue'
            }
          },
          (style: any) => {
            if (mode === 'add') {
              return style.add;
            } else if (mode === 'edit') {
              return style.edit;
            } else {
              return {};
            }
          },
          [mode]
        );
      },
      { initialProps: { mode: 'add' } }
    );

    expect(result.current['color']).toEqual('red');

    rerender();
    expect(result.current['color']).toEqual('red');

    rerender({ mode: 'edit' });
    expect(result.current['color']).toEqual('blue');

    rerender({ mode: 'detail' });
    expect(result.current['color']).toBeUndefined();
  });

  it('test the error when invoke useSwitch for empty condition', () => {
    const { result } = renderHook(
      (props) => {
        return useSwitch(
          {
            // @ts-ignore
            add: {
              color: 'red'
            },
            // @ts-ignore
            edit: {
              color: 'blue'
            }
          },
          '',
          [props.mode]
        );
      },
      { initialProps: { mode: 'add' } }
    );

    expect(() => {
      if (result.error) {
        throw new Error();
      }
    }).toThrowError();
  });
});
