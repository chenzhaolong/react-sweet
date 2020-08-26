

### onMount:
用途：

1）请求接口；

2）设置变量；

3）注册监听；

功能：

1）在组件生成时执行一次；

2）能制定清除函数的内容；


调用形式：
```
// 形式一: 以cb返回的值作为清除函数的内容，不过可能会造成cb的体积过重；
onMount(cb);

// 形式二：分离执行和监听两个操作，以mount作为执行的内容，以clean作为执行后清除的内容；
// 对于监听的清除比较实用；
onMount({
    mount: cb(),
    clean: cb1()
})
```
返回值：无；

demo：

```
export function CheckMountCom() {
  const [value, setValue] = useState('no');
  useMount({
    mount() {
      console.log('mount', value)
    },
    clean() {
      console.log('clean');
    }
  });
  return <div>
    CheckMountCom
    <button onClick={() => {
      setValue('yes');
    }}>点击</button>
  </div>
}
```


### useUpdate:
用途：用在组件rerender的时候触发，不会在组件mount时触发；

调用形式：
```
useUpdate(cb, deps);
```
==tips：deps决不能为空数组；==

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



### useTrace:
用途：可以用来作为查看该组件的当前状态以及当前渲染的次数

调用形式：

```
const status = useLifeStatus()
console.log(status) // {status: 当前状态，updateTimes： 当前渲染次数}
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
