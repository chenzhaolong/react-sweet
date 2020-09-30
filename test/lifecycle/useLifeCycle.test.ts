import { renderHook } from '@testing-library/react-hooks';
import { useLifeCycle } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useLifeCycle', () => {
  it('test mount when invoke useLifeCycle', () => {
    const fn = jest.fn();
    const { rerender } = renderHook(
      (props) => {
        const life = useLifeCycle([props.a1]);
        life.mount(fn);
      },
      { initialProps: { a1: 1 } }
    );

    expect(fn).toHaveBeenCalledTimes(1);

    rerender({ a1: 2 });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('test update when invoke useLifeCycle', () => {
    const fn = jest.fn();
    const { rerender } = renderHook(
      (props) => {
        const life = useLifeCycle([props.a1]);
        life.update(fn);
      },
      { initialProps: { a1: 1 } }
    );

    expect(fn).toHaveBeenCalledTimes(0);

    rerender({ a1: 2 });
    expect(fn).toHaveBeenCalledTimes(1);

    rerender({ a1: 2 });
    expect(fn).toHaveBeenCalledTimes(1);

    rerender({ a1: 3 });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('test destroy when invoke useLifeCycle', () => {
    const fn = jest.fn();
    const { rerender, unmount } = renderHook(
      (props) => {
        const life = useLifeCycle([props.a1]);
        life.destroy(fn);
      },
      { initialProps: { a1: 1 } }
    );

    expect(fn).toHaveBeenCalledTimes(0);

    rerender({ a1: 2 });
    expect(fn).toHaveBeenCalledTimes(0);

    rerender({ a1: 2 });
    expect(fn).toHaveBeenCalledTimes(0);

    unmount();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('test mount, update, destroy when invoke useLifeCycle', () => {
    const fn = jest.fn();
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const { rerender, unmount } = renderHook(
      (props) => {
        const life = useLifeCycle([props.a1]);
        life
          .mount(fn)
          .update(fn1)
          .destroy(fn2);
      },
      { initialProps: { a1: 1, a2: 1 } }
    );

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn1).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);

    rerender({ a1: 2, a2: 1 });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(0);

    rerender({ a1: 2, a2: 1 });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(0);

    rerender({ a1: 3, a2: 1 });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(0);

    rerender({ a2: 3, a1: 3 });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(0);

    unmount();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(1);
  });
});
