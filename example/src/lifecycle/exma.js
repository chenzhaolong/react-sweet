/**
 * @file check life cycle hooks
 */

import React, { Component, useState } from 'react';
import {useMount, useUpdate, useUpdates} from '../../react-sweet/src/index';

export class Life extends Component {
  state = {
    display1: true,
    display2: true
  };

  display1 = () => {
    this.setState({display1: !this.state.display1})
  };

  display2 = () => {
    this.setState({display2: !this.state.display2})
  };

  render() {
    return (
      <div>
        <button onClick={this.display1}>
          {this.state.display1 ? '隐藏' : '展示'} CheckMountCom
        </button>
        {
          this.state.display1 ? <CheckMountCom /> : null
        }
        <button onClick={this.display2}>
          {this.state.display2 ? '隐藏' : '展示'} CheckMountHandleAjax
        </button>
        {
          this.state.display2 ?  <CheckMountHandleAjax a='start' /> : null
        }
        <CheckUpdateCom />
        <CheckUpdateComs />
      </div>
    )
  }
}

// 测试useMount
export function CheckMountCom() {
  const [value, setValue] = useState('no');
  useMount({
    mount() {
      console.log(value)
    },
    clean() {
      console.log('clean');
    }
  });
  return <div>
    CheckMountCom
    <button onClick={() => {
      setValue('yes');
    }}>点击</button>
  </div>
}

// 测试useMount处理异步请求
function CheckMountHandleAjax(props) {
  const [data, setData] = useState(props.a);
  let timeout;
  useMount({
    mount() {
      timeout = setTimeout(() => {
        setData('end');
      }, 1000)
    },
    clean() {
      if (timeout) {
        console.log('timeout', timeout)
        clearTimeout(timeout)
      }
    }
  })
  return <div>
    <p>{data}</p>
  </div>
}

// 测试useUpdate
function CheckUpdateCom() {
  const [data, setData] = useState(1);
  const [data1, setData1] = useState(10);
  useUpdate(() => {
    console.log('data', data);
    console.log('data1', data1);
  }, [data, data1]);
  return <div>
    <button onClick={() => {
      setData(val => val + 1)
    }}>改变data</button>
    <button onClick={() => {
      setData1(val => {
        return val + 10;
      })
    }}>改变data1</button>
  </div>
}

// 测试useUpdates
function CheckUpdateComs() {
  const [a1, setData] = useState(1);
  const [a2, setData1] = useState(10);
  useUpdates([
    {
      update() {
        console.log('a1', a1);
      },
      deps: [a1, a2]
    },
    {
      update() {
        console.log('a2', a2);
      },
      deps: [a2]
    }
  ]);
  return <div>
    <button onClick={() => {
      setData(val => val + 1)
    }}>改变a1</button>
    <button onClick={() => {
      setData1(val => {
        return val + 10;
      })
    }}>改变a2</button>
  </div>
}