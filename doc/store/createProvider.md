
### createHookProvider：

- 用途：创建一个上下文组件，所创建的上下文组件时和特定的key绑定在一起，返回和React.createContext的一样；主要是配合useConnect一同使用。


- 调用形式：

```
const Context = createHookProvider(options)

// 选项
options = {
    key: 唯一值，后续useConnect会通过key关联制定的上下文,
    force?: 强制更新组件，如果key已经存在，但又想重新更新组件，可以使用该配置，一般不建议使用。
}

// 返回
{Provider, Consumer}
```

- demo：

```
const Key = {
  p1: 'provider',
  p2: 'provider1'
};

const Provider = createHookProvider({key: Key.p1}).Provider;

function Root(props) {
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