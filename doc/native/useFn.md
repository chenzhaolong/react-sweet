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