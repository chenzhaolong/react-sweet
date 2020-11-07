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
