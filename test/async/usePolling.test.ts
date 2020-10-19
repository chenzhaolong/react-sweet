import { renderHook } from '@testing-library/react-hooks';
import { usePolling } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test usePolling', () => {
  const ajax = (params: any) => {
    return new Promise((res) => {
      setTimeout(() => {
        res(params.id);
      }, 500);
    });
  };

  it('test usePolling can work', () => {
    const {} = renderHook(() => {
      return usePolling(
        (params) => {
          return ajax(params);
        },
        {
          initValue: 'demo',
          terminate: (data) => {
            return data > 10;
          },
          intervalTime: 100
        }
      );
    });
  });
});
