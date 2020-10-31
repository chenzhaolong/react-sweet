### useFetch:

用途：用来给开发手动触发ajax，原则上这个钩子是不设置依赖项；

语法：

```
const {response, startFetch, loading} = useFetch(callback, options);
返回值：
response:响应体；
startFetch：手动触发异步请求,
loading：加载状态,
isError: 是否出错，

参数：
callback：异步请求的逻辑部分，callback必须有返回值且是promise；
options：配置参数
{
    initValue：初始值,
    path: 如果响应体中数据结构复杂，可以通过设置path来获取响应体中想要的部分，
    onError: 出错时的处理，如果没设置，会直接将错误异常抛出体外，onError的返回值可以作为response的值，
    onSuccess: 成功时的函数，onSuccess(data：响应体，setData：更新response)，
    closeLoading: 是否在请求中不开启loading，默认为false,
    deps: 依赖项
}
```

demo：

```
function fetch (params) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log('一次');
      times = times + 1;
      return res({a: {b: {c: params}},d: times})
    }, 1000);
  })
}

function CheckUseFetch(props) {
  const {response, startFetch, loading} = useFetch((params) => {
    return fetch(params);
  }, {
    onSuccess: (data, setData) => {
      console.log('data', data);
      setData({a: 12})
    }
  });
  if (loading) {
    return <div>waiting</div>
  } else {
    return <div>
      <p>结果：{JSON.stringify(response)}</p>
      <button onClick={() => {
        startFetch(12);
      }}>点击</button>
    </div>
  }
}
```

### useAutoFetch：

用途：自动在生命周期内拉取异步请求，并返回结果

调用形式：

```
const {response, loading} = useAutoFetch(callback, options);
返回值：
response:响应体；
loading：加载状态；
isError: 是否出错；

参数：
callback：异步请求的逻辑部分，callback必须有返回值且是promise；
options：配置参数
{
    initValue：初始值,
    onError: 出错时的处理，如果没设置，会直接将错误异常抛出体外，onError的返回值可以作为response的值，
    onSuccess: 成功时的函数，onSuccess(data：响应体，setData：更新response)，
    closeLoading: 是否在请求中不开启loading，默认为false,
    updateDeps: 依赖项，只有在autoFetchMoment是update才有效,
    autoFetchMoment: 自动触发的时机，只有两个值，mount---只有组件mount的时候才会触发，update---只有组件update的时候才会触发
}
```

demo：

```
function CheckFetchAll(props) {
  const {response, loading} = useAutoFetch(() => {
    console.log('fetch');
    return Promise.all([
      fetch(props.id),
      fetch1(2),
      fetch2(123),
    ])
  }, {
    initValue: {apple: {}, banana: {}, orange: {}},
    onSuccess(data, setData) {
      const data1 = {apple: data[0], banana: data[1], orange: data[2]};
      setData(data1);
    },
    onError(e) {
      console.log(e);
    },
    updateDeps: [props.id],
    autoFetchMoment: 'update'
  });
  console.log('all', response);
  return loading ? <div>loading</div> : <div>
    <p>apple: {response.apple.a}</p>
    <p>banana: {response.banana.b}</p>
    <p>orange: {response.orange.c}</p>
  </div>
}
```

### usePolling

场景：轮询。

调用形式：

```
const {response, start, reset, loading} = usePolling(callback, options);
返回值：
response:响应体；
loading：加载状态;
start:开始轮询；
reset：终止轮询；
isError: 是否出错；

参数：
callback：异步请求的逻辑部分，callback必须有返回值且是promise；
options：配置参数
{
   intervalTime: 轮询时间间隔;
   terminate: (data: any) => boolean 轮询结束函数，data为请求的返回
   initValue?: any; 初始值
   onError?: (error: any) => any; 出错时的处理，如果没设置，会直接将错误异常抛出体外，onError的返回值可以作为response的值，
   onSuccess?: (data: any, setResponse: (data: any) => any) => void;  成功时的函数，onSuccess(data：响应体，setData：更新response)，
   onCompleteByLimitNumber?: (setResponse: (data: any) => any) => void;  对应这limitPollingNumber，到达轮询次数上限时的处理函数
   onCompleteByLimitTime?: (setResponse: (data: any) => any) => void;   对应这limitPollingTime，到达轮询耗时的处理函数
   onReset?: (setResponse: (data: any) => any) => void;  终止时触发的函数
   limitPollingNumber?: number;  轮询次数上限
   limitPollingTime?: number;  轮询耗时上限
   closeLoading?: boolean;  是否关闭loading
}
```

demo：

```
function CheckPolling (props) {
  const {response, start, reset, loading, isError} = usePolling((params) => {
    return fetch(params);
  }, {
    terminate(response) {
      if (response.d > 10) {
        return true
      } else {
        return false
      }
    },
    intervalTime: 0,
    initValue: {},
    onSuccess(data, setData) {
      console.log('data', data);
      times = 0;
      setData({a: 'success'})
    },
    // limitPollingNumber: 5,
    // limitPollingTime: 6000,
    onCompleteByLimitTime(setData) {
      console.log('time到达上限');
      setData({a: 'time limit'});
      times = 0;
    },
    onCompleteByLimitNumber(setData) {
      console.log('number到达上限');
      setData({a: 'number limit'});
      times = 0;
    },
    onReset(setData) {
      console.log('stop');
      setData({a: 'stop'});
      times = 0;
    }
  });

  return <div>
    <p>结果: {response.a}</p>
    <button onClick={e => {
      start(0);
    }} disabled={loading}>开始轮询</button>
    <button onClick={() => {
      reset()
    }} disabled={!loading}>结束轮询</button>
    <p>当前状态: {loading ? 'polling' : 'finish'}</p>
  </div>
}
```

### useReyFetch:

用途：两个请求之间存在依赖关系时，可以通过该钩子获取两个依赖请求之间的数据；

语法：

```
const {response, loading, start， isError} = useRelyFetch(options, deps);
返回值：
response:响应体；
   repsonse = {mainData: 主函数的响应体，relyData: 依赖函数的响应体}
loading：加载状态;
start:触发函数
   start({mainParams: 主函数参数，relyParams：依赖函数参数})
isError: 是否出错；   
   
options参数：
{
    main: (params) => Promise<any>; // 主函数， params就是start的mainParams
    rely: (params) => Promise<any>; // 依赖函数，如果没有paramsFn，params为{mainData，relyParams}，如果有则以paramsFn的返回值为主
    initValue：{mainData，relyData}
    paramsFn: (params) => any; // 依赖函数的参数函数，主要用来处理rely函数的请求参数，返回值就是rely的入参，params = {mainData，relyParams}
    onSuccess: (response, setResponse) => void; // rely函数响应成功时的函数，其中response为{mainData，relyData}，setResponse更新函数，setResponse(main的返回，rely的返回)
    onError?: (error, type, setResponse) => void; // main和rely函数失败的处理函数，error为错误堆栈，type为main或者rely，setResponse同上
    closeLoading: // 是否在请求中不开启loading，默认为false
    deps: 依赖项
} 
```

demo:

```
function CheckRely(props) {
  const { response, start, loading } = useRelyFetch(
    {
      main(params) {
        console.log('mainParams', params);
        return fetch1(params)
          .then(d => {
            return { a: d.b + 10 };
          });
      },
      rely(params) {
        console.log('relyParams', params);
        return fetch2(params.id);
      },
      paramsFn(params) {
        return {id: props.id, status: 'yes'}
      },
      onSuccess(data, setData) {
        console.log('success', data);
        setData({a: 'main' + data.mainData.a}, {c: 'rely' + data.relyData.c});
      },
      onError(error, type, setData) {
        console.log('error', error);
        setData('error')
      },
      initValue: { mainData: {}, relyData: {} }
    }, [props.id]);
  return <div>
    <p>状态{loading ? 'loading' : 'complete'}</p>
    <p>main结果：{response.mainData.a}</p>
    <p>rely结果：{response.relyData.c}</p>
    <button onClick={e => {
      start({ mainParams: 1, relyParams: 2 });
    }}>点击
    </button>
  </div>;
}
```

### useUploadFile：

场景：用来进行文件上传，能支持分片上传和暂停，恢复上传等操作。

语法：

```
const {response, start, terminate, pause, resume, loading} = useUploadFile(uploadFn, options)

// 参数：
uploadFn：文件上传的回调函数，它会接受几个参数； 
UploadFn = (chunk: number, content: Blob, md5Value: string, file: File, total?: number) => Promise<any>;

options：配置参数
{
   openChunk?: boolean;  // 是否打开分片
   limitChunkNumber?: number; // 限制分片个数
   limitFileSize?: number;  // 限制上传文件体积
   chunkSize: number;  // 每片的大小
   interval?: number;  // 每片上传的时间间隔
  onSuccess?: (response: any, setResponse: (data: any) => void) => void;  // 全部上传完的回调
  onError?: (error: any, setResponse: (data: any) => void) => void;  // 上传失败的回调
  onTerminate?: (setResponse: (data: any) => void) => void;  // 终止的回调
  onPause?: (setResponse: (data: any) => void) => void;  // 暂停的回调
  onProgress?: (data: any) => void;  // 每次上传成功后的回调
  deps?: Array<any>;  // 依赖
  useMd5?: boolean;  // 是否采用md5
  initValue?: any;  // 初始值
  timeout: number;  // 上传多久后会超时
  onTimeout: (data: any, setResponse: (data: any) => void) => void;  // 超时回调
}

// 返回
response: {status: 状态，data: 响应体，percentage: 百分比}
status：
  START = 'start',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  FAIL = 'fail',
  PAUSE = 'pause',
  TERMINATE = 'terminate',
  UNSTART = 'unstart',
  TIMEOUT = 'timeout'
  
start: (params: any) => void; 开始上传
terminate: () => void; 终止
pause: () => void; 暂停
resume: () => void; 恢复
loading: boolean; 是否加载
```

demo:

```
function FileCom(props) {
  const {
    response,
    start,
    loading,
    pause,
    resume,
    terminate
  } = useUploadFile((chunk, content, md5, file, total) => {
    return uploadFetch({times: chunk, content, md5, total})
  }, {
    chunkSize: 500,
    limitChunkNumber: 5000,
    limitFileSize: 5000 * 1024,
    initValue: {success: ''},
    // timeout: 20000,
    useMd5: true,
    onTimeout(data, setData) {
      console.log('timeout', data)
      setData({success: 'timeout'})
    },
    onTerminate(setData) {
      console.log('terminate');
      setData({success: 'terminate'});
    },
    onPause(setData) {
      setData({success: 'pause'});
    },
    // onProgress(data) {
    //   console.log('progress', data)
    // }
    onError(err, setData) {
      console.log(err)
      setData({success: 'error'})
    },
    onSuccess(data, setData) {
      setData({success: 'complete'});
    }
  });

  useEffect(() => {
    console.log('response', response);
    console.log('loading', loading);
  });

  return <div>
    <input type="file" name="file" id="id_file" onInput={e => {
      const files = e.target.files;
      start(files[0]);
    }}/>
    <div>{loading ? response.status : response.data.success || '还没开始upload'}</div>
    <div>进度{response.percentage}</div>
    <button onClick={() => {
      terminate()
    }}>终止</button>
    <button onClick={() => {
      pause()
    }}>暂停</button>
    <button onClick={() => {
      resume()
    }}>恢复</button>
  </div>
}
```
