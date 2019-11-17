/**
 * @file check the tool of hooks
 */

import React, { Component, useState } from 'react';
import { useTitle, useStyle, useComputed } from '../../react-sweet/src';

export class Tools extends Component {
  state = {
    mode: 'add',
    id: 1,
    date: Date.now()
  };

  render() {
    return (
      <div>
        <SetPageTitle title='任意'/>
        <CheckTheStyle mode={this.state.mode} />
        <CheckTheStyleByFunc mode={this.state.mode} id={this.state.id} />
        <button onClick={() => {
          this.setState({id: this.state.id + 1})
        }}>改变id-{this.state.id}</button>
        <button onClick={() => {
          this.setState({mode: this.state.mode === 'add' ? 'edit' : 'add'})
        }}>改变模式</button>
        <button onClick={() => {
          this.setState({date: Date.now()})
        }}>改变日期</button>

        <ComputedValue id={this.state.id} mode={this.state.mode} date={this.state.date} />
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
  const {mode, id, date} = props;
  const {val1, val2, val3} = useComputed([
    {
      val1() {
        console.log('val1')
        return `id-${id}`
      },
      deps: [id]
    },
    {
      val2() {
        console.log('val2')
        return `date-${date}`
      },
      val3() {
        console.log('val3')
        return `id和date-${id}:${date}`
      },
      deps: [date]
    }
  ])
  return (<div>
    <p>val1: {val1}</p>
    <p>val2: {val2}</p>
    <p>val3: {val3}</p>
    <p>{mode}</p>
  </div>)
}