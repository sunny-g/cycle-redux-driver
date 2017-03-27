import { adapt } from '@cycle/run/lib/adapt';
import { Store } from 'redux';
import xs, { MemoryStream } from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import { StateSource } from './interfaces';

export default class MakeStateSource implements StateSource {
  private _state$: any;

  constructor(store: Store<any>) {
    let unsubscribe = () => {};
    const state$: MemoryStream<any> = xs
      .create({
        start: listener => {
          listener.next(store.getState());

          unsubscribe = store.subscribe(() => {
            listener.next(store.getState());
          });
        },

        stop: () => unsubscribe(),
      })
      .compose(dropRepeats())
      .remember();

    this._state$ = adapt(state$);
  }

  select() {
    return this._state$;
  }
}
