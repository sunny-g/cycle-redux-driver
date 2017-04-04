/* global describe, expect, test */

import { isFSA } from 'flux-standard-action';
import { createReducer, makeActionCreator } '../src/util';

describe('utilities', () => {

  describe('createReducer', () => {

    test('should be a function', () => {
      expect(createReducer).toBeInstanceOf(Function);
    });

    test('should return a function', () => {
      const reducer = createReducer(0, {
        'TEST': (state, action) => state,
      });
      expect(reducer).toBeInstanceOf(Function);
    });

    describe('reducer', () => {

      test.skip('', () => {});

    });

  });

  describe('makeActionCreator', () => {

    test('should be a function', () => {
      expect(makeActionCreator).toBeInstanceOf(Function);
    });

    test('should return a function', () => {
      expect(makeActionCreator('test')).toBeInstanceOf(Function);
    });

    describe('action creator', () => {

      test('should produce FSA-compliant action objects', () => {
        const test = makeActionCreator('test');
        const action = test(null);
        expect(isFSA(action)).toBe(true);
      });

    });

  });

});
