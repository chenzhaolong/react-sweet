/**
 * @file check the async of hooks
 */
import React, {Component, useEffect, useState, useMemo} from 'react'
import {useAutoFetch, usePolling, useRelyFetch, useFetch} from '../../react-sweet/src';

export class Async extends Component {
  state = {
    changeId: 0
  };

  render() {
    return (
      <div>
        {/*<CheckMountFetch />*/}
        {/*<CheckFetchAll id={this.state.changeId}/>*/}
        <CheckPolling/>
        {/*<CheckRely id={this.state.changeId}/>*/}
        <button onClick={(e) => {
          this.setState({changeId: this.state.changeId + 2})
        }}>点击-{this.state.changeId}</button>
        {/*<CheckUseFetch/>*/}
      </div>
    )
  }
}

let times = 0;

function fetch (params) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log('一次');
      times = times + 1;
      return res({a: params + times, d: times})
    }, 1000);
  })
}

function fetch1(params) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({b: params + times})
    }, 1000)
  });
}

function fetch2(params) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({c: params + times})
    }, 500)
  });
}

// 测试useFetchForMount
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
    deps: [props.id],
    autoFetchMoment: 'update'
  });
  console.log('all', response);
  return loading ? <div>loading</div> : <div>
    <p>apple: {response.apple.a}</p>
    <p>banana: {response.banana.b}</p>
    <p>orange: {response.orange.c}</p>
  </div>
}

function CheckPolling (props) {
  const {response, start, reset, loading} = usePolling((params) => {
    return fetch(params);
  }, {
    terminate(response) {
      if (response.d > 10) {
        return true
      } else {
        return false
      }
    },
    intervalTime: 1000,
    initValue: {},
    onSuccess(data, setData) {
      console.log('data', data);
      times = 0;
      setData({a: 'success'})
    },
    // limitPollingNumber: 5,
    onCompleteByLimit(setData) {
      console.log('到达上限');
      setData({a: 'limit'});
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
    }} disabled={loading}>开始轮询</button>
    <button onClick={() => {
      reset({a: 'stop'})
    }} disabled={!loading}>结束轮询</button>
    <p>当前状态: {loading ? 'polling' : 'finish'}</p>
  </div>
}

function CheckRely(props) {
  const data = {}
  useEffect(() => {
    console.log(data)
  })
  const {result, start} = useRelyFetch({
    // 前因
    first(params) {
      return fetch1(params)
        .then(d => {
          return {a: d.a + 10};
        });
    },
    // 后果
    last(params) {
      return fetch2(params);
    }
  });
  return <div>
    <p>结果：{result.data}</p>
    <button onClick={e => {
      start({a: 1});
    }}>点击-{data.status}</button>
  </div>
}