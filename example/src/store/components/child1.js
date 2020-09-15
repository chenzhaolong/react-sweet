import { fetch1 } from '../fetch';
import { useConnect } from '../../../react-sweet/src';
import React from 'react';
import {A3} from './child2';

/**
 * @file 孙代1
 */
function mapStateForA2(stateFn) {
  return {
    A2D1: stateFn('Ban.banana1', 'haha'),
    A2D2: stateFn('Gray.gray2.white', 'yes'),
    A2D3: stateFn('App.apple3', 'unstart1')
  }
}

function mapDispatchForA2(state, dispatch) {
  return {
    disA1(data) {
      dispatch({type: 'add1', payload: data})
    },
    disA2(data) {
      dispatch({type: 'dul2', payload: {white: data}})
    },
    disA3() {
      const action = (state, next) => {
        fetch1()
          .then(d => {
            next({type: 'dul2', payload: {white: d}})
          })
          .catch(e => {
            console.log('err', e)
          })
      };
      dispatch(action)
    }
  }
}

// 孙组件
export function A2(props) {
  const {state, dispatch} = useConnect({
    relateKey: props.key1,
    mapState: mapStateForA2,
    mapDispatch: mapDispatchForA2
  });
  return <div>
    <p>孙：</p>
    <div>A2D1:{state.A2D1}</div>
    <div>A2D2:{state.A2D2}</div>
    <div>A2D3:{state.A2D3}</div>
    <br/>
    <button onClick={() => {
      dispatch('disA1', 'banana')
    }}>改变A2D1</button>
    <button onClick={() => {
      dispatch('disA2', 'woo')
    }}>改变A2D2</button>
    <button onClick={() => {
      dispatch('disA3')
    }}>action为函数</button>
    <A3 key1={props.key1} />
  </div>
}
