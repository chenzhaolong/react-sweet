### useTraces:
用途：可以用来追踪组件内每个useState所创建的状态的值的更新信息；

返回的形式：

```
[{
   currentUpdateTime: 当前更新的时间
   currentValue: 当前值
   dep: 追踪的依赖项
   prevUpdateTime: 上一次更新的值的时间
   prevValue: 上一次的值
   updateTimes: 该依赖项更新的次数
}]
```
调用形式：

```
const [a1, setA1] = useState(1);
const [a2, setA2] = useState(2);
const traces = useTraces({a1, a2});
```
demo：

```
function CheckUpdateComs() {
  const [a1, setData] = useState(1);
  const [a2, setData1] = useState(10);
  useUpdates([
    {
      update() {
        console.log('a1', a1);
      },
      deps: [a1, a2]
    },
    {
      update() {
        console.log('a2', a2);
      },
      deps: [a2]
    }
  ]);
  console.log('update', a1)
  const traces = useTraces({a2, a1});
  useEffect(() => {
    console.log('traces', traces)
  });
  return <div>
    <button onClick={() => {
      setData(val => val + 1)
    }}>改变a1</button>
    <button onClick={() => {
      setData1(val => {
        return val + 10;
      })
    }}>改变a2</button>
  </div>
}
```