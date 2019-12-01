/**
 * @file check the native of hooks
 */
import React, {Component, useEffect} from 'react'
import {useFn} from '../../react-sweet/src';

export class Native extends Component {
  render() {
    return (
      <div>
        <CheckFn />
      </div>
    )
  }
}

// check the useFn
function CheckFn(props) {
  const fn = useFn((e) => {
    console.log('e1', e);
  }, {type: 'debounce', time: 300});

  const fn1 = useFn((e) => {
    console.log('e2', e);
  }, {type: 'throttle', time: 300});

  useEffect(() => {
    window.onresize = function(e) {
      console.log('e', e);
      fn(e);
      fn1(e);
    };
  });
  return (
    <div>null</div>
  )
}