/**
 * @file check the tool of hooks
 */

import React, { Component, useEffect, useState } from 'react';
import { useTitle, useStyle, useComputed, useFor, useData, createContext, useMethod } from '../../react-sweet';

const context = createContext();
const context1 = createContext();

export class Tools extends Component {
  state = {
    mode: 'add',
    id: 1,
    date: Date.now(),
    list: [
      {a1: 'a', a2: 'b', a3: 'c'},
      {a1: 'a1', a2: 'b1', a3: 'c1'},
      {a1: 'a2', a2: 'b2', a3: 'c2'},
      {a1: 'a3', a2: 'b3', a3: 'c3'},
      {a1: 'a4', a2: 'b4', a3: 'c4'},
    ]
  };

  onClick = (item) => {
    console.log('item', item)
  }

  render() {
    return (
      <div>
        {/*<SetPageTitle title='任意'/>*/}
        <CheckTheStyle mode={this.state.mode} />
        <CheckTheStyleByFunc mode={this.state.mode} id={this.state.id} />
        {/*<button onClick={() => {*/}
        {/*  this.setState({id: this.state.id + 1})*/}
        {/*}}>改变id-{this.state.id}</button>*/}
        <button onClick={() => {
          this.setState({mode: this.state.mode === 'add' ? 'edit' : 'add'})
        }}>改变模式</button>
        <button onClick={() => {
          this.setState({id: Date.now()})
        }}>改变id</button>

        <ComputedValue id={this.state.id} mode={this.state.mode}/>

        <TableList list={this.state.list} />
        <ListItem list={this.state.list} click={this.onClick}/>
        <button onClick={() => {
          const list = [].concat(this.state.list);
          list.push({a1: 'a', a2: 'b', a3: 'c'});
          this.setState({list: list})
        }}>改变列表</button>
        <button onClick={() => {
          this.setState({date: Date.now()})
        }}>改变日期</button>

        <ChangeValue />

        <CheckLogic id={this.state.id} />

        <A1 date={this.state.date}/>
      </div>
    );
  }
}

// check the useTitle
function SetPageTitle(props) {
  const [title, setTitle] = useState(props.title);
  const [id, setId] = useState(1);
  useTitle(title);
  return <div>
    <input value={title} onChange={(e) => {
      setTitle(e.target.value);
    }}/>
    <button onClick={() => {
      setId(val => val + 1);
    }}>其他触发-{id}</button>
  </div>;
}

// check the useStyle
function CheckTheStyle(props) {
  console.log('env', process.env.NODE_ENV)
  const {mode} = props;
  const style = useStyle({
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

// check the useStyle by function params
function CheckTheStyleByFunc(props) {
  const {mode, id} = props;
  const style = useStyle({ fontSize: '16px', color: 'blue' }, (style) => {
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

// check the useComputed
function ComputedValue(props) {
  const {mode, id} = props;
  const [date, setDate] = useState(12);
  const [wait, setWait] = useState({a: 1});
  console.log('wait', wait);
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
  });
  return (<div>
    <p>val1: {val1}</p>
    <p>val2: {val2}</p>
    <p>val3: {val3}</p>
    <p>{mode}</p>
    <button onClick={() => {
      setDate(val => val + 1);
    }}>改变date</button>
    <button onClick={() => {
      setWait(val => {
        val.a = val.a + 1;
        return {...val};
      })
    }}>改变wait</button>
  </div>)
}

class TableList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('update')
  }

  render() {
    return (
      <div>
        {
          this.props.list.map((item, index) => {
            return <p key={index}>{item.a1}</p>
          })
        }
      </div>
    )
  }
}

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

// check the useData
function ChangeValue() {
  const {data, changeData} = useData({a: {b: 1, c: {d: 3}}, e: {a: 4}});
  useEffect(() => {
    console.log('data', data)
  })
  return (
    <div>
      <button onClick={() => {
        changeData('a.c.d', 'shide')
      }}>修改a.c.d</button>

      <button onClick={() => {
        changeData('a.b', 123)
      }}>修改a.b</button>

      <button onClick={() => {
        changeData('a.c', {d: 3})
      }}>修改a.c</button>

      <button onClick={() => {
        changeData('a.e.b', {g: 122})
      }}>添加a.b</button>
    </div>
  )
}

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