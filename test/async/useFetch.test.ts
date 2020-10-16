import { renderHook, act } from '@testing-library/react-hooks';
import { useFetch } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useFetch', () => {
  const ajax = (params: any) => {
    return new Promise((res, rej) => {
      if (params.id > 3) {
        res('yes');
      } else {
        rej('no');
      }
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
    expect(result.current.error).toEqual('');

    act(() => {
      result.current.startFetch({ id: 5 });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes');
    expect(result.current.loading).toEqual(false);
    expect(result.current.error).toEqual('');

    act(() => {
      result.current.startFetch({ id: 1 });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('');
    expect(result.current.loading).toEqual(false);
    expect(result.current.error).toEqual('no');

    act(() => {
      result.current.startFetch({ id: 6 });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes');
    expect(result.current.loading).toEqual(false);
    expect(result.current.error).toEqual('');
  });
});
