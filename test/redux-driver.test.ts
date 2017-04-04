/* global describe, expect, test */

import xs, { Stream } from 'xstream';
import * as Cycle from '@cycle/run';
import MainActionSource from '../src/MainActionSource';
import MainStateSource from '../src/MainStateSource';
import makeReduxDriver from '../src/redux-driver';
// using the example app's redux action constants, action creators, and reducers

describe('makeReduxDriver', () => {

  test('should be a function', () => {
    expect(makeReduxDriver).toBeInstanceOf(Function);
  });

  test('should return a driver function', () => {
    expect(makeReduxDriver()).toBeInstanceOf(Function);
  });

  test('should return a driver function that returns an object with `action`, `state`, `isolateSource`, `isolateSink` properties', () => {
    const actionSink$$ = xs.of({
      TEST: xs.of({ type: 'TEST', payload: 'test' }),
    });

    const reduxSource = makeReduxDriver()(actionSink$$);

    expect(reduxSource).toHaveProperty('action');
    expect(reduxSource).toHaveProperty('state');
    expect(reduxSource).toHaveProperty('isolateSource');
    expect(reduxSource).toHaveProperty('isolateSink');
    expect(reduxSource.action).toBeInstanceOf(MainActionSource);
    expect(reduxSource.state).toBeInstanceOf(MainStateSource);
    expect(reduxSource.isolateSource).toBeInstanceOf(Function);
    expect(reduxSource.isolateSink).toBeInstanceOf(Function);
  });

  describe('action source', () => {});

  describe('state source', () => {

    test.skip('should emit `null` if no arguments are passed into `makeReduxDriver`', (done) => {});

    test.skip('should return a stream of `null` if no action types are provided', (done) => {});

    test.skip('should emit new state if a watched action is emitted', (done) => {});

    test.skip('should not emit new state if a non-watched action is emitted', (done) => {});

  });

});
