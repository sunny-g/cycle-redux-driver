import { createReducer, makeActionCreator } from '../../src';

export const DECREMENT = 'DECREMENT';
export const INCREMENT = 'INCREMENT';

export const decrement = makeActionCreator(DECREMENT);
export const increment = makeActionCreator(INCREMENT);

const initialCount = 0;
const countReducer = createReducer(initialCount, {
  [DECREMENT]: (state, { payload }) => state - payload,
  [INCREMENT]: (state, { payload }) => state + payload,
});

export { initialCount };
export default countReducer;
