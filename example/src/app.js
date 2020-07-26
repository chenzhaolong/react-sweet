/**
 * @file app组件
 */

import React, {Component} from 'react';
import {render} from 'react-dom';
import {Life} from './lifecycle/exma';
import {Tools} from './tools/exam';
import {Native} from './native/exam';
import {Async} from './async/exam';
import {Form} from './form/input';

class App extends Component {
  render() {
    return (
      <div>
        {/* <Life /> */}
        {/*<Tools />*/}
        <Native />
        {/*<Async />*/}
        {/* <Form />*/}
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));