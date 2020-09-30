import { renderHook } from '@testing-library/react-hooks';
import { useTraces } from '../../src';

describe('test useTraces', () => {
  it('trace the deps for single one', () => {
    const { result, rerender } = renderHook(
      (props) => {
        return useTraces({
          t1: props.a1
        });
      },
      { initialProps: { a1: 1 } }
    );
    expect(result.current[0].updateTimes).toEqual(0);
    expect(result.current[0].currentValue).toEqual(1);
    expect(result.current[0].prevValue).toBe('');

    rerender({ a1: 2 });
    expect(result.current[0].updateTimes).toEqual(1);
    expect(result.current[0].currentValue).toEqual(2);
    expect(result.current[0].prevValue).toBe(1);

    rerender({ a1: 5 });
    expect(result.current[0].updateTimes).toEqual(2);
    expect(result.current[0].currentValue).toEqual(5);
    expect(result.current[0].prevValue).toBe(2);

    rerender({ a1: 5 });
    expect(result.current[0].updateTimes).toEqual(2);
    expect(result.current[0].currentValue).toEqual(5);
    expect(result.current[0].prevValue).toBe(2);

    rerender({ a1: 30 });
    expect(result.current[0].updateTimes).toEqual(3);
    expect(result.current[0].currentValue).toEqual(30);
    expect(result.current[0].prevValue).toBe(5);
  });

  it('trace the deps for mul', () => {
    const { result, rerender } = renderHook(
      (props) => {
        return useTraces({
          t1: props.a1,
          t2: props.a2
        });
      },
      { initialProps: { a1: 1, a2: 10 } }
    );

    expect(result.current[0].updateTimes).toEqual(0);
    expect(result.current[0].currentValue).toEqual(1);
    expect(result.current[0].prevValue).toBe('');
    expect(result.current[1].updateTimes).toEqual(0);
    expect(result.current[1].currentValue).toEqual(10);
    expect(result.current[1].prevValue).toBe('');

    // not change
    rerender();
    expect(result.current[0].updateTimes).toEqual(0);
    expect(result.current[0].currentValue).toEqual(1);
    expect(result.current[0].prevValue).toBe('');
    expect(result.current[1].updateTimes).toEqual(0);
    expect(result.current[1].currentValue).toEqual(10);
    expect(result.current[1].prevValue).toBe('');

    // a1 change
    // @ts-ignore
    rerender({ a1: 'a21', a2: 10 });
    expect(result.current[0].updateTimes).toEqual(1);
    expect(result.current[0].currentValue).toEqual('a21');
    expect(result.current[0].prevValue).toEqual(1);
    expect(result.current[1].updateTimes).toEqual(0);
    expect(result.current[1].currentValue).toEqual(10);
    expect(result.current[1].prevValue).toBe('');

    // a2 change
    // @ts-ignore
    rerender({ a1: 'a21', a2: 100 });
    expect(result.current[0].updateTimes).toEqual(1);
    expect(result.current[0].currentValue).toEqual('a21');
    expect(result.current[0].prevValue).toEqual(1);
    expect(result.current[1].updateTimes).toEqual(1);
    expect(result.current[1].currentValue).toEqual(100);
    expect(result.current[1].prevValue).toEqual(10);

    // a1 change again
    // @ts-ignore
    rerender({ a1: 'a211', a2: 100 });
    expect(result.current[0].updateTimes).toEqual(2);
    expect(result.current[0].currentValue).toEqual('a211');
    expect(result.current[0].prevValue).toEqual('a21');
    expect(result.current[1].updateTimes).toEqual(1);
    expect(result.current[1].currentValue).toEqual(100);
    expect(result.current[1].prevValue).toEqual(10);

    // a1 change again and again
    // @ts-ignore
    rerender({ a1: 'a2111', a2: 100 });
    expect(result.current[0].updateTimes).toEqual(3);
    expect(result.current[0].currentValue).toEqual('a2111');
    expect(result.current[0].prevValue).toEqual('a211');
    expect(result.current[1].updateTimes).toEqual(1);
    expect(result.current[1].currentValue).toEqual(100);
    expect(result.current[1].prevValue).toEqual(10);
  });

  it('trace the deps when in prod', () => {
    const { result, rerender } = renderHook(
      (props) => {
        return useTraces(
          {
            t1: props.a1
          },
          true
        );
      },
      { initialProps: { a1: 1 } }
    );
    expect(result.current[0].updateTimes).toEqual(0);
    expect(result.current[0].currentValue).toEqual(1);
    expect(result.current[0].prevValue).toBe('');

    rerender({ a1: 2 });
    expect(result.current[0].updateTimes).toEqual(0);
    expect(result.current[0].currentValue).toEqual(1);
    expect(result.current[0].prevValue).toBe('');
  });
});
