### useDestroy:
用途：用来在组件销毁时触发，可以配合useMount一起使用；

调用形式：
```
useDestroy(() => {})
```
demo：

```
function CheckMountHandleAjax(props) {
  const [data, setData] = useState(props.a);
  let timeout;
  useMount({
    mount() {
      timeout = setTimeout(() => {
        setData('end');
      }, 1000)
    }
  })
  useDestroy(() => {
    if (timeout) {
      console.log('timeout', timeout)
      clearTimeout(timeout)
    }
  });
  const status = useTrace();
  useEffect(() => {
    console.log('CheckMountHandleAjax', status);
  });
  return <div>
    <p>{data}</p>
  </div>
}
```