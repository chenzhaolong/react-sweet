/**
 * @file check life cycle hooks
 */

import React from 'react';
import {useMount} from '../../react-sweet/src/index';

export function CheckMountCom() {
  useMount(() => {
    console.log('mount');
  });
  return <div>
    CheckMountCom
  </div>
}