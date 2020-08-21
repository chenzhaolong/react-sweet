/**
 * @file check the async of hooks
 */
import React, { Component, useEffect, useState, useMemo } from 'react';
import { useAutoFetch, usePolling, useRelyFetch, useFetch, useUploadFile } from '../../react-sweet/src';

export class Async extends Component {
  state = {
    changeId: 0,
    show: true
  };

  render() {
    return (
      <div>
        {/*<CheckMountFetch />*/}
        {/*<CheckFetchAll id={this.state.changeId}/>*/}
        {/* {this.state.show ? <CheckPolling id={this.state.changeId} /> : null} */}
        {/*<CheckRely id={this.state.changeId}/>*/}
        <FileCom/>
        {/*<button onClick={(e) => {*/}
        {/*  this.setState({ changeId: this.state.changeId + 2 });*/}
        {/*}}>点击-{this.state.changeId}</button>*/}
        {/*<button onClick={() => {*/}
        {/*  this.setState({ show: !this.state.show });*/}
        {/*}}>消失/显示 checkPolling*/}
        {/*</button>*/}
        {/*<CheckUseFetch/>*/}
      </div>
    );
  }
}

let times = 0;

function fetch(params) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log('一次');
      times = times + 1;
      return res({ a: params + times, d: times });
    }, 1000);
  });
}

function fetch1(params) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({ b: params + times });
    }, 1000);
  });
}

function fetch2(params) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({ c: params + times });
    }, 500);
  });
}

// 测试useFetchForMount
function CheckUseFetch(props) {
  const { response, startFetch, loading } = useFetch((params) => {
    return fetch(params);
  }, {
    onSuccess: (data, setData) => {
      console.log('data', data);
      setData({ a: 12 });
    }
  });
  if (loading) {
    return <div>waiting</div>;
  } else {
    return <div>
      <p>结果：{JSON.stringify(response)}</p>
      <button onClick={() => {
        startFetch(12);
      }}>点击
      </button>
    </div>;
  }
}

// function CheckMountFetch (props) {
//   const response = useFetchForMount(() => {
//     return fetch();
//   }, 'data.a.b', {});
//   console.log('response', response);
//   return <div>
//     <p>结果: {response.c}</p>
//   </div>
// }

function CheckFetchAll(props) {
  const { response, loading } = useAutoFetch(() => {
    console.log('fetch');
    return Promise.all([
      fetch(props.id),
      fetch1(2),
      fetch2(123)
    ]);
  }, {
    initValue: { apple: {}, banana: {}, orange: {} },
    onSuccess(data, setData) {
      const data1 = { apple: data[0], banana: data[1], orange: data[2] };
      setData(data1);
    },
    onError(e) {
      console.log(e);
    },
    deps: [props.id],
    autoFetchMoment: 'update'
  });
  console.log('all', response);
  return loading ? <div>loading</div> : <div>
    <p>apple: {response.apple.a}</p>
    <p>banana: {response.banana.b}</p>
    <p>orange: {response.orange.c}</p>
  </div>;
}

function CheckPolling(props) {
  const { response, start, reset, loading } = usePolling((params) => {
    return fetch(params);
  }, {
    terminate(response) {
      if (response.d > 10) {
        return true;
      } else {
        return false;
      }
    },
    intervalTime: 0,
    initValue: {},
    onSuccess(data, setData) {
      console.log('data', data);
      times = 0;
      setData({ a: 'success' });
    },
    // limitPollingNumber: 5,
    // limitPollingTime: 6000,
    onCompleteByLimitTime(setData) {
      console.log('time到达上限');
      setData({ a: 'time limit' });
      times = 0;
    },
    onCompleteByLimitNumber(setData) {
      console.log('number到达上限');
      setData({ a: 'number limit' });
      times = 0;
    },
    onReset(setData) {
      console.log('stop');
      setData({ a: 'stop' });
      times = 0;
    }
  });
  // const {start: action} = useRelyFetch({
  //   first(params) {
  //     start(0);
  //     return Promise.resolve();
  //   },
  //   last(params) {
  //     return fetch1(params)
  //       .then(d => {
  //         return {a: d.a + 10};
  //       });
  //   }
  // });
  //
  // const showData = useMemo(() => {
  //   return result.a.b.c === 0 ? 'good' : 'bad'
  // }, [result.a.b.c]);

  return <div>
    <p>结果: {response.a}</p>
    <button onClick={e => {
      // reset();
      start(0);
      // action({a: 2})
    }} disabled={loading}>开始轮询
    </button>
    <button onClick={() => {
      reset();
    }} disabled={!loading}>结束轮询
    </button>
    <p>当前状态: {loading ? 'polling' : 'finish'}</p>
  </div>;
}

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

function uploadFetch (params) {
  return new Promise((res, rej) => {
    // console.log('params:', params);
    setTimeout(() => {
      if (params.times > 10) {
        rej({success: 'hahahha'});
      } else {
        res({success: 'success'});
      }
    }, 1000);
  });
}

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