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
});
