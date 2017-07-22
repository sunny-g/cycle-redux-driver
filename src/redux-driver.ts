import { Driver } from '@cycle/run';
import { createStore, StoreEnhancer } from 'redux';
import { Middleware, Reducer, Store } from 'redux';
import MainActionSource from './MainActionSource';
import MainStateSource from './MainStateSource';
import { isolateActionSource, isolateActionSink } from './isolate';
import {
  ActionSink,
  ActionSource,
  ReduxSource,
  StateSource
} from './interfaces';

export interface MakeReduxDriver {
  ( reducer: Reducer<any>,
    initialState: any,
    actionsForStore: string[],
    storeEnhancer: StoreEnhancer<any>,
  ): Driver<ActionSink, ReduxSource>
}

const makeReduxDriver: MakeReduxDriver = function(
  reducer = state => state,
  initialState = null,
  actionsForStore = [],
  storeEnhancer = x => x,
) {
  const isolateSink = isolateActionSink;
  const isolateSource = (source, scope) => ({
    action: isolateActionSource(source.action, scope),
    state: source.state,
    isolateSource,
    isolateSink,
    scope,
  });

  const store: Store<any> = createStore(
    reducer,
    initialState,
    storeEnhancer,
  );

  return function reduxDriver(action$$: ActionSink): ReduxSource {
    const stateSource: StateSource = new MainStateSource(store);
    const actionSource: ActionSource = new MainActionSource(
      action$$,
      store,
      actionsForStore
    );

    action$$.addListener({ next() {}, error() {}, complete() {} });

    return {
      action: actionSource,
      state: stateSource,
      isolateSource,
      isolateSink,
      scope: 'CYCLE_REDUX_DRIVER',
    };
  };
};

export default makeReduxDriver;
