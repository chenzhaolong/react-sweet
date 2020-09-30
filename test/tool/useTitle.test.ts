import { renderHook } from '@testing-library/react-hooks';
import { useTitle } from '../../src';

afterEach(() => {
  jest.resetAllMocks();
});

describe('test useTitle', () => {
  it('test the title of document', () => {
    renderHook(() => {
      useTitle('test');
    });
    expect(document.title).toEqual('test');
  });

  it('test the title of document change when change title', () => {
    const { rerender } = renderHook(
      (props) => {
        useTitle(props.title);
      },
      { initialProps: { title: 'test' } }
    );
    expect(document.title).toEqual('test');

    rerender({ title: 'jira' });
    expect(document.title).toEqual('jira');
  });
});
