### useLifeCycle：
用途：时useMount，useUpdate，useDesroy的语法糖；

调用形式：

```
useLifeCycle(deps)
.mount(() => {})
.update(() => {})
.destroy(() => {})
```
demo：

```
function CheckLifeCycle() {
  const [life1, setLife] = useState(10);
  const life = useLifeCycle([life1]);
  life.mount(() => {
    console.log('life1', life1)
  }).update(() => {
    console.log('update', life1)
  });
  return <p>
    <button onClick={() => {
      setLife(val => val + 20)
    }}>改变生命周期</button>
  </p>
}
```
