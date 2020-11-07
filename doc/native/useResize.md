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