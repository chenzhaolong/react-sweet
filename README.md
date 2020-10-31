# react-sweet

[![GitHub license](https://img.shields.io/github/license/chenzhaolong/react-sweet)](https://github.com/chenzhaolong/react-sweet/blob/master/LICENSE)   [![GitHub version](https://img.shields.io/badge/npm-v1.0.0-brightgreen)](https://github.com/chenzhaolong/react-sweet/blob/master/LICENSE) [![GitHub version](https://img.shields.io/badge/docs-100%25-orange)](https://github.com/chenzhaolong/react-sweet/blob/master/LICENSE)

### 介绍：

基于react hook的函数库，主要分成了六个部分的钩子类型，它们分别是：
1. lifecycle： 关于生命周期方面的钩子 - [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/lifecycle.md)；
2. async: 关于ajax异步请求方面的钩子 - [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/async.md)；
3. form：关于表单校验方面的钩子 - [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/form.md)；
4. tool：关于工具类和便捷类的钩子 - [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/tools.md)；
5. native：关于html原生事件等这类的钩子 - [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/native.md)；
6. store：基于react hook的redux状态管理的钩子 - [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/store.md)；

后续还会继续迭代更多方面的react hook钩子。


### 安装：


```
npm install react-sweet
```

### 使用：

```
import React, {useState} from 'react';
import { useMount } from 'react-sweet';

function Com(props) {
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
