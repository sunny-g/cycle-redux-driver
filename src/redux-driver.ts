import { Driver } from '@cycle/run';
import { applyMiddleware, createStore } from 'redux';
import { Middleware, Reducer, Store } from 'redux';
import MainActionSource from './MainActionSource';
import MainStateSource from './MainStateSource';
import {
  ActionSinkStream,
  ActionSource,
  ReduxSource,
  StateSource
} from './interfaces';

export default function makeReduxDriver (
  reducer: Reducer<any>,
  initialState: any,
  actionsForStore: string[],
  ...middlewares: Middleware[],
): Driver<ActionSinkStream, ReduxSource> {
  function reduxDriver(action$$: ActionSinkStream): ReduxSource {
    const store: Store<any> = createStore(
      reducer,
      initialState,
      applyMiddleware(...middlewares),
    );

    const actionSource: ActionSource = new MainActionSource(action$$, actionsForStore, store);
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
