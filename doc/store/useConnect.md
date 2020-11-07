### useConnect：
- 用途：主要是用来连接上下文，获取上下文中的store对象，

- 调用形式：


```
cosnt {state, dispatch} = useConnect(options)
```

options：

```
{
  relateKey: string; // 关联上下文的key
  mapState: { [key: string]: (getState) => object }; // 获取store中某些状态作为组件属性
  mapDispatch: { [key: string]: (state, dispatch) => any }; // 和redux的mapDispatch一样
  deps: Array<any>; // 略
}
```
demo：

```
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
```

返回值：

```
{
    state，// mapState中返回的对象
    dispatch // mapsDispatch返回的函数，
}

// dispatch调用形式, key就是mapDsipatch中的key，
dispatch(key, data) 
```



- demo：

```
const Provider1 = createHookProvider({key: Key.p2}).Provider;

function Root1(props) {
  const store = useStore({
    Mon: BananaReducer,
    Tue: GrayReducer
  }, {
    openCache: true
  });
  return <Provider1 value={store}>
    <Child3 key2={Key.p2} id={props.id}/>
  </Provider1>
}

```

```
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
  </div>
}
```
