/* global describe, expect, test */

// import xs from 'xstream';
import { createReducer, makeActionCreator } '../src/util';

describe('utilities', () => {

  describe('createReducer', () => {

    test('should be a function', () => {
      expect(createReducer).toBeInstanceOf(Function);
    });

  });

  describe('makeActionCreator', () => {

    test('should be a function', () => {
      expect(makeActionCreator).toBeInstanceOf(Function);
    });

  });

});
