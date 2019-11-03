/**
 * @file app组件
 */

import React, {Component} from 'react';
import {render} from 'react-dom';
import {Life} from './lifecycle/exma';

class App extends Component {
  render() {
    return (
      <div>
        <Life />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));