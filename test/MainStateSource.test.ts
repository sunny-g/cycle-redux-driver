/* global describe, expect, test */

import { createStore, combineReducers } from 'redux';
import xs, { Stream } from 'xstream';
import MainStateSource from '../src/MainStateSource';
import countReducer, {
  initialCount,
  INCREMENT, increment,
} from './support';

describe('state source', () => {

  describe('`select` method', () => {

    test('should exist and be a function', () => {
      const store = createStore(
        countReducer,
        initialCount,
      );

      const stateSource = new MainStateSource(store);

      expect(stateSource.__proto__).toHaveProperty('select');
      expect(stateSource.select).toBeInstanceOf(Function);
    });

    test('should return a stream of the Redux store\'s state', (done) => {
      const store = createStore(
        countReducer,
        initialCount,
      );

      const stateSource = new MainStateSource(store);

      const stateHistory = [];
      const state$ = stateSource
        .select()
        .take(3);

      state$
        .addListener({
          next(state) {
            stateHistory.push(state)
          },
          error() {},
          complete() {
            expect(stateHistory).toEqual([ 0, 1, 6 ]);
            done();
          },
        });

      store.dispatch(increment(1));
      store.dispatch(increment(5));
    });

  });

  describe('isolation', () => {

    test.skip('should perform no isolation', () => {});

  });

});
