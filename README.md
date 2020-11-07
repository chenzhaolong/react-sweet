# react-sweet

[![GitHub license](https://img.shields.io/github/license/chenzhaolong/react-sweet)](https://github.com/chenzhaolong/react-sweet/blob/master/LICENSE)   [![GitHub version](https://img.shields.io/badge/npm-v1.0.0-brightgreen)](https://github.com/chenzhaolong/react-sweet/blob/master/LICENSE) [![GitHub version](https://img.shields.io/badge/docs-100%25-orange)](https://github.com/chenzhaolong/react-sweet/blob/master/LICENSE)

### 介绍：

基于react hook的函数库，主要分成了六个部分的钩子类型，它们分别是：
1. lifecycle： 关于生命周期方面的钩子

- usemount: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/lifecycle/useMount.md)
- useUpdate: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/lifecycle/useUpdate.md)
- useUpdates: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/lifecycle/useUpdates.md)
- useDestory: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/lifecycle/useDestory.md)
- useTrace: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/lifecycle/useTrace.md)
- useTraces: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/lifecycle/useTraces.md)

2. async: 关于ajax异步请求方面的钩子
- useAutoFetch: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/async/useAutoFetch.md)
- useFetch: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/async/useFetch.md)
- usePolling: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/async/usePolling.md)
- useReyFetch: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/async/useReyFetch.md)
- useUploadFile: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/async/useUploadFile.md)


3. form：关于表单校验方面的钩子
- useRule: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/form/useRule.md)
- useRules: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/form/useRules.md)


4. tool：关于工具类和便捷类的钩子
- createContext: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/tool/createContext.md)
- useComputed: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/tool/useComputed.md)
- useCondiion: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/tool/useCondiion.md)
- useFor: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/tool/useFor.md)
- useMethod: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/tool/useMethod.md)
- useSwitch: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/tool/useSwitch.md)
- useTitle: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/tool/useTitle.md)


5. native：关于html原生事件等这类的钩子
- useAwait: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/native/useAwait.md)
- useFn: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/native/useFn.md)
- useOffset: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/native/useOffset.md)
- useResize: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/native/useResize.md)

6. store：基于react hook的redux状态管理的钩子
- createProvider: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/store/createProvider.md)
- useStore: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/store/useStore.md)
- useConnect: [文档](https://github.com/chenzhaolong/react-sweet/blob/master/doc/store/useConnect.md)

后续还会持续迭代更多方面的react hook钩子。


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
