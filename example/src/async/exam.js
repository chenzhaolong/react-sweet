/**
 * @file check the async of hooks
 */
import React, {Component, useEffect, useState} from 'react'
import {useFetchForMount} from '../../react-sweet/src';

export class Async extends Component {
  state = {
    changeId: 0
  };

  render() {
    return (
      <div>
        <CheckMountFetch />
      </div>
    )
  }
}

function fetch (params) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log('send');
      return res({data: {a: {b: {c: 10}}}})
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

