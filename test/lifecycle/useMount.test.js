import {renderHook} from '@testing-library/react-hooks'
import {shallow} from 'enzyme'
import { useMount } from '../../example/react-sweet/src'


describe('test useMount', () => {
  it('A1', () => {
    function sum(a, b) {
      return a + b;
    }

    expect(sum(2, 2)).toEqual(4);
  })
})