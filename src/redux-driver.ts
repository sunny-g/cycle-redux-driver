import { Driver } from '@cycle/run';
import { applyMiddleware, createStore } from 'redux';
import { Middleware, Reducer, Store } from 'redux';
import { ActionSinkStream, ActionSource, ReduxSource, StateSource } from './interfaces';
import MainActionSource from './MainActionSource';
import MainStateSource from './MainStateSource';

export default function makeReduxDriver (
  reducer: Reducer<any>,
  initialState: any,
  ...middlewares: Middleware[],
): Driver<ActionSinkStream, ReduxSource> {
  function reduxDriver(action$$: ActionSinkStream): ReduxSource {
    const store: Store<any> = createStore(
      reducer,
      initialState,
      applyMiddleware(...middlewares),
    );

    const actionSource: ActionSource = new MainActionSource(action$$, store);
    const stateSource: StateSource = new MainStateSource(store);

    return {
      actions: actionSource,
      state: stateSource.getState$(),
      // isolateSource
      // isolateSink
    };
  }

  return reduxDriver;
};
