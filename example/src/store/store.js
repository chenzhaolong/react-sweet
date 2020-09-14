/**
 * @file 测试store
 */

import React, {Component, useEffect, useReducer} from 'react';
import {useStore, useConnect, createHookProvider} from '../../react-sweet';
import {AppleReducer, BananaReducer, GrayReducer} from './reducer';

const Key = {
  p1: 'provider'
};

const Provider = createHookProvider({key: Key.p1}).Provider;

export class StoreComponent extends Component {
  render() {
    return <div>
      <Root/>
    </div>
  }
}

function Root() {
  const store = useStore({
    App: AppleReducer,
    Ban: BananaReducer,
    Gray: GrayReducer
  }, {openCache: true});
  // const [state, dispatch] = useReducer(AppleReducer, {});
  useEffect(() => {
    console.log(store.getState());
    // console.log('state', state);
  });
  return <Provider value={store}>
    <div>
      <A1/>
      {/*<span>{state.apple1}</span>*/}
      {/*<button onClick={() => {*/}
      {/*  dispatch({type:'add', payload: 'uyu'})*/}
      {/*}}>改变appple1</button>*/}
    </div>
  </Provider>
}

function mapStateForA1(stateFn) {
  return {
    sta1: stateFn('App.apple1.a', 'unstart'),
    sta2: stateFn('App.apple3', 'unstart1')
  }
}

function mapDispatchForA1(state, dispatch) {
  return {
    disA1(data) {
      dispatch({type: 'add', payload: data})
    },
    disA2(data) {
      dispatch({type: 'mul', payload: data})
    }
  }
}

// 子组件
function A1(props) {
  const {state, dispatch} = useConnect({
    relateKey: Key.p1,
    mapState: mapStateForA1,
    mapDispatch: mapDispatchForA1
  });
  useEffect(() => {
    console.log('A1', state);
  });
  return <div>
    <p>子：</p>
    <div>sta1: {state.sta1}</div>
    <div>sta2: {state.sta2}</div>
    <br/>
    <button onClick={() => {
      dispatch('disA1', {a: 1})
    }}>改变sta1</button>
    <button onClick={() => {
      dispatch('disA2', 'woo')
    }}>改变sta2</button>
    <button onClick={() => {
      dispatch('disA1', {a: 3})
    }}>改变sta2</button>
    <A2/>
  </div>
}

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
      dispatch({type: 'dul2', payload: data})
    }
  }
}

// 孙组件
function A2(props) {
  const {state, dispatch} = useConnect({
    relateKey: Key.p1,
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
  </div>
}

