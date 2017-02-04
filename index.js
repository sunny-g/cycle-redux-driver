/* @flow */

import { applyMiddleware, createStore } from 'redux';
import { Observable, Subject } from 'rx';

export default function makeReduxDriver(reducer, initialState, ...middlewares) {
  return function(outgoingAction$) {
    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(...middlewares),
    );

    const action$ = Observable
      .create(({ onNext, onError, onCompleted }) => {
        return outgoingAction$.subscribe({
          next(action) {
            store.dispatch(action);
            onNext(action);
          },
          error: onError,
          completed: onCompleted,
        });
      })
      .share();

    const state$ = Observable
      .create(({ onNext }) => {
        onNext(store.getState());

        return store.subscribe(function storeSubscriber() {
          onNext(store.getState());
        });
      })
      .distinctUntilChanged()
      .share();

    return {
      ACTION: action$,
      STATE: state$,
    }
  }
}

export function ofType(type: string): any {
  return this.filter((action: Action): boolean => action.type === type);
}

export function ofRootType(prefix: string): any {
  return this.filter((action: Action): boolean => (action.type.slice(0, prefix.length) === prefix));
}
