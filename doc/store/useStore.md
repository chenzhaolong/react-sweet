### useStore：

- 用途：创建一个store对象，该形式和redux一样。

- 调用形式：


```
const store = useStore(reducer, options)
```

1. reducer :

reducer支持函数形式或者对象形式；

函数形式


```
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}
```

对象形式：


```
reducer = {
    App: AppleReducer,
    Ban: BananaReducer,
    Gray: GrayReducer
  }

function AppleReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}
......
```

2. options: 配置对象


```
{
  openAsync?: boolean;  // 是否开启异步，后续会说到，默认是false
  plugins?: Array<Function>; // 支持中间件，中间件的格式后续会说到
  initState?: object; // state的初始值
  openCache?: boolean; // 是否采用内置的缓存中间件，起到性能优化，后续会说到，默认是false。
  openLog?: boolean; // 是否采用内置的日志中间件，后续会说到，默认是true。
}
```

3. 返回值：


```
store = {
  dispatch: (action: Action) => any;
  getState: (path?: string, defaultValue?: any) => any;
}
```
其中：

getState中的path如果存在，会获取制定的path路径的值，如果拿不到就用defaultValue代替；如果没有path，则直接返回整个state；

4. openAsync：该配置项可以让dispatch具有处理异步能力

openAsync为true时，action的格式可以为：

```
{
    type: string,
    payload: async function() {}
}
```

例子：

```
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
```

如果openAsync为false，则action为普通的对象

5. plugins：中间件，和redux的中间件的作用一样，但这里重新定义了中间件的书写格式，让开发者更便捷的开发合适的中间件；

格式：

```
export function plugin1 (globalState) {
  return (next) => {
    return (action) => {};
  };
}

```

以redux-thunk为例子：

```
export function demoPlugins(globalState) {
  return (next) => {
    return (action) => {
      if (typeof action === 'function') {
        action(globalState, next)
      } else {
        next(action)
      }
    }
  }
}
```

6. openCache：开启action缓存机制，如果同一个action，type和payload相同，则会认为该次dispatch没必要，会拦截dispatch，从而起到减少没必要的渲染的作用。

   其原理是内部封装了一个缓存中间件，开启后会启用该中间件进行拦截操作。

7. openLog: 开始日志功能，他会在每次dispatch之后会打印出一条日志，日志内容包括dispatch前后的state。

- demo：

```
export function AppleReducer(state, action) {
  switch (action.type) {
    case 'add':
      return {...state, apple1: action.payload};
    case 'dul':
      return {...state, apple2: action.payload};
    case 'mul':
      return {...state, apple3: action.payload};
    default:
      return state;
  }
}

export function BananaReducer(state, action) {
  switch (action.type) {
    case 'add1':
      return {...state, banana1: action.payload};
    case 'dul1':
      return {...state, banana2: action.payload};
    case 'mul1':
      return {...state, banana3: action.payload};
    default:
      return state;
  }
}

export function GrayReducer(state, action) {
  switch (action.type) {
    case 'add2':
      return {...state, gray1: action.payload};
    case 'dul2':
      return {...state, gray2: action.payload};
    case 'mul2':
      return {...state, gray3: action.payload};
    default:
      return state;
  }
}
```

```
const Provider = createHookProvider({key: Key.p1}).Provider;

function Root(props) {
  const store = useStore({
    App: AppleReducer,
    Ban: BananaReducer,
    Gray: GrayReducer
  }, {
    openCache: true
  });

  useEffect(() => {
    console.log('global', store.getState());
  }, [store]);
  return <Provider value={store}>
    <div>
      <A1/>
      <Root1 id={props.id}/>
    </div>
  </Provider>
}
```

```
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
  }, [state.sta1]);
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
  </div>
}
```