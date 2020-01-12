/**
 * @file check the async of hooks
 */
import React, {Component, useEffect, useState, useMemo} from 'react'
import {useFetchForMount, useFetchAll, usePolling, useRelyFetch} from '../../react-sweet/src';

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
        <CheckRely />
      </div>
    )
  }
}

let times = 0

function fetch (params) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log('一次');
      times = times + 1
      return res({a: {b: {c: params}},d: times})
    }, 1000);
  })
}

function fetch1(params) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({a: params.a})
    }, 1000)
  });
}

function fetch2(params) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({data: params.a})
    }, 500)
  });
}

// 测试useFetchForMount
function CheckMountFetch (props) {
  const response = useFetchForMount(() => {
    return fetch();
  }, 'data.a.b', {});
  console.log('response', response);
  return <div>
    <p>结果: {response.c}</p>
  </div>
}

function CheckFetchAll(props) {
  const data = useFetchAll({
    apple: fetch(11),
    banana: fetch(12),
    orange: fetch(13)
  }, {
    apple: {a: {b: ''}},
    banana: {d: ''},
    orange: {a: {b: {c: ''}}}
  }, [props.id]);
  console.log('all', data);
  return <div>
    <p>apple: {data.apple.d}</p>
    <p>banana: {data.banana.d}</p>
    <p>orange: {data.orange.a.b.c}</p>
  </div>
}

function CheckPolling (props) {
  const [loading, setLoading] = useState('wait');
  const {result, start, reset} = usePolling((params) => {
    return fetch(params);
  }, {
    terminate(response) {
      if (response.d > 10) {
        setLoading('finish');
        return true
      } else {
        return false
      }
    },
    timeout: 1000,
    initValue: {a: {b: {c: ''}}}
  });
  const {start: action} = useRelyFetch((params) => {
    start(0);
    return Promise.resolve();
  }, {
    when(params) {
      return fetch1(params)
        .then(d => {
          return {a: d.a + 10};
        });
    }
  });

  const showData = useMemo(() => {
    return result.a.b.c === 0 ? 'good' : 'bad'
  }, [result.a.b.c]);

  return <div>
    <p>结果: {showData}</p>
    <button onClick={e => {
      setLoading('start');
      // reset();
      // start(0);
      action({a: 2})
    }} >开始轮询</button>
    <p>当前状态: {loading}</p>
  </div>
}

function CheckRely(props) {
  const {result, start} = useRelyFetch({
    // 前因
    antecedents(params) {
      return fetch1(params)
        .then(d => {
          return {a: d.a + 10};
        });
    },
    // 后果
    consequence(params) {
      return fetch2(params);
    }
  });
  return <div>
    <p>结果：{result.data}</p>
    <button onClick={e => {
      start({a: 1});
    }}>点击</button>
  </div>
}