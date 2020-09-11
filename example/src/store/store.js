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
  });
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

function mapStateForA1(state) {
  return {
    sta1: state.App.apple1,
    sta2: state.App.apple3
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
    <span>sta1: {state.sta1}</span>
    <span>sta2: {state.sta2}</span>
    <button onClick={() => {
      dispatch('disA1', 'yes')
    }}>改变sta1</button>
    <button onClick={() => {
      dispatch('disA2', 'woo')
    }}>改变sta2</button>
  </div>
}

