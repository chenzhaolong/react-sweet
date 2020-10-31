### useTitle

用途：用来设置页面的title；

用法：useTitle(title);

### createContext
用途：用于在函数式父子孙组件之间传递消息。

调用形式：

```
// 创建发射和接受钩子
cosnt {useSend, useReceive} = createContext(); 

// 父层组件调用发射器钩子
const send = useSend(eventName, publishByDiffMessage);
send(data);

// 参数说明：
eventName: 反射的事件
publishByDiffMessage：同一个事件，只有发射信息不一致才会发射，一致则被拦截，布尔值，默认为false。

// 子孙组件接受数据
useReceive(eventName, (data) => {});
```
demo：

```
const context1 = createContext();

function A1(props) {
  // context.useSend('A1', {a: props.date}, [props.date]);
  const send = context1.useSend('A1');
  const send2 = context1.useSend('A2', true);
  useEffect(() => {
    send2('周日');
  }, [])
  return (
    <div>
      <A2/>
      <button onClick={() => {
        send('周六');
        send2('周日1');
      }}>发布消息</button>
    </div>
  )
}

function A2(props) {
  return (
    <div>
      <A3/>
    </div>
  )
}

function A3(props) {
  const [data, setA] = useState('');
  context1.useReceive('A1', (value) => {
    console.log('change');
    setA(value);
  });
  context1.useReceive('A2', (value) => {
    console.log('change', value);
  });
  return (
    <div>
      来自A1的属性{data}
    </div>
  )
}
```

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
