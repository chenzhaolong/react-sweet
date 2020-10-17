import { renderHook } from '@testing-library/react-hooks';
import { useAutoFetch } from '../../src';
import { useEffect } from 'react';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useAutoFetch', () => {
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

  it('test the useAutoFetch for mount when ajax success', async () => {
    const success = jest.fn();
    const fail = jest.fn();
    const { result, rerender, waitForNextUpdate } = renderHook(
      (props) => {
        return useAutoFetch(
          () => {
            return ajax({ id: 9 });
          },
          {
            initValue: 'demo',
            onSuccess: (data, setState) => {
              success();
              setState(data + '-demo');
            },
            onError: (e, setState) => {
              fail();
              setState(e + '-demo');
            },
            updateDeps: [props.a]
          }
        );
      },
      { initialProps: { a: 1 } }
    );

    expect(result.current.response).toEqual('demo');
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(true);
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(0);

    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes-demo');
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(0);

    rerender({ a: 2 });
    expect(result.current.response).toEqual('yes-demo');
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(0);
  });

  it('test the useAutoFetch for mount when ajax fail', async () => {
    const success = jest.fn();
    const fail = jest.fn();
    const { result, rerender, waitForNextUpdate } = renderHook(
      (props) => {
        return useAutoFetch(
          () => {
            return ajax({ id: 1 });
          },
          {
            initValue: 'demo',
            onSuccess: (data, setState) => {
              success();
              setState(data + '-demo');
            },
            onError: (e, setState) => {
              fail();
              setState(e + '-demo');
            },
            updateDeps: [props.a]
          }
        );
      },
      { initialProps: { a: 1 } }
    );

    expect(result.current.response).toEqual('demo');
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(true);
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(0);

    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('no-demo');
    expect(result.current.isError).toEqual(true);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(1);

    rerender({ a: 2 });
    expect(result.current.response).toEqual('no-demo');
    expect(result.current.isError).toEqual(true);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(1);
  });

  it('test the useAutoFetch for update', async () => {
    const success = jest.fn();
    const fail = jest.fn();
    const common = jest.fn();
    const { result, waitForNextUpdate, rerender } = renderHook(
      (props) => {
        useEffect(common, [props.a, props.b]);
        return useAutoFetch(
          () => {
            return ajax({ id: props.a });
          },
          {
            initValue: 'demo',
            updateDeps: [props.a],
            onSuccess: (data, setState) => {
              success();
              setState(data + '-demo');
            },
            onError: (e, setState) => {
              fail();
              setState(e + '-demo');
            },
            // @ts-ignore
            autoFetchMoment: 'update'
          }
        );
      },
      { initialProps: { a: 1, b: 2 } }
    );

    expect(result.current.response).toEqual('demo');
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(0);
    expect(common).toHaveBeenCalledTimes(1);

    rerender({ a: 6, b: 3 });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes-demo');
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(0);
    expect(common).toHaveBeenCalledTimes(2);

    rerender({ a: 3, b: 3 });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('no-demo');
    expect(result.current.isError).toEqual(true);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(1);
    expect(common).toHaveBeenCalledTimes(3);

    rerender({ a: 5, b: 3 });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes-demo');
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(2);
    expect(fail).toHaveBeenCalledTimes(1);
    expect(common).toHaveBeenCalledTimes(4);

    rerender({ a: 5, b: 6 });
    expect(result.current.response).toEqual('yes-demo');
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(2);
    expect(fail).toHaveBeenCalledTimes(1);
    expect(common).toHaveBeenCalledTimes(5);
  });

  it('test the useAutoFetch without updateDeps', () => {
    const success = jest.fn();
    const fail = jest.fn();
    const common = jest.fn();
    const { result, rerender } = renderHook(
      (props) => {
        useEffect(common, [props.a, props.b]);
        return useAutoFetch(
          () => {
            return ajax({ id: props.a });
          },
          {
            initValue: 'demo',
            onSuccess: (data, setState) => {
              success();
              setState(data + '-demo');
            },
            onError: (e, setState) => {
              fail();
              setState(e + '-demo');
            },
            // @ts-ignore
            autoFetchMoment: 'update'
          }
        );
      },
      { initialProps: { a: 1, b: 2 } }
    );

    expect(result.current.response).toEqual('demo');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(0);
    expect(common).toHaveBeenCalledTimes(1);

    rerender({ a: 3, b: 10 });
    expect(result.current.response).toEqual('demo');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(0);
    expect(common).toHaveBeenCalledTimes(2);

    rerender({ a: 13, b: 10 });
    expect(result.current.response).toEqual('demo');
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(0);
    expect(common).toHaveBeenCalledTimes(3);
  });

  it('test the result when deps has changed', async () => {
    const success = jest.fn();
    const fail = jest.fn();
    const common = jest.fn();
    const { result, waitForNextUpdate, rerender } = renderHook(
      (props) => {
        useEffect(common, [props.a, props.b]);
        return useAutoFetch(
          () => {
            return ajax({ id: props.a });
          },
          {
            initValue: 'demo',
            updateDeps: [props.a],
            onSuccess: (data, setState) => {
              success();
              setState(data + props.a);
            },
            onError: (e, setState) => {
              fail();
              setState(e + props.a);
            },
            // @ts-ignore
            autoFetchMoment: 'update'
          }
        );
      },
      { initialProps: { a: '1', b: 2 } }
    );

    expect(result.current.response).toEqual('demo');
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(0);
    expect(common).toHaveBeenCalledTimes(1);

    rerender({ a: '6', b: 3 });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes6');
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(0);
    expect(common).toHaveBeenCalledTimes(2);

    rerender({ a: '3', b: 3 });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('no3');
    expect(result.current.isError).toEqual(true);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledTimes(1);
    expect(common).toHaveBeenCalledTimes(3);

    rerender({ a: '5', b: 3 });
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.response).toEqual('yes5');
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(2);
    expect(fail).toHaveBeenCalledTimes(1);
    expect(common).toHaveBeenCalledTimes(4);

    rerender({ a: '5', b: 6 });
    expect(result.current.response).toEqual('yes5');
    expect(result.current.isError).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(success).toHaveBeenCalledTimes(2);
    expect(fail).toHaveBeenCalledTimes(1);
    expect(common).toHaveBeenCalledTimes(5);
  });
});
