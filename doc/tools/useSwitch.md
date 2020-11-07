### useSwitch

用途：适用于不同条件选择不一样的选项；

调用形式：

```
// 多个样式对象条件配对
const style = useSwitch({
    edit: {...},
    add: {...}
}, {edit: mode === 'edit', mode === 'add'}, [mode])

// 通过回调函数设置style
const style = useSwitch({...}, (style) => {
    ...
    return style
}, [mode])
```

demo：
```
function CheckTheStyle(props) {
  const {mode} = props;
  const style = useSwitch({
    add: {
      fontSize: '12px',
      color: 'red'
    },
    edit: {
      fontSize: '16px',
      color: 'blue'
    }
  }, {add: mode === 'add', edit: mode === 'edit'}, [mode]);
  return <div>
    <span style={style}>测试useStyle</span>
  </div>
}

function CheckTheStyleByFunc(props) {
  const {mode, id} = props;
  const style = useSwitch({ fontSize: '16px', color: 'blue' }, (style) => {
    if (id >= 5 && id < 10) {
      return style;
    } else if (id < 5){
       style.color = 'red';
       return style;
    } else {
      // return {
      //   color: 'green'
      // }
    }
  }, [id]);
  return <div>
    <span style={style}>测试useStyle的function模式</span>
  </div>
}
```