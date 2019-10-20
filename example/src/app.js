/**
 * @file app组件
 */

import React, {Component} from 'react';
import {render} from 'react-dom';
import {CheckMountCom} from './lifecycle/exma';

class App extends Component {
  render() {
    return (
      <div>
        <CheckMountCom />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));