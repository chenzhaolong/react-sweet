### useFetch:

用途：用来给开发手动触发ajax，原则上这个钩子是不设置依赖项；

语法：

```
const {response, startFetch, loading} = useFetch(callback, options);
返回值：
response:响应体；
startFetch：手动触发异步请求,
loading：加载状态,
isError: 是否出错，

参数：
callback：异步请求的逻辑部分，callback必须有返回值且是promise；
options：配置参数
{
    initValue：初始值,
    path: 如果响应体中数据结构复杂，可以通过设置path来获取响应体中想要的部分，
    onError: 出错时的处理，如果没设置，会直接将错误异常抛出体外，onError的返回值可以作为response的值，
    onSuccess: 成功时的函数，onSuccess(data：响应体，setData：更新response)，
    closeLoading: 是否在请求中不开启loading，默认为false,
    deps: 依赖项
}
```

demo：

```
function fetch (params) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log('一次');
      times = times + 1;
      return res({a: {b: {c: params}},d: times})
    }, 1000);
  })
}

function CheckUseFetch(props) {
  const {response, startFetch, loading} = useFetch((params) => {
    return fetch(params);
  }, {
    onSuccess: (data, setData) => {
      console.log('data', data);
      setData({a: 12})
    }
  });
  if (loading) {
    return <div>waiting</div>
  } else {
    return <div>
      <p>结果：{JSON.stringify(response)}</p>
      <button onClick={() => {
        startFetch(12);
      }}>点击</button>
    </div>
  }
}
```