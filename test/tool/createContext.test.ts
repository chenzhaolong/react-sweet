import { renderHook, act } from '@testing-library/react-hooks';
import { createContext } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test createContext', () => {
  const context1 = createContext();

  const context2 = createContext();

  it('test the message can receive when send', () => {
    const fn = jest.fn();

    const ComA = renderHook(() => {
      // @ts-ignore
      return context1.useSend('name');
    });

    renderHook(() => {
      return context1.useReceive('name', (msg: any) => {
        fn();
        document.title = msg;
      });
    });

    act(() => {
      ComA.result.current('yes');
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(document.title).toEqual('yes');

    act(() => {
      ComA.result.current('yes');
    });
    expect(fn).toHaveBeenCalledTimes(2);

    act(() => {
      ComA.result.current('hello');
    });
    expect(fn).toHaveBeenCalledTimes(3);
    expect(document.title).toEqual('hello');
  });

  it('test the same msg can only execute one time when send', () => {
    const fn = jest.fn();

    const ComA = renderHook(() => {
      // @ts-ignore
      return context1.useSend('name', true);
    });

    renderHook(() => {
      return context1.useReceive('name', () => {
        fn();
      });
    });

    expect(fn).toHaveBeenCalledTimes(0);

    act(() => {
      ComA.result.current('sdf');
    });
    expect(fn).toHaveBeenCalledTimes(1);

    act(() => {
      ComA.result.current('sdf');
    });
    expect(fn).toHaveBeenCalledTimes(1);

    act(() => {
      ComA.result.current('sdf1');
    });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('then useReceive can not execute if the key is different when send', () => {
    const fn = jest.fn();

    const ComA = renderHook(() => {
      // @ts-ignore
      return context1.useSend('name', true);
    });

    renderHook(() => {
      return context1.useReceive('name1', () => {
        fn();
      });
    });

    expect(fn).toHaveBeenCalledTimes(0);

    act(() => {
      ComA.result.current('yes');
    });
    expect(fn).toHaveBeenCalledTimes(0);

    act(() => {
      ComA.result.current('yes1');
    });
    expect(fn).toHaveBeenCalledTimes(0);
  });

  it('test the two different context send the same key message', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();

    const ComA = renderHook(() => {
      // @ts-ignore
      return context1.useSend('name');
    });

    const ComB = renderHook(() => {
      // @ts-ignore
      return context2.useSend('name');
    });

    renderHook(() => {
      context1.useReceive('name', () => {
        fn1();
      });
      context2.useReceive('name', () => {
        fn2();
      });
    });

    ComA.rerender();
    expect(fn1).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);
    ComB.rerender();
    expect(fn1).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);

    act(() => {
      ComA.result.current('yes');
    });
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(0);

    act(() => {
      ComB.result.current('yes');
    });
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    act(() => {
      ComB.result.current('yes');
    });
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(2);

    act(() => {
      ComB.result.current('yes');
    });
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(3);
  });

  it('test two different key when send', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();

    const ComA = renderHook(() => {
      // @ts-ignore
      const send1 = context1.useSend('name', true);
      const send2 = context1.useSend('age', true);
      return { send1, send2 };
    });

    renderHook(() => {
      context1.useReceive('name', () => {
        fn1();
      });
      context1.useReceive('age', () => {
        fn2();
      });
    });

    act(() => {
      ComA.result.current.send1('yes');
      ComA.result.current.send2('demo');
    });

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    act(() => {
      ComA.result.current.send1('yes');
      ComA.result.current.send2('demo');
    });

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    act(() => {
      ComA.result.current.send1('demo1');
    });
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(1);

    act(() => {
      ComA.result.current.send2('demo1');
    });
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);

    act(() => {
      ComA.result.current.send2('demo1');
      ComA.result.current.send1('demo1');
    });
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);
  });
});
