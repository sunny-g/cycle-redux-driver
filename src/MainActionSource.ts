import { adapt } from '@cycle/run/lib/adapt';
import { values } from 'ramda';
import { Store } from 'redux';
import xs from 'xstream';
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

  public select(type?: string) {
    if (type === undefined) {
      return this.selectAll();
    }

    if (!this._actionStreams.hasOwnProperty(type)) {
      const action$: ActionMemoryStream = this._action$$
        .map(action$s => action$s[type])
        .flatten()
        .remember();

      this._actionStreams[type] = adapt(action$);
    }

    return this._actionStreams[type];
  }

  public selectAll() {
    if (!this._actionStreams.hasOwnProperty('*')) {
      const action$: ActionMemoryStream = this._action$$
        .map(action$s => xs.merge(...values(action$s)))
        .flatten()
        .remember();
      this._actionStreams['*'] = adapt(action$);
    }

    return this._actionStreams['*'];
  }
}
