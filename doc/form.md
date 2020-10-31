### useRule:

用途：用于表单元素中对输入的内容进行单条规则的校验；

调用形式：

```
const {value, verify, isPass} = useRule(rule, initValue, isCleanWhenError, deps)

// 入参：
rule：表单校验规则，支持函数（包括返回promise），正则以及默认的几种校验方式
initValue：初始值
isCleanWhenError：验证失败后是否清除表单的值，默认为false，
deps: 依赖项，针对rule为自定义校验函数的时候，可以根据rule是否存在依赖项而决定是否采用deps；

// rule默认提供的校验函数
'number' ---> 校验数值  verify(e.target.value)
'wordNumr' ---> 校验值的长度  verify({val: e.target.value, min, max})
'noChinese' ---> 校验没有中文字符 verify(e.target.value)
'specStr' ---> 校验是否有特殊字符 verify(e.target.value)


// 返回参数
value：表单的值
verify：校验器，用来在表单值发生变化时触发校验表单值是否符合预期，返回布尔值，如果rule是一个promise，则校验器也返回promise。
isPass: 一开始是空，当触发校验时，才会显示布尔值。

// 校验器的调用形式
verify(value, {
    success: // 校验成功时的调用，
    fail：// 校验失败时的调用
})
```

demo：

```
// rule为正则表达式
function A() {
    const obj5 = useRule(/[!@#$%]+/, '开始');
    return <input value={obj5.value} onChange={e => {
      obj5.verify(e.target.value, {
          fail() { console.log('没有特殊字符');}
          })
    }} />
}
// rule为校验函数
function A() {
    const obj6 = useRule((val) => {
        return !/[!@#$%]+/.test(val);
    }, 'obj6');
    return <input value={obj6.value} onChange={e => {
      obj6.verify(e.target.value)
    }} />
}

// 默认提供的校验函数
function A() {
    const obj1 = useRule('number'， 12);
    return <input value={obj1.value} onChange={e => {
      obj1.verify(e.target.value, {
         success() { console.log('success')},
         fail() {console.log('fail')}
      });
    }} />
}
```

### useRules:

用途：批量校验表单中的值是否复合预期；

调用形式：

```
const {values, verify, logs, result} = useRules(options, deps)

// options参数
{
    key: {
        rule：表单校验规则，支持函数，正则以及默认的几种校验方式,
        initValue：初始值,
        isCleanWhenError：验证失败后是否清除表单的值，默认为false
    }
}

// 返回值
values:所有key对应的当前值；

verify：校验器，用法和useRule类似;

logs：各自key的校验结果；
 
result：所有key的校验结果；
 
 
// verify的调用形式 
verify(key, 表单值，{
    success: 验证成功的回调
    fail：验证失败的回调
});
或者
verify(key, 表单值，success);
```

demo：

```
function CheckInputAll(props) {
  const {values, verify, logs, result } = useRules({
    a: {rule: 'wordNum', initValue: 'wordNum'},
    b: {rule: 'number', initValue: 1, isCleanWhenError: true},
    c: {rule: /[!@#$%]+/, initValue: '2'},
    d: {rule: function(val) {
        return !/[!@#$%]+/.test(val);
      }, initValue: '12'}
  });

  useEffect(() => {
    console.log('result', result);
    console.log('logs', logs);
    console.log('values', values);
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
      verify('d', e.target.value, {
        fail() {
          console.log('有特殊字符');
          return false;
        }
      });
    }} />
  </div>
}
```
