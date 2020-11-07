### useAwait：

用途：用来处理promise，将promise的结果返回给调用方。

语法：

```
const {status, data, error} = useAwait(promise实例, deps)；
// 返回值说明
status：wait，success, fail；
data: 返回结果；
error：错误对象；
```

demo：

```
function CheckPromise(props) {
  const {status, data, error} = useAwait(async () => {
    const a = await becomePromise(props.id);
    return a;
  }, [props.id]);
  useEffect(() => {
    console.log('data', data);
    console.log('status', status);
    console.log('error', error);
  });
  return <div>
    答案：{data.a1}
    <br/>
    状态: {status}
  </div>
}

function becomePromise(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 3) {
        resolve({a1: id});
      } else {
        reject(new Error('demo'));
      }
    }, 1000)
  });
}
```
