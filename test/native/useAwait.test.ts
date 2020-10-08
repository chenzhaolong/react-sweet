import { renderHook } from '@testing-library/react-hooks';
import { useAwait } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useAwait', () => {
  const promise = () => {
    return new Promise((res) => {
      res('yes');
    });
  };

  const promise1 = () => {
    return new Promise((_res, rej) => {
      rej('no');
    });
  };

  const promise2 = (params: { id: number; data: any }) => {
    return new Promise((_res, rej) => {
      if (params.id < 2) {
        _res(params.data);
      } else {
        rej(params.data);
      }
    });
  };

  it('test the callback can work.', async () => {
    const { result, waitForNextUpdate } = renderHook(() => {
      return useAwait(() => {
        return promise().then(() => {
          return 'yes';
        });
      });
    });
    expect(result.current.status).toEqual('wait');

    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.status).toEqual('success');
    expect(result.current.data).toEqual('yes');
  });

  it('test useAwait can not work when callback return reject', async () => {
    const { result, waitForNextUpdate } = renderHook(() => {
      return useAwait(() => {
        return promise1()
          .then(() => {
            return 'yes';
          })
          .catch((e) => {
            throw e;
          });
      }, []);
    });
    expect(result.current.status).toEqual('wait');

    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.status).toEqual('fail');
    // @ts-ignore
    expect(result.current.error).toEqual('no');
  });

  it('test the useAwait based on deps has been changed', async () => {
    const { result, rerender, waitForNextUpdate } = renderHook(
      (props) => {
        return useAwait(() => {
          return promise2(props.params);
        }, [props.params.id]);
      },
      { initialProps: { params: { id: 0, data: 'yes' } } }
    );

    expect(result.current.status).toEqual('wait');

    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.status).toEqual('success');
    expect(result.current.data).toEqual('yes');
    expect(result.current['error']).toEqual('');

    rerender();
    expect(result.current.status).toEqual('success');
    expect(result.current.data).toEqual('yes');
    expect(result.current['error']).toEqual('');

    rerender({ params: { id: 1, data: 'yes1' } });
    expect(result.current.status).toEqual('wait');
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.status).toEqual('success');
    expect(result.current.data).toEqual('yes1');
    expect(result.current['error']).toEqual('');

    rerender({ params: { id: 1, data: 'yes2' } });
    expect(result.current.status).toEqual('success');
    expect(result.current.data).toEqual('yes1');
    expect(result.current['error']).toEqual('');

    rerender({ params: { id: 2, data: 'no' } });
    expect(result.current.status).toEqual('wait');
    // @ts-ignore
    await waitForNextUpdate(() => result.current);
    expect(result.current.status).toEqual('fail');
    expect(result.current['error']).toEqual('no');
    expect(result.current.data).toEqual('yes1');
  });
});
