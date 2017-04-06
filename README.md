# cycle-redux-driver
*(un)official Redux Action and State driver for Cycle.js*

<!--## why-->

## installation
```
npm install --save @sunny-g/cycle-redux-driver
```

## usage
Basic usage with the Cycle.js [counter](https://github.com/cyclejs/cyclejs/tree/master/examples/counter) example:

```js
import { combineReducers } from 'redux';
import makeReduxDriver from '@sunny-g/cycle-redux-driver';
// your standard Redux action type constants, action creators and reducers
import countReducer, {
  initialCount,
  INCREMENT, DECREMENT,
  increment, decrement,
} from './redux.js';

// your typical Redux root reducer
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
  // return `reducer$` and map your provided state source stream to `vdom$`
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
* `reducer?: Reducer<any>`: The same Redux reducer you'd pass into `createStore`
* `initialState?: any`: The same Redux initial state you'd pass into `createStore`
* `actionsForStore?: string[]`: List of action types that could result in a `store`'s state change
  * every action stream is lazy by default (unless `select`ed within your application)
  * therefore, in order to preserve as much laziness as possible, we use this array to inform the driver to (eagerly) subscribe to and funnel into the `store` only the action streams that contribute to Redux state
* `middlewares?: Middleware[]`: The same Redux middlewares you'd pass into `createStore`

**NOTE:** All parameters are optional in case you only want to use the action source.

Example:

```js
run(main, {
  // ... other drivers
  REDUX: makeReduxDriver(
    reducer,
    { count: initialCount },
    [ INCREMENT, DECREMENT ],
    [],
  ),
});
```

### `redux.action` source

#### `redux.action.select(type?: string): ActionStream | ActionSink`

##### parameters:
* `type?: string`: A stream that emits action objects of the specified by `type`

##### returns:
* `Stream<FSA> | Stream<{ [type: string]: Stream<FSA> }>`: A stream of [FSA-compliant](https://github.com/acdlite/flux-standard-action) action objects
	* **NOTE**: the `meta` property of the action object is an object with the key `'$$CYCLE_ACTION_SCOPE'` - **this key is required** for Cycle.js [isolation](https://cycle.js.org/components.html#components-isolating-multiple-instances)
	* if `type` was omitted, the stream returned is the raw `ActionSink` that was passed into the driver so that you can create your own custom action streams

Example:

```js
const incrementReducer$ = sources.REDUX.action
  .select(INCREMENT)
  .map(({ type, payload, error, meta }) =>
    ({ count }) => ({ count: count + payload })
  );
```

### `redux.state` source

#### `redux.state.select(): StateStream<any>`

##### returns:
* `MemoryStream<any>`: A stream that emits the Redux store's current `state` every time the state has *changed*

Example:

```js
const state$ = sources.REDUX.state
  .select();
```

### `redux` sink: `ActionSink`

##### should return:
- `Stream<{ [type: string]: Stream<FSA> }>`: A stream of objects, where each key is a specific action `type` and each value is the stream that emits action objects of that `type`.

Example:

```js
// INCREMENT, DECREMENT are action type constants
// increment, decrement are action creators

return {
  // ... other sinks...
  REDUX: of({
    [DECREMENT] : sources.DOM
      .select('.decrement')
      .events('click')
      .map(_ => decrement(1)),
    [INCREMENT] : sources.DOM
      .select('.increment')
      .events('click')
      .map(_ => increment(1)),
  }),
};
```

### helpers

#### `createReducer(initialState: any, reducers: { [type: string]: Reducer })`
Combines a set of related reducers into a single reducer

##### parameters:
* `initialState: any`: The initial state of a Redux "state machine"
* `reducers: { [type: string]: Reducer }`: An object whose keys are the action `type`s and the values are  the `reducer`s that respond to those actions and whose signature is `(state: any, action: FSA) => any`

##### returns:
* a combined `reducer` of the same aformentioned signature

#### `makeActionCreator(type: string)`
Creates a shorthand function for creating action objects

##### parameters:
* `type: string`: The action `type` of the action object

##### returns:
* `actionCreator: (payload: any, error: bool = false, meta: object = {}) => FSA`: A function that creates [FSA-compliant](https://github.com/acdlite/flux-standard-action) action objects with the properties `type`, `payload`, `error`, and `meta`

## contributing

#### todo

- ensure typescript typings are correct and comprehensive and exported correctly
- ensure build tooling with `tsc` and `webpack` is correct
- refactor implementation to not require `redux` if not using the state source
- add testing mock action and state sources
- explain contribution process
- add more tests :)
- explain why I wrote this

## license
ISC
