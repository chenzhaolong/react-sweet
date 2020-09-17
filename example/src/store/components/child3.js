/**
 * @file 兄弟组件
 */
import { useConnect } from '../../../react-sweet/src';
import React from 'react';
import { fetch1 } from '../fetch';

function mapStateForA3(stateFn) {
  return {
    A4D1: stateFn('Ban.banana1', 'haha'),
    A4D2: stateFn('Gray.gray2.white', 'yes'),
  }
}

function mapDispatchForA3(state, dispatch) {
  return {
    disA1(data) {
      dispatch({type: 'add1', payload: data})
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

function mapStateForA4(stateFn) {
  return {
    B1D1: stateFn('Mon.banana3', 'haha'),
    B1D2: stateFn('Tue.gray3', 'yes'),
  }
}

function mapDispatchForA4(state, dispatch) {
  return {
    disA1(data) {
      dispatch({type: 'mul1', payload: data})
    },
    disA3(data) {
      dispatch({type: 'mul2', payload: data})
    }
  }
}

// 孙组件
export function Child3(props) {
  const store1 = useConnect({
    relateKey: props.key1,
    mapState: mapStateForA3,
    mapDispatch: mapDispatchForA3
  });

  const store2 = useConnect({
    relateKey: props.key2,
    mapState: mapStateForA4,
    mapDispatch: mapDispatchForA4
  });
  return <div>
    <p>父层store：</p>
    <div>A2D1:{store1.state.A4D1}</div>
    <div>A2D2:{store1.state.A4D2}</div>
    <br/>
    <button onClick={() => {
      store1.dispatch('disA1', 'banana')
    }}>改变A4D1</button>
    <button onClick={() => {
      store1.dispatch('disA3')
    }}>action为函数</button>

    <p>本层store</p>
    <div>B1D1:{store2.state.B1D1}</div>
    <div>B1D2:{store2.state.B1D2}</div>
    <br/>
    <button onClick={() => {
      store2.dispatch('disA1', 120)
    }}>改变B1D1</button>
    <button onClick={() => {
      store2.dispatch('disA3', 130)
    }}>改变B2D1</button>
    <Child4 key2={props.key2}/>
  </div>
}

function Child4 (props) {
  const {state, dispatch} = useConnect({
    relateKey: props.key2,
    mapState: (stateFn) => {
      return {
        B2B1: stateFn('Tue.gray3', 'unstart')
      }
    },
    mapDispatch: (state, dispatch) => {
      return {
        dis1: (action) => {
          console.log(state.Tue.gray3);
          dispatch(action)
        }
      }
    }
  });
  return <div>
    {/*<p>banana1: {state.Mon.banana1}</p>*/}
    <p>gray2: {state.B2B1}</p>
    <button onClick={() => {
      dispatch('dis12', {type: 'mul2', payload: 12})
    }}>
      改变gray2
    </button>
  </div>
}