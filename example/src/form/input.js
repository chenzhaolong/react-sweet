/**
 * @file 表单测试
 */

import React, {Component, useEffect, useState, useMemo} from 'react'
import { useRule } from '../../react-sweet/src';

export class Form extends Component {
  state = {
    changeId: 0
  };

  render() {
    return (
      <div>
        <CheckInput id={this.props.id}/>
        <button onClick={e => {
          this.setState({changeId: this.state.changeId + 1});
        }}>点击</button>
      </div>
    )
  }
}

// 检查输入框是否符合规格
function CheckInput(props) {
  // const [val, setVal] = useState('abc');
  const obj1 = useRule('number');
  const obj2 = useRule('wordNum', '初始');
  const obj3 = useRule('noChinese', '');
  const obj4 = useRule('specStr', 1);
  const obj5 = useRule(/[!@#$%]+/, '开始');
  const obj6 = useRule((val) => {
    return !/[!@#$%]+/.test(val);
  }, 'obj6');
  return <div>
    {/* 数字 */}
    <input value={obj1.value} onChange={(e) => {
      const a = obj1.verify(e.target.value, {
        success() {
          console.log('success');
        },
        fail() {
          console.log('fail');
        }
      });
      console.log('a', a);
    }} />
    <br />
    <input value={obj2.value} onChange={(e) => {
      obj2.verify({val: e.target.value, min: 1, max: 10}, {
        success() {
          console.log('success for wordNum');
        },
        fail() {
          console.log('fail for wordNum');
          return false;
        }
      })
    }} />
    <br />
    <input value={obj3.value} onChange={e => {
      obj3.verify(e.target.value, {
        success() {
          console.log('success for noChinese');
        },
        fail() {
          console.log('fail for noChinese');
          return false;
        }
      });
    }} />
    <br />
    <input value={obj4.value} onChange={e => {
      obj4.verify(e.target.value, {
        fail() {
          console.log('有特殊字符');
          return false;
        }
      });
    }} />
    <br />
    <input value={obj5.value} onChange={e => {
      obj5.verify(e.target.value, {
        fail() {
          console.log('有特殊字符');
        }
      })
    }} />
    <br />
    <input value={obj6.value} onChange={e => {
      obj6.verify(e.target.value, {
        fail() {
          console.log('error');
        }
      })
    }} />
  </div>
}