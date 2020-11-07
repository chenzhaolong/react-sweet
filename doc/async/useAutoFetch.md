### useAutoFetch：

用途：自动在生命周期内拉取异步请求，并返回结果

调用形式：

```
const {response, loading} = useAutoFetch(callback, options);
返回值：
response:响应体；
loading：加载状态；
isError: 是否出错；

参数：
callback：异步请求的逻辑部分，callback必须有返回值且是promise；
options：配置参数
{
    initValue：初始值,
    onError: 出错时的处理，如果没设置，会直接将错误异常抛出体外，onError的返回值可以作为response的值，
    onSuccess: 成功时的函数，onSuccess(data：响应体，setData：更新response)，
    closeLoading: 是否在请求中不开启loading，默认为false,
    updateDeps: 依赖项，只有在autoFetchMoment是update才有效,
    autoFetchMoment: 自动触发的时机，只有两个值，mount---只有组件mount的时候才会触发，update---只有组件update的时候才会触发
}
```

demo：

```
function CheckFetchAll(props) {
  const {response, loading} = useAutoFetch(() => {
    console.log('fetch');
    return Promise.all([
      fetch(props.id),
      fetch1(2),
      fetch2(123),
    ])
  }, {
    initValue: {apple: {}, banana: {}, orange: {}},
    onSuccess(data, setData) {
      const data1 = {apple: data[0], banana: data[1], orange: data[2]};
      setData(data1);
    },
    onError(e) {
      console.log(e);
    },
    updateDeps: [props.id],
    autoFetchMoment: 'update'
  });
  console.log('all', response);
  return loading ? <div>loading</div> : <div>
    <p>apple: {response.apple.a}</p>
    <p>banana: {response.banana.b}</p>
    <p>orange: {response.orange.c}</p>
  </div>
}
```