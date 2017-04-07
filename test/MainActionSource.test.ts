/* global describe, expect, test */

import xs, { Stream } from 'xstream';
import MainActionSource from '../src/MainActionSource';
import { INCREMENT, increment } from './support';

describe('action source', () => {

  describe('`select` method', () => {

    test('should exist and be a function', () => {
      const actionSink$ = xs.of({
        TEST: xs.of({ type: 'TEST', payload: 'test' }),
      });

      const actionSource = new MainActionSource(actionSink$);

      expect(actionSource.__proto__).toHaveProperty('select');
      expect(actionSource.select).toBeInstanceOf(Function);
    });

    test('should return the action sink when given no arguments', (done) => {
      const actionSink$ = xs.of({
        [INCREMENT]: xs.of(increment(1)),
      });

      const actionSource = new MainActionSource(actionSink$);

      actionSource
        .select()
        .addListener({
          next(action$s) {
            expect(action$s).toHaveProperty(INCREMENT);
            expect(action$s[INCREMENT]).toBeInstanceOf(Stream);
            done();
          },
          error() {},
          complete() {},
        });
    });

    test('should return a stream of only action of type `type` when given a `type`', (done) => {
      const actionSink$ = xs.of({
        [INCREMENT]: xs.of(increment(1)),
      });

      const actionSource = new MainActionSource(actionSink$);

      actionSource
        .select(INCREMENT)
        .addListener({
          next(action) {
            expect(action).toHaveProperty('type');
            expect(action.type).toEqual(INCREMENT);
            expect(action).toHaveProperty('payload');
            expect(action.payload).toEqual(1);
            done();
          },
          error() {},
          complete() {},
        });
    });

  });

  describe('isolation', () => {

    test.skip('should perform no isolation if scope is `null`', () => {});

    test.skip('should isolate correctly if scope is a string', () => {});

  });

});
