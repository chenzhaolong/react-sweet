/**
 * @file app组件
 */

import React, {Component} from 'react';
import {render} from 'react-dom';
import {Life} from './lifecycle/exma';
import {Tools} from './tools/exam';
import {Native} from './native/exam';
import {Async} from './async/exam';

class App extends Component {
  render() {
    return (
      <div>
        {/*<Life />*/}
        {/*<Tools />*/}
        <Native />
        <Async />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));