import { renderHook, act } from '@testing-library/react-hooks';
import { useRelyFetch } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useRelyFetch', () => {
  const ajax = (params: any) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (params.id > 3) {
          res(`main-yes-${params.id}`);
        } else {
          rej(`main-no-${params.id}`);
        }
      }, 500);
    });
  };

  const ajax1 = (params: any) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (params.id > 3) {
          res(`rely-yes-${params.id}`);
        } else {
          rej(`rely-no-${params.id}`);
        }
      }, 500);
    });
  };

  it('test the useRelyFetch can run', async () => {
    const { result, waitForNextUpdate } = renderHook(() => {
      return useRelyFetch({
        main(params) {
          return ajax(params);
        },
        rely(params: any) {
          return ajax1(params.relyParams);
        },
        initValue: { mainData: 'main-demo', relyData: 'rely-demo' }
      });
    });

    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData).toEqual('main-demo');
    expect(result.current.response.relyData).toEqual('rely-demo');

    act(() => {
      result.current.start({ mainParams: { id: 5 }, relyParams: { id: 6 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData).toEqual('main-yes-5');
    expect(result.current.response.relyData).toEqual('rely-yes-6');

    act(() => {
      result.current.start({ mainParams: { id: 2 }, relyParams: { id: 7 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(true);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData).toEqual('main-yes-5');
    expect(result.current.response.relyData).toEqual('rely-yes-6');

    act(() => {
      result.current.start({ mainParams: { id: 7 }, relyParams: { id: 2 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(true);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData).toEqual('main-yes-5');
    expect(result.current.response.relyData).toEqual('rely-yes-6');

    act(() => {
      result.current.start({ mainParams: { id: 7 }, relyParams: { id: 7 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData).toEqual('main-yes-7');
    expect(result.current.response.relyData).toEqual('rely-yes-7');
  });

  it('test the paramsFn for using useRelyFetch', async () => {
    const { result, waitForNextUpdate } = renderHook(() => {
      return useRelyFetch({
        main(params) {
          return ajax(params).then((res) => ({ txt: res, id: params.id }));
        },
        rely(params: any) {
          return ajax1(params);
        },
        initValue: { mainData: { txt: 'main-demo', id: 0 }, relyData: 'rely-demo' },
        paramsFn({ mainData, relyParams }) {
          return { id: relyParams.id + mainData.id };
        }
      });
    });

    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData.txt).toEqual('main-demo');
    expect(result.current.response.relyData).toEqual('rely-demo');

    act(() => {
      result.current.start({ mainParams: { id: 5 }, relyParams: { id: 6 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData.txt).toEqual('main-yes-5');
    expect(result.current.response.relyData).toEqual('rely-yes-11');

    act(() => {
      result.current.start({ mainParams: { id: 2 }, relyParams: { id: 7 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(true);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData.txt).toEqual('main-yes-5');
    expect(result.current.response.relyData).toEqual('rely-yes-11');

    act(() => {
      result.current.start({ mainParams: { id: 7 }, relyParams: { id: 2 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData.txt).toEqual('main-yes-7');
    expect(result.current.response.relyData).toEqual('rely-yes-9');

    act(() => {
      result.current.start({ mainParams: { id: 7 }, relyParams: { id: 7 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData.txt).toEqual('main-yes-7');
    expect(result.current.response.relyData).toEqual('rely-yes-14');
  });

  it('test the onSuccess and onError', async () => {
    const { result, waitForNextUpdate } = renderHook(() => {
      return useRelyFetch({
        main(params) {
          return ajax(params).then((res) => ({ txt: res, id: params.id }));
        },
        rely(params: any) {
          return ajax1(params);
        },
        initValue: { mainData: { txt: 'main-demo', id: 0 }, relyData: 'rely-demo' },
        onSuccess({ mainData, relyData }, setResponse) {
          mainData.txt = `${mainData.txt}-diy`;
          setResponse(mainData, relyData);
        },
        // @ts-ignore
        onError(error, type, setResponse) {
          setResponse('error', 'error');
        },
        paramsFn({ mainData, relyParams }) {
          return { id: relyParams.id + mainData.id };
        }
      });
    });

    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData.txt).toEqual('main-demo');
    expect(result.current.response.relyData).toEqual('rely-demo');

    act(() => {
      result.current.start({ mainParams: { id: 5 }, relyParams: { id: 6 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData.txt).toEqual('main-yes-5-diy');
    expect(result.current.response.relyData).toEqual('rely-yes-11');

    act(() => {
      result.current.start({ mainParams: { id: 2 }, relyParams: { id: 7 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(true);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData).toEqual('error');
    expect(result.current.response.relyData).toEqual('error');

    act(() => {
      result.current.start({ mainParams: { id: 7 }, relyParams: { id: 2 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData.txt).toEqual('main-yes-7-diy');
    expect(result.current.response.relyData).toEqual('rely-yes-9');

    act(() => {
      result.current.start({ mainParams: { id: 7 }, relyParams: { id: 7 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData.txt).toEqual('main-yes-7-diy');
    expect(result.current.response.relyData).toEqual('rely-yes-14');
  });

  it('test the deps', async () => {
    const { result, waitForNextUpdate, rerender } = renderHook(
      ({ a }) => {
        return useRelyFetch({
          main(params) {
            return ajax(params).then((res) => ({ txt: res, id: params.id }));
          },
          rely(params: any) {
            return ajax1(params);
          },
          initValue: { mainData: { txt: 'main-demo', id: 0 }, relyData: 'rely-demo' },
          onSuccess({ mainData, relyData }, setResponse) {
            mainData.txt = `${mainData.txt}-${a}`;
            setResponse(mainData, relyData);
          },
          // @ts-ignore
          onError(error, type, setResponse) {
            setResponse('error', 'error');
          },
          paramsFn({ mainData, relyParams }) {
            return { id: relyParams.id + mainData.id };
          },
          deps: [a]
        });
      },
      { initialProps: { a: 1 } }
    );

    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData.txt).toEqual('main-demo');
    expect(result.current.response.relyData).toEqual('rely-demo');

    act(() => {
      result.current.start({ mainParams: { id: 5 }, relyParams: { id: 6 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData.txt).toEqual('main-yes-5-1');
    expect(result.current.response.relyData).toEqual('rely-yes-11');

    rerender({ a: 2 });
    act(() => {
      result.current.start({ mainParams: { id: 5 }, relyParams: { id: 7 } });
    });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.response.mainData.txt).toEqual('main-yes-5-2');
    expect(result.current.response.relyData).toEqual('rely-yes-12');
  });
});
