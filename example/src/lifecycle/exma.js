/**
 * @file check life cycle hooks
 */

import React, {useState} from 'react';
import {useMount} from '../../react-sweet/src/index';

export function CheckMountCom() {
  const [value, setValue] = useState('no');
  useMount({
    mount() {
      console.log(value)
    },
    clean() {
      console.log('clean');
    }
  });
  return <div>
    CheckMountCom
    <button onClick={() => {
      setValue('yes');
    }}>点击</button>
  </div>
}