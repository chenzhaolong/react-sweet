/**
 * @file 孙代2
 */

import { fetch1 } from '../fetch';
import { useConnect } from '../../../react-sweet/src';
import React from 'react';

function mapStateForA2(stateFn) {
  return {
    A3D1: stateFn('Gray.gray1', 'haha'),
    A3D2: stateFn('Gray.gray2.white', 'yes'),
    A3D3: stateFn('Gray.gray3', 'unstart1')
  }
}

function mapDispatchForA2(state, dispatch) {
  return {
    disA1(data) {
      dispatch({type: 'add2', payload: data})
    },
    disA2(data) {
      dispatch({type: 'mul2', payload: data})
    },
    disA3(data1) {
      dispatch({
        type: 'mul2',
        payload: async (state, next) => {
          const data = await fetch1();
          next(data + data1);
        }
      })
    }
  }
}

// 孙组件
export function A3(props) {
  const {state, dispatch} = useConnect({
    relateKey: props.key1,
    mapState: mapStateForA2,
    mapDispatch: mapDispatchForA2
  });
  return <div>
    <p>曾孙：</p>
    <div>A3D1:{state.A3D1}</div>
    <div>A3D2:{state.A3D2}</div>
    <div>A3D3:{state.A3D3}</div>
    <br/>
    <button onClick={() => {
      dispatch('disA1', 'banana')
    }}>改变A3D1</button>
    <button onClick={() => {
      dispatch('disA2', 'woo')
    }}>改变A3D2</button>
    <button onClick={() => {
      dispatch('disA3', 2)
    }}>payload为async</button>
  </div>
}
