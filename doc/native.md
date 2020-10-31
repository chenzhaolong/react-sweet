### useFn：

用途：函数限流和函数防抖

调用形式：

```
const fn = useFn(cb, {type: throttle || debounce, time}, deps)
```

demo：

```
function CheckFn(props) {
  const fn = useFn((e) => {
    console.log('e1', e);
  }, {type: 'debounce', time: 300});

  const fn1 = useFn((e) => {
    console.log('e2', e);
  }, {type: 'throttle', time: 300});

  useEffect(() => {
    window.onresize = function(e) {
      // console.log('e', e);
      fn(e);
      fn1(e);
    };
  });
  return (
    <div>null</div>
  )
}
```

### useResize：

用途：用来监听window的onresize事件；

语法：

```
useResize((event) => {
    ......
})
```

demo：

```
function CheckOnresize(props) {
  useResize((e) => {
    console.log('onSize', e);
  });

  return (
    <div>resize </div>
  )
}
```

### useOffset：

用途：获取元素的offset的值

调用形式：

```
const {element, offset} = useOffset([deps])
// deps是依赖项
// offset是元素的偏移量，{offsetWidth, offsetHeigth, offsetLeft, offsetTop}
// element是指向dom元素
```
demo：

```
function CheckOffset(props) {
  const [width, setWidth] = useState(100);
  const {element, offset} = useOffset([width, props.id]);
  useEffect(() => {
    console.log('offset', offset);
    console.log('width', width);
  });
  return (
    <div style={{width: width + 'px', height: '300px', marginTop: `${props.id}px`}}
         ref={ele => element.current = ele}
    >
      <li>offsetTop-{offset.offsetTop}</li>
      <li>offsetLeft-{offset.offsetLeft}</li>
      <li>offsetWidth-{offset.offsetWidth}</li>
      <li>offsetHeight-{offset.offsetHeight}</li>
      <button onClick={e => {
        setWidth(ele => ele + 100)
      }}>改变width</button>
    </div>
  )
}
```

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
