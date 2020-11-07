### useUpdates:
用途：就是可以一次性设置多个useUpdate，而且一次执行；

调用形式：
```
useUpdates([
  {
      update() {...},
      deps: [...]
  },{
      update() {...},
      deps: [...]
  },{
      update() {...},
     deps: [...]
 }
 ...
])
```

demo:

````
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
````