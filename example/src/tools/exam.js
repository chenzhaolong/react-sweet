/**
 * @file check the tool of hooks
 */

import React, { Component, useState } from 'react';
import { useTitle, useStyle } from '../../react-sweet/src';

export class Tools extends Component {
  state = {
    mode: 'add',
    id: 1
  }

  render() {
    return (
      <div>
        <SetPageTitle title='任意'/>
        <CheckTheStyle mode={this.state.mode} />
        <button onClick={() => {
          this.setState({id: this.state.id + 1})
        }}>改变id-{this.state.id}</button>
        <button onClick={() => {
          this.setState({mode: this.state.mode === 'add' ? 'edit' : 'add'})
        }}>改变模式</button>
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