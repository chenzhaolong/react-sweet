/**
 * @file check the native of hooks
 */
import React, {Component, useEffect, useState} from 'react'
import {useFn, useResize, useOffset} from '../../react-sweet/src';

export class Native extends Component {
  state = {
    changeId: 0
  };

  render() {
    return (
      <div>
        {/*<CheckFn />*/}
        <CheckOnresize />
        <CheckOffset id={this.state.changeId} />
        <button onClick={(e) => {
          this.setState({changeId: this.state.changeId + 1})
        }}>change</button>
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
      // console.log('e', e);
      fn(e);
      fn1(e);
    };
  });
  return (
    <div>null</div>
  )
}

function CheckOnresize(props) {
  useResize((e) => {
    console.log('onSize', e);
  });

  return (
    <div>resize </div>
  )
}

function CheckOffset(props) {
  const {element, offset} = useOffset([props.id]);
  useEffect(() => {
    console.log('offset', offset);
    // console.log('a', element);
  });
  return (
    <div style={{width: '100px', height: '300px', marginTop: `${props.id}px`}}
         ref={ele => element.current = ele}
    >
      <li>offsetTop-{offset.offsetTop}</li>
      <li>offsetLeft-{offset.offsetLeft}</li>
      <li>offsetWidth-{offset.offsetWidth}</li>
      <li>offsetHeight-{offset.offsetHeight}</li>
    </div>
  )
}