/**
 * @file test the life functions of react sweet
 */
'use strict';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {Life} from '../example/src/lifecycle/exma';

const mocha = require('mocha');
const chai = require('chai');

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe('lifecycle', () => {
  it('hsd', () => {
    act(() => {
      ReactDOM.render(<Life />, container);
    });

  })
})