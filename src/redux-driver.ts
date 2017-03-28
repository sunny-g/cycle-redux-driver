import { Driver } from '@cycle/run';
import { applyMiddleware, createStore } from 'redux';
import { Middleware, Reducer, Store } from 'redux';
import MainActionSource from './MainActionSource';
import MainStateSource from './MainStateSource';
import {
  ActionSink,
  ActionSource,
  ReduxSource,
  StateSource
} from './interfaces';

export default function makeReduxDriver (
  reducer: Reducer<any>,
  initialState: any,
  actionsForStore: string[],
  ...middlewares: Middleware[],
): Driver<ActionSink, ReduxSource> {
  return function reduxDriver(action$$: ActionSink): ReduxSource {
    const store: Store<any> = createStore(
      reducer,
      initialState,
      applyMiddleware(...(middlewares || [])),
    );

    const actionSource: ActionSource = new MainActionSource(action$$, store, actionsForStore);
    const stateSource: StateSource = new MainStateSource(store);

    return {
      actions: actionSource,
      state: stateSource,
    };
  };
};
