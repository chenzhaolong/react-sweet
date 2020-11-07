### useUpdate:
用途：用在组件rerender的时候触发，不会在组件mount时触发；

调用形式：
```
useUpdate(cb, deps);
```
tips：deps决不能为空数组；

demo：

```
function CheckUpdateCom() {
  const [data, setData] = useState(1);
  const [data1, setData1] = useState(10);
  useUpdate(() => {
    console.log('data', data);
    console.log('data1', data1);
  }, [data]);
  return <div>
    <button onClick={() => {
      setData(val => val + 1)
    }}>改变data</button>
    <button onClick={() => {
      setData1(val => {
        return val + 10;
      })
    }}>改变data1</button>
  </div>
}
```