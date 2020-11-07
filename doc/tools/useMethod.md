### useMethod:

用途：将数据层和逻辑操作层捆绑在一起，使得逻辑更加清晰易懂；

调用形式：

```
const {value, trigger} = useMethod(defaultValue, fn)
```

demo：

```
function CheckLogic(props) {
  const {value, trigger} = useMethod(props.id, (val, a, b) => {
    console.log(b);
    return val + a + b
  });
  return <div>
    <button onClick={() => {
      trigger(1, 2);
    }}>click logic - {value}</button>
  </div>
}
```