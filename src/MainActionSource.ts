import { adapt } from '@cycle/run/lib/adapt';
import prop from 'ramda/src/prop';
import values from 'ramda/src/values';
import { Store } from 'redux';
import xs from 'xstream';
import {
  ActionSinkCollection,
  ActionSinkStream,
  ActionSource,
  ActionMemoryStream,
  ActionStream
} from './interfaces';

export default class MainActionSource implements ActionSource {
  private _action$$: ActionSinkStream;
  private _actionsForStore: string[];
  private _store: Store<any>;
  private _actionStreams: ActionSinkCollection;

  constructor(action$$: ActionSinkStream, actionsForStore: string[], store: Store<any>) {
    this._action$$ = action$$;
    this._actionsForStore = actionsForStore;
    this._store = store;

    this.dispatchActionsToStore(this._actionsForStore);
  }

  public select(type, _transform) {
    if (type === undefined) {
      return this.select('*', action$s => xs.merge(...values(action$s)));
    }

    const transform = _transform ? _transform : prop(type);

    if (!this._actionStreams.hasOwnProperty(type)) {
      const action$: ActionMemoryStream = this
        .createActionMemoryStream(transform);

      this._actionStreams[type] = adapt(action$);
    }

    return this._actionStreams[type];
  }

  private createActionMemoryStream(
    transform: (action$s: ActionSinkCollection) => ActionStream,
  ): ActionMemoryStream {
    return this._action$$
      .map(transform)
      .flatten()
      .remember();
  }

  private dispatchActionsToStore(actionsForStore: string[]): void {
    actionsForStore.forEach(type => {
      const action$ = this
        .createActionMemoryStream(prop(type))
        .debug(action => this._store.dispatch(action));

      this._actionStreams[type] = adapt(action$);
    });
  }
}
