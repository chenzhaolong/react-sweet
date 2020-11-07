### useComputed

用途：类似vue的计算属性，可以根据绑定的依赖来计算出衍生物的值，依赖项不变，衍生的值不会变。

调用形式：

```
const {val1, val2} = useComputed({
    key: {
        value(): {},
        deps: {}
    },
    ......
})
```

demo：

```
 const {val1, val2, val3} = useComputed({
    val1: {
      value() {
        return `id-${id}`;
      },
      deps: {id}
    },
    val2: {
      value() {
        return date + 1
      },
      deps: {date}
    },
    val3: {
      value() {
        return date + wait.a
      },
      deps: {date, wait: wait}
    }
  })
```