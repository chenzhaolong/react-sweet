import { renderHook, act } from '@testing-library/react-hooks';
import { useRule } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useRule', () => {
  const success = jest.fn();
  const fail = jest.fn();

  it('test the rule is wordNum', () => {
    const { result } = renderHook(() => {
      return useRule('wordNum', 'demo');
    });

    expect(result.current.value).toEqual('demo');

    act(() => {
      // @ts-ignore
      result.current.verify({ val: 'demo123', min: 2, max: 8 }, () => {
        success();
      });
    });
    expect(result.current.value).toEqual('demo123');
    expect(success).toHaveBeenCalledTimes(1);

    act(() => {
      // @ts-ignore
      result.current.verify(
        { val: 'demo12567', min: 2, max: 6 },
        {
          success,
          fail
        }
      );
    });
    expect(result.current.value).toEqual('demo12567');
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(1);

    act(() => {
      // @ts-ignore
      result.current.verify(
        { val: 'demo12567', min: 2 },
        {
          success,
          fail
        }
      );
    });
    expect(result.current.value).toEqual('demo12567');
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(2);

    act(() => {
      // @ts-ignore
      result.current.verify(
        { val: 'demo12567', min: 2, max: 1 },
        {
          success,
          fail
        }
      );
    });
    expect(result.current.value).toEqual('demo12567');
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(3);
  });

  it('test the rule is number', () => {
    const { result } = renderHook(() => {
      return useRule('number', 123);
    });
    expect(result.current.value).toEqual(123);

    act(() => {
      result.current.verify(1234, { success, fail });
    });
    expect(result.current.value).toEqual(1234);
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.verify('1234', { success, fail });
    });
    expect(result.current.value).toEqual('1234');
    expect(success).toHaveBeenCalledTimes(2);
    expect(fail).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.verify('1234sd', { success, fail });
    });
    expect(result.current.value).toEqual('1234sd');
    expect(success).toHaveBeenCalledTimes(2);
    expect(fail).toHaveBeenCalledTimes(1);
  });

  it('test the rule is noChinese', () => {
    const { result } = renderHook(() => {
      return useRule('noChinese', 'asdf');
    });
    expect(result.current.value).toEqual('asdf');

    act(() => {
      result.current.verify('你师傅', { success, fail });
    });
    expect(result.current.value).toEqual('你师傅');
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.verify('你师傅sdaf', { success, fail });
    });
    expect(result.current.value).toEqual('你师傅sdaf');
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(2);

    act(() => {
      result.current.verify('asdf你师傅sdaf', { success, fail });
    });
    expect(result.current.value).toEqual('asdf你师傅sdaf');
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(3);

    act(() => {
      result.current.verify('asdsdaf', { success, fail });
    });
    expect(result.current.value).toEqual('asdsdaf');
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(3);
  });

  it('test the rule is specStr', () => {
    const { result } = renderHook(() => {
      return useRule('specStr', 'asdf');
    });
    expect(result.current.value).toEqual('asdf');

    act(() => {
      result.current.verify('afdd@', { fail, success });
    });
    expect(result.current.value).toEqual('afdd@');
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.verify('afdd,adsf', { fail, success });
    });
    expect(result.current.value).toEqual('afdd,adsf');
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(2);

    act(() => {
      result.current.verify('afdd', { fail, success });
    });
    expect(result.current.value).toEqual('afdd');
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(2);
  });

  it('test diy rule', () => {
    const { result } = renderHook(() => {
      return useRule(/[!@#$%]+/, '开始');
    });
    expect(result.current.value).toEqual('开始');

    act(() => {
      result.current.verify('sa@', { success, fail });
    });
    expect(result.current.value).toEqual('sa@');
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.verify('saw', { success, fail });
    });
    expect(result.current.value).toEqual('saw');
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(1);
  });

  it('test diy rule1', () => {
    const { result } = renderHook(() => {
      return useRule((val: any) => {
        return /[!@#$%]+/.test(val);
      }, 'obj6');
    });
    expect(result.current.value).toEqual('obj6');

    act(() => {
      result.current.verify('sa@', { success, fail });
    });
    expect(result.current.value).toEqual('sa@');
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.verify('saw', { success, fail });
    });
    expect(result.current.value).toEqual('saw');
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(1);
  });

  it('test the value will be clean when error', () => {
    const { result } = renderHook(() => {
      return useRule(
        (val: any) => {
          return /[!@#$%]+/.test(val);
        },
        'obj6',
        true
      );
    });
    expect(result.current.value).toEqual('obj6');

    act(() => {
      result.current.verify('sa@', { success, fail });
    });
    expect(result.current.value).toEqual('sa@');
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.verify('saw', { success, fail });
    });
    expect(result.current.value).toEqual('');
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(1);
  });
});
