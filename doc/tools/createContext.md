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