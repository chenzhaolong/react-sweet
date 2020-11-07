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
