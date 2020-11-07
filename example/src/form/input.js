/**
 * @file 表单测试
 */

import React, {Component, useEffect, useState, useMemo} from 'react'
// import { useRule, useRules } from '../../react-sweet/src';
import {useRule, useRules} from 'react-sweet';
import { isBoolean } from 'lodash'

export class Form extends Component {
  state = {
    changeId: 0
  };

  render() {
    return (
      <div>
        <CheckInput id={this.props.id}/>
        <p>分界线</p>
        <CheckInputAll id={this.props.id}/>
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

  const [errorMsg, setError] = useState('error');
  return <div>
    {/* 数字 */}
    <input value={obj1.value} onChange={(e) => {
      obj1.verify(e.target.value, {
        success() {
          console.log('success');
        },
        fail() {
          if (!e.target.value) {
            setError('require')
          } else {
            setError('出错了')
          }
        }
      });
    }} />
    {obj1.isPass ? null : <div style={{color: 'red'}}>{errorMsg}</div>}
    <br />
    <input value={obj2.value} onChange={(e) => {
      // obj2.verify({val: e.target.value, min: 1, max: 10}, {
      //   success() {
      //     console.log('success for wordNum');
      //   },
      //   fail() {
      //     console.log('fail for wordNum');
      //     return false;
      //   }
      // })
      obj2.verify({val: e.target.value, min: 1, max: 10}, () => {
        console.log('success for wordNum');
      });
    }} />
    <br />
    <input value={obj3.value} onChange={e => {
      obj3.verify(e.target.value, {
        success() {
          console.log('success for noChinese');
        },
        fail() {
          console.log('fail for noChinese');
        }
      });
    }} />
    <br />
    <input value={obj4.value} onChange={e => {
      obj4.verify(e.target.value, {
        fail() {
          console.log('有特殊字符');
        }
      });
    }} />
    <br />
    <input value={obj5.value} onChange={e => {
      obj5.verify(e.target.value, {
        fail() {
          console.log('没有特殊字符');
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

// 检查批量输入框是否符合规范
function CheckInputAll(props) {
  const {values, verify, logs, result } = useRules({
    a: {rule: 'wordNum', initValue: 'wordNum'},
    b: {rule: 'number', initValue: 1, isCleanWhenError: true},
    c: {rule: /[!@#$%]+/, initValue: '2'},
    d: {rule: function(val) {
        return new Promise((res) => {
          setTimeout(() => {
            if (!val) {
              res(false)
            }
            res(!/[!@#$%]+/.test(val));
          }, 500)
        })
      }}
  });

  useEffect(() => {
    console.log('result', result);
    console.log('logs', logs);
    // console.log('values', values);
  });

  return <div>
    <input value={values.a} onChange={(e) => {
      verify('a', {val:e.target.value, min: 0, max: 10}, {
        success() {
          console.log('success');
        },
        fail() {
          console.log('fail');
        }
      });
      console.log('a', logs.a);
    }} />
    <br />
    <input value={values.b} onChange={(e) => {
      verify('b', e.target.value, {
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
    <input value={values.c} onChange={e => {
      verify('c', e.target.value, {
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
    <input value={values.d} onChange={e => {
      console.log('loading');
      verify('d', e.target.value, {
        fail() {
          console.log('end loading');
          console.log('有特殊字符1');
          return false;
        }
      });
    }} />
    {isBoolean(logs.d) && !logs.d && <div style={{color: 'red'}}>error</div>}
  </div>
}