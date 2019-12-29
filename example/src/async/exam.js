/**
 * @file check the async of hooks
 */
import React, {Component, useEffect, useState} from 'react'
import {useFetchForMount, useFetchAll} from '../../react-sweet/src';

export class Async extends Component {
  state = {
    changeId: 0
  };

  render() {
    return (
      <div>
        {/*<CheckMountFetch />*/}
        <CheckFetchAll id={this.state.changeId}/>
      </div>
    )
  }
}

function fetch (params) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      return res({a: {b: {c: params}},d: params})
    }, 1000);
  })
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