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