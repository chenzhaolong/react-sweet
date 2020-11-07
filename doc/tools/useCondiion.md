### useCondiion:

用途：类似v-if作用；

调用形式：

```
const result = useCondition({
  yes: 成功时的返回,
  no: 失败时的返回,
  condition：() => {}
})
```


demo：

```
function A() {
    const [a, setA] = useState(1);
    const result = useCondition({
        yes: () => <div>yes</div>,
        no: () => <div>no<div>,
        condition: () => {
            return a > 0;
        }
    });
    return <div>
      {result}
      <button onClock={() => {setA( val => val + 1)}}>点击</button>
    </div>
}
```