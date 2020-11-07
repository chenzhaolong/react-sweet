### useTrace:
用途：可以用来作为查看该组件的当前状态以及当前渲染的次数

调用形式：

```
const status = useLifeStatus()
console.log(status) // {status: 当前状态，updateTimes： 当前更新渲染次数}
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