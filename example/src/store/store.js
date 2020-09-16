/**
 * @file 测试store
 */

import React, {Component, useEffect, useReducer} from 'react';
import {useStore, useConnect, createHookProvider} from '../../react-sweet';
import {AppleReducer, BananaReducer, GrayReducer} from './reducer';
import {demoPlugins} from './demoPlugins';
import {fetch1} from './fetch';
import {A2} from './components/child1';
import {Child3} from './components/child3';

const Key = {
  p1: 'provider',
  p2: 'provider1'
};

const Provider = createHookProvider({key: Key.p1}).Provider;

const Provider1 = createHookProvider({key: Key.p2}).Provider;

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
  }, {
    openCache: true,
    plugins: [demoPlugins],
    openAsync: true
  });

  useEffect(() => {
    console.log(store.getState());
  });
  return <Provider value={store}>
    <div>
      <A1/>
      <Root1/>
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
    <A2 key1={Key.p1}/>
  </div>
}


// 兄弟节点
function Root1(props) {
  const store = useStore({
    Mon: BananaReducer,
    Tue: GrayReducer
  }, {
    openCache: true
  });
  return <Provider1 value={store}>
    <Child3 key1={Key.p1} key2={Key.p2} />
  </Provider1>
}
