# cycle-redux-driver
*(un)official Action and State driver for Redux*


<!--## why-->

## installation
	npm install --save @sunny-g/cycle-redux-driver


## usage
Basic usage with the Cycle.js [counter](https://github.com/cyclejs/cyclejs/tree/master/examples/counter) example:

```js
import { combineReducers } from 'redux';
import makeReduxDriver from '../../src/index.ts';
// your standard Redux action types constants, action creators  and reducers
import countReducer, {
  initialCount,
  INCREMENT, DECREMENT,
  increment, decrement,
} from './redux.js';

// typical Redux root reducer
const reducer = combineReducers({
  count: countReducer,
});

function main(sources) {
  // `sources.REDUX.state` is the stream of the Redux store
  // `select` (eventually) takes in a lens or selector
  const props$ = sources.REDUX.state
    .select();

  const vdom$ = props$
    .map(({ count }) =>
      div([
        button('.decrement', 'Decrement'),
        button('.increment', 'Increment'),
        p('Counter: ' + count)
      ])
    );

  // the sink is a stream of an object of action streams
  // the keys should be the action types, values are the actual action streams
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
  REDUX: makeReduxDriver(
    reducer,
    { count: initialCount },
    // specify which action types the driver should funnel into Redux store
    [ INCREMENT, DECREMENT ],
    [],
  ),
});
```

Alternatively, you can choose to ignore the `state` source and Redux store altogether and manage the state yourself (with [onionify](https://github.com/staltz/cycle-onionify) or something similar).

In this next example, we'll map our actions to reducers, and `fold` them into local state manually:

```js
// same imports as before

function main(sources) {
  const incrementReducer$ = sources.REDUX.action
    .select(INCREMENT)
    .map(({ payload }) =>
    ({ count }) =>
      ({ count: count + payload })
    );

  const decrementReducer$ = sources.REDUX.action
    .select(DECREMENT)
    .map(({ payload }) =>
      ({ count }) =>
        ({ count: count - payload })
    );

  // if using `onionify`, `stanga` or something similar,
  // return reducer$ and map the `onion.state` source stream to `vdom$`
  const reducer$ = incrementReducer$
    .merge(decrementReducer$);

  const props$ = reducer$
    .fold((state, reducer) =>
    	reducer(state),
    { count: initialCount });

  // same vdom$ as before
  const vdom$ = props$
    .map(({ count }) =>
      div([
        button('.decrement', 'Decrement'),
        button('.increment', 'Increment'),
        p('Counter: ' + count)
      ])
    );

  // same action$ sink as before
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
  REDUX: makeReduxDriver(),	// not technically using Redux anymore, so pass no arguments to drivers
});
```

## api

### `makeReduxDriver`

##### parameters:
* `reducer: Reducer<any>`: The same Redux reducer you'd pass into `createStore`
* `initialState: any`: The same Redux initial state you'd pass into `createStore`
* `actionsForStore: string[]`: List of action types that would result in a `store`'s state change
  * is necessary for the driver to know which action streams (by type) should be subscribed to and funneled into the `store` on app load
* `middlewares: Middleware[]`: The same Redux middlewares you'd pass into `createStore`

Example:

```js
run(main, {
  // ... other drivers
  REDUX: makeReduxDriver(
    reducer,
    { count: initialCount },
    // specify which action types the driver should funnel into Redux store
    [ INCREMENT, DECREMENT ],
    [],
  ),
});
```

### `redux.action` source

#### `redux.action.select(type)`

##### parameters:
* `type: string`: A stream that emits action objects of the specified by `type`

##### returns:
* `Stream<FSA>`: A stream of [FSA-compliant](https://github.com/acdlite/flux-standard-action) action objects
* **NOTE**: the `meta` property of the action object is an object with the key `'$$CYCLE_ACTION_SCOPE'` (for Cycle.js [isolation](https://cycle.js.org/components.html#components-isolating-multiple-instances))

Example:

```js
const incrementReducer$ = sources.REDUX.action
  .select(INCREMENT)
  .map(({ type, payload, error, meta }) =>
    ({ count }) => ({ count: count + payload })
  );
```

### `redux.state` source

#### `redux.action.select(): Stream<any>`

##### returns:
* `Stream<any>`: A stream that emits the Redux store's current `state` every time the state has *changed*

Example:

```js
const state$ = sources.REDUX.state
  .select();
```

### `redux` sink: `Stream<{ [type: string]: Stream<FSA> }>`

A stream of objects, where each key is a specific action `type` and each value is the stream that emits action objects of that `type`.

Example:

```js
// INCREMENT, DECREMENT are action type constants
// increment, decrement are action creators

const action$ = of({
  [DECREMENT] : sources.DOM
    .select('.decrement')
    .events('click')
    .map(_ => decrement(1)),
  [INCREMENT] : sources.DOM
    .select('.increment')
    .events('click')
    .map(_ => increment(1)),
});

return {
  REDUX: action$,
};
```

## contributing

#### todo

- ensure typescript typings are correct and comprehensive
- refactor implementation to not require `redux` if not using the state source
- example app
- usage docs
	- show `select`ing certain actions
- api docs
- explain contribution
- add more tests :)
- explain why I wrote this

## license
ISC
