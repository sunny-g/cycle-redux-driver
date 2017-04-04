/* global describe, expect, test */

import { createStore, combineReducers } from 'redux';
import xs, { Stream } from 'xstream';
import MainStateSource from '../src/MainStateSource';
import { INCREMENT, increment } from './support';

describe('state source', () => {

  describe('`select` method', () => {

    test('should exist and be a function', () => {
      const store = createStore();

      const stateSource = new MainStateSource(store);

      expect(stateSource.__proto__).toHaveProperty('select');
      expect(stateSource.select).toBeInstanceOf(Function);
    });

    test.skip('should return a stream of the Redux store\'s state', (done) => {});

    test.skip('should return a stream of the Redux store\'s state without repeats', (done) => {});

  });

  describe('isolation', () => {

    test.skip('should perform no isolation if scope is `null`', () => {});

    test.skip('should isolate correctly if scope is a string', () => {});

  });

});
