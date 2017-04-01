import xs from 'xstream';
import { run } from '@cycle/run';
import { div, button, p, makeDOMDriver } from '@cycle/dom';
import { combineReducers } from 'redux';
import makeReduxDriver from '../../src/index.ts';
import countReducer, {
  initialCount,
  INCREMENT, DECREMENT,
  increment, decrement,
} from './redux';

function main(sources) {
  const incrementReducer$ = sources.REDUX.action
    .select(INCREMENT)
    .map(({ payload }) =>
      ({ count }) => ({ count: count + payload })
    );

  const decrementReducer$ = sources.REDUX.action
    .select(DECREMENT)
    .map(({ payload }) =>
      ({ count }) => ({ count: count - payload })
    );

  const reducer$ = xs.merge(
    incrementReducer$,
    decrementReducer$
  );

  const props$ = reducer$
    .fold((state, reducer) => reducer(state), { count: initialCount });

  const vdom$ = props$
    .map(({ count }) =>
      div([
        button('.decrement', 'Decrement'),
        button('.increment', 'Increment'),
        p('Counter: ' + count)
      ])
    );

  const action$ = xs.of({
    [DECREMENT]: sources.DOM
      .select('.decrement')
      .events('click')
      .map(_ => decrement(1)),
    [INCREMENT]: sources.DOM
      .select('.increment')
      .events('click')
      .map(_ => increment(1)),
  });

  return {
    DOM: vdom$,
    REDUX: action$,
  };
}

run(main, {
  DOM: makeDOMDriver('#main-container'),
  REDUX: makeReduxDriver(),
});
