/**
 * @file check the tool of hooks
 */

import React, { Component, useState } from 'react';
import { useTitle } from '../../react-sweet/src';

export class Tools extends Component {
  render() {
    return (
      <div>
        <SetPageTitle title='任意' />
      </div>
    )
  }
}

// check the useTitle
function SetPageTitle(props) {
  const [title, setTitle] = useState(props.title);
  const [id, setId] = useState(1)
  useTitle(title);
  return <div>
    <input value={title} onChange={(e) => {
      setTitle(e.target.value)
    }} />
    <button onClick={() => {
      setId(val => val + 1)
    }}>其他触发-{id}</button>
  </div>
}