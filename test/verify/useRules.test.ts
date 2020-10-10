import { renderHook, act } from '@testing-library/react-hooks';
import { useRules } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useRules', () => {
  const success1 = jest.fn();
  const fail1 = jest.fn();

  const success2 = jest.fn();
  const fail2 = jest.fn();

  const success3 = jest.fn();
  const fail3 = jest.fn();

  it('test mul rule for wordNum', () => {
    const { result } = renderHook(() => {
      return useRules({
        a1: { rule: 'wordNum', initValue: 'demo' },
        a2: { rule: 'wordNum', initValue: 'demo1' }
      });
    });

    expect(result.current.values).toEqual({ a1: 'demo', a2: 'demo1' });
    expect(result.current.logs).toEqual({ a1: false, a2: false });
    expect(result.current.result).toEqual(false);

    act(() => {
      // @ts-ignore
      result.current.verify('a1', { val: 'demo123', min: 2, max: 8 }, { success: success1, fail: fail1 });
    });
    expect(result.current.values).toEqual({ a1: 'demo123', a2: 'demo1' });
    expect(result.current.logs).toEqual({ a1: true, a2: false });
    expect(result.current.result).toEqual(false);
    expect(success1).toHaveBeenCalledTimes(1);
    expect(fail1).toHaveBeenCalledTimes(0);

    act(() => {
      // @ts-ignore
      result.current.verify('a2', { val: 'demo123234', min: 2, max: 8 }, { success: success2, fail: fail2 });
    });
    expect(result.current.values).toEqual({ a1: 'demo123', a2: 'demo123234' });
    expect(result.current.logs).toEqual({ a1: true, a2: false });
    expect(result.current.result).toEqual(false);
    expect(success2).toHaveBeenCalledTimes(0);
    expect(fail2).toHaveBeenCalledTimes(1);

    act(() => {
      // @ts-ignore
      result.current.verify('a2', { val: 'demo123234', min: 2, max: 18 }, { success: success2, fail: fail2 });
    });
    expect(result.current.values).toEqual({ a1: 'demo123', a2: 'demo123234' });
    expect(result.current.logs).toEqual({ a1: true, a2: true });
    expect(result.current.result).toEqual(true);
    expect(success2).toHaveBeenCalledTimes(1);
    expect(fail2).toHaveBeenCalledTimes(1);

    act(() => {
      // @ts-ignore
      result.current.verify('a1', { val: 'demo123234', min: 2, max: 8 }, { success: success1, fail: fail1 });
    });
    expect(result.current.values).toEqual({ a1: 'demo123234', a2: 'demo123234' });
    expect(result.current.logs).toEqual({ a1: false, a2: true });
    expect(result.current.result).toEqual(false);
    expect(success1).toHaveBeenCalledTimes(1);
    expect(fail1).toHaveBeenCalledTimes(1);
  });

  it('test mul rul for different rules', () => {
    const { result } = renderHook(() => {
      return useRules({
        a1: { rule: 'number', initValue: 'demo' },
        a2: { rule: /[!@#$%]+/, initValue: 'demo1' },
        a3: {
          rule: (val: any) => {
            return /[!@#$%]+/.test(val);
          },
          initValue: 'demo2'
        }
      });
    });

    expect(result.current.values).toEqual({ a1: 'demo', a2: 'demo1', a3: 'demo2' });
    expect(result.current.logs).toEqual({ a1: false, a2: false, a3: false });
    expect(result.current.result).toEqual(false);

    act(() => {
      // @ts-ignore
      result.current.verify('a3', 'sa@', { success: success3, fail: fail3 });
    });
    expect(result.current.values).toEqual({ a1: 'demo', a2: 'demo1', a3: 'sa@' });
    expect(result.current.logs).toEqual({ a1: false, a2: false, a3: true });
    expect(result.current.result).toEqual(false);
    expect(success3).toHaveBeenCalledTimes(1);
    expect(fail3).toHaveBeenCalledTimes(0);

    act(() => {
      // @ts-ignore
      result.current.verify('a2', 'sa@', { success: success2, fail: fail2 });
    });
    expect(result.current.values).toEqual({ a1: 'demo', a2: 'sa@', a3: 'sa@' });
    expect(result.current.logs).toEqual({ a1: false, a2: true, a3: true });
    expect(result.current.result).toEqual(false);
    expect(success2).toHaveBeenCalledTimes(1);
    expect(fail2).toHaveBeenCalledTimes(0);

    act(() => {
      // @ts-ignore
      result.current.verify('a1', 23, { success: success1, fail: fail1 });
    });
    expect(result.current.values).toEqual({ a1: 23, a2: 'sa@', a3: 'sa@' });
    expect(result.current.logs).toEqual({ a1: true, a2: true, a3: true });
    expect(result.current.result).toEqual(true);
    expect(success1).toHaveBeenCalledTimes(1);
    expect(fail1).toHaveBeenCalledTimes(0);

    act(() => {
      // @ts-ignore
      result.current.verify('a1', 233, { success: success1, fail: fail1 });
    });
    expect(result.current.values).toEqual({ a1: 233, a2: 'sa@', a3: 'sa@' });
    expect(result.current.logs).toEqual({ a1: true, a2: true, a3: true });
    expect(result.current.result).toEqual(true);
    expect(success1).toHaveBeenCalledTimes(2);
    expect(fail1).toHaveBeenCalledTimes(0);

    act(() => {
      // @ts-ignore
      result.current.verify('a1', 'f233', { success: success1, fail: fail1 });
    });
    expect(result.current.values).toEqual({ a1: 'f233', a2: 'sa@', a3: 'sa@' });
    expect(result.current.logs).toEqual({ a1: false, a2: true, a3: true });
    expect(result.current.result).toEqual(false);
    expect(success1).toHaveBeenCalledTimes(2);
    expect(fail1).toHaveBeenCalledTimes(1);
  });

  it('test the error then clear the value', () => {
    const { result } = renderHook(() => {
      return useRules({
        a1: { rule: 'wordNum', initValue: 'demo', isCleanWhenError: true },
        a2: { rule: 'wordNum', initValue: 'demo1' }
      });
    });

    expect(result.current.values).toEqual({ a1: 'demo', a2: 'demo1' });
    expect(result.current.logs).toEqual({ a1: false, a2: false });
    expect(result.current.result).toEqual(false);

    act(() => {
      // @ts-ignore
      result.current.verify('a1', { val: 'demo123', min: 2, max: 8 }, { success: success1, fail: fail1 });
    });
    expect(result.current.values).toEqual({ a1: 'demo123', a2: 'demo1' });
    expect(result.current.logs).toEqual({ a1: true, a2: false });
    expect(result.current.result).toEqual(false);
    expect(success1).toHaveBeenCalledTimes(1);
    expect(fail1).toHaveBeenCalledTimes(0);

    act(() => {
      // @ts-ignore
      result.current.verify('a2', { val: 'demo123234', min: 2, max: 8 }, { success: success2, fail: fail2 });
    });
    expect(result.current.values).toEqual({ a1: 'demo123', a2: 'demo123234' });
    expect(result.current.logs).toEqual({ a1: true, a2: false });
    expect(result.current.result).toEqual(false);
    expect(success2).toHaveBeenCalledTimes(0);
    expect(fail2).toHaveBeenCalledTimes(1);

    act(() => {
      // @ts-ignore
      result.current.verify('a2', { val: 'demo123234', min: 2, max: 18 }, { success: success2, fail: fail2 });
    });
    expect(result.current.values).toEqual({ a1: 'demo123', a2: 'demo123234' });
    expect(result.current.logs).toEqual({ a1: true, a2: true });
    expect(result.current.result).toEqual(true);
    expect(success2).toHaveBeenCalledTimes(1);
    expect(fail2).toHaveBeenCalledTimes(1);

    act(() => {
      // @ts-ignore
      result.current.verify('a1', { val: 'demo123234', min: 2, max: 8 }, { success: success1, fail: fail1 });
    });
    expect(result.current.values).toEqual({ a1: '', a2: 'demo123234' });
    expect(result.current.logs).toEqual({ a1: false, a2: true });
    expect(result.current.result).toEqual(false);
    expect(success1).toHaveBeenCalledTimes(1);
    expect(fail1).toHaveBeenCalledTimes(1);
  });
});
