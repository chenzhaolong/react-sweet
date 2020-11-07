### onMount:
用途：

1）请求接口；

2）设置变量；

3）注册监听；

功能：

1）在组件生成时执行一次；

2）能制定清除函数的内容；


调用形式：
```
// 形式一: 以cb返回的值作为清除函数的内容，不过可能会造成cb的体积过重；
onMount(cb);

// 形式二：分离执行和监听两个操作，以mount作为执行的内容，以clean作为执行后清除的内容；
// 对于监听的清除比较实用；
onMount({
    mount: cb(),
    clean: cb1()
})
```
返回值：无；

demo：

```
export function CheckMountCom() {
  const [value, setValue] = useState('no');
  useMount({
    mount() {
      console.log('mount', value)
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
```