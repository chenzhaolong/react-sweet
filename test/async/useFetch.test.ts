import { renderHook, act } from '@testing-library/react-hooks';
import { useFetch } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useFetch', () => {
  const ajax = (params: any) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (params.id > 3) {
          res('yes');
        } else {
          rej('no');
        }
      }, 500);
    });
  };

  const ajax1 = (val: any) => {
    return new Promise((res) => {
      setTimeout(() => {
        res({ a: { b: val } });
      }, 500);
    });
  };

  it('test the fetch', async () => {
    const { result, waitForNextUpdate } = renderHook(() => {
      return useFetch(ajax, {
        initValue: 'test'
      });
    });

    expect(result.current.response).toEqual('test');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);

    act(() => {
      result.current.startFetch({ id: 5 });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);

    act(() => {
      result.current.startFetch({ id: 1 });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(true);

    act(() => {
      result.current.startFetch({ id: 6 });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);
  });

  it('test the success and fail callback', async () => {
    const success = jest.fn();
    const fail = jest.fn();

    const { result, waitForNextUpdate } = renderHook(() => {
      return useFetch(ajax, {
        initValue: 'test',
        onSuccess: (data, setState) => {
          success();
          setState(data + '-resolve');
        },
        onError: (e, setState) => {
          fail();
          setState(e + '-reject');
        }
      });
    });

    expect(result.current.response).toEqual('test');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.startFetch({ id: 5 });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes-resolve');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.startFetch({ id: 1 });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('no-reject');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(true);
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.startFetch({ id: 6 });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes-resolve');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);
    expect(success).toHaveBeenCalledTimes(2);
    expect(fail).toHaveBeenCalledTimes(1);
  });

  it('test the path', async () => {
    const { result, waitForNextUpdate } = renderHook(() => {
      return useFetch(ajax1, {
        initValue: 'test',
        path: 'a.b'
      });
    });

    expect(result.current.response).toEqual('test');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);

    act(() => {
      result.current.startFetch('demo');
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('demo');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);

    act(() => {
      result.current.startFetch('demo123');
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('demo123');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);
  });

  it('test the deps when success or fail', async () => {
    const success = jest.fn();
    const fail = jest.fn();
    const { result, waitForNextUpdate, rerender } = renderHook(
      (params) => {
        return useFetch(ajax, {
          initValue: 'test',
          onSuccess: (data, setState) => {
            success();
            setState(data + '-resolve-' + params.extra);
          },
          onError: (e, setState) => {
            fail();
            setState(e + '-reject-' + params.extra);
          },
          deps: [params.extra]
        });
      },
      { initialProps: { extra: 'ok', ti: '' } }
    );

    expect(result.current.response).toEqual('test');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.startFetch({ id: 5 });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes-resolve-ok');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(0);

    rerender({ extra: 'haha', ti: '' });
    act(() => {
      result.current.startFetch({ id: 1 });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('no-reject-haha');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(true);
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(1);

    rerender({ extra: 'niubi', ti: '' });
    act(() => {
      result.current.startFetch({ id: 6 });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes-resolve-niubi');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);
    expect(success).toHaveBeenCalledTimes(2);
    expect(fail).toHaveBeenCalledTimes(1);

    rerender({ extra: 'niubi', ti: 'niubi' });
    // @ts-ignore
    expect(result.current.response).toEqual('yes-resolve-niubi');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);
    expect(success).toHaveBeenCalledTimes(2);
    expect(fail).toHaveBeenCalledTimes(1);
  });
});
