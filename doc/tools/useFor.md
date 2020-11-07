### useFor

用途：类似v-for的作用，用来生成列表形式数组；

调用形式：

```
function ListItem(props) {
  return useFor({
    source: props.list,
    render(item, index) {
      console.log('update1');
      const click = () => {
        props.click && props.click(item)
      }
      return <p key={index} onClick={click}>{item.a2}</p>
    }
  })
}
```