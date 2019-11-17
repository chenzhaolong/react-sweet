/**
 * @file app组件
 */

import React, {Component} from 'react';
import {render} from 'react-dom';
import {Life} from './lifecycle/exma';
import {Tools} from './tools/exam';

class App extends Component {
  render() {
    return (
      <div>
        {/*<Life />*/}
        <Tools />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));