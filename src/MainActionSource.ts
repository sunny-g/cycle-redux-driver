import { adapt } from '@cycle/run/lib/adapt';
import { Store } from 'redux';
import {ActionSinkStream, ActionSource, ActionMemoryStream, ActionStream } from './interfaces';

export default class MainActionSource implements ActionSource {
  private _action$$: ActionSinkStream;
  private _store: Store<any>;
  private _actionStreams: { [type: string]: ActionStream | any };

  constructor(action$$: ActionSinkStream, store: Store<any>) {
    this._action$$ = action$$;
    this._store = store;

    // TODO: tap each stream, dispatching each action to the store
  }

  public select(type: string) {
    if (!this._actionStreams.hasOwnProperty(type)) {
      const action$: ActionMemoryStream = this._action$$
        .map(action$s => action$s[type])
        .flatten()
        .remember();

      this._actionStreams[type] = adapt(action$);
    }

    return this._actionStreams[type];
  }
}
