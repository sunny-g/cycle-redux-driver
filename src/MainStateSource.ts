import { adapt } from '@cycle/run/lib/adapt';
import { Store } from 'redux';
import xs, { MemoryStream } from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import { StateSource } from './interfaces';

export default class MakeStateSource implements StateSource {
  private _unsubscribe = () => {};
  private _state$: any;

  constructor(store: Store<any>) {
    const state$: MemoryStream<any> = xs
      .createWithMemory({
        start: listener => {
          listener.next(store.getState());

          this._unsubscribe = store.subscribe(() => {
            listener.next(store.getState());
          });
        },

        stop: this._unsubscribe,
      });

    this._state$ = adapt(state$.compose(dropRepeats()));
  }

  select() {
    return this._state$;
  }
}
