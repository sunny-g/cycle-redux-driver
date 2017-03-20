import { adapt } from '@cycle/run/lib/adapt';
import prop from 'ramda/src/prop';
import values from 'ramda/src/values';
import { Store } from 'redux';
import xs from 'xstream';
import { isolateActionSource, isolateActionSink } from './isolate';
import {
  ActionSinkCollection,
  ActionSink,
  ActionSource,
  ActionStream,
} from './interfaces';

export default class MainActionSource implements ActionSource {
  public action$$: ActionSink;
  private _actionStreams: ActionSinkCollection;

  constructor(action$$: ActionSink, _store?: Store<any>, _actionsForStore?: string[]) {
    this.action$$ = action$$;

    const actionsForStore = _actionsForStore || [];
    const store = _store || null;

    if (store !== null && actionsForStore.length > 0) {
      this.dispatchActionsToStore(actionsForStore, store);
    }
  }

  public select(type, transform) {
    if (type === undefined) {
      return this._select('*', action$s => xs.merge(...values(action$s)));
    }

    return this._select(type, typeof transform === 'function' ? transform : prop(type));
  }

  public isolateSource = isolateActionSource;
  public isolateSink = isolateActionSink;

  private createActionStream(
    transform: (action$s: ActionSinkCollection) => ActionStream,
  ): ActionStream {
      // TODO: should this be compose, so that we can update the saved stream if necessary?
    return this.action$$
      .map(transform)
      .flatten();
  }

  private dispatchActionsToStore(actionsForStore: string[], store: Store<any>): void {
    actionsForStore.forEach(type => {
      const action$: ActionStream = this
        .createActionStream(prop(type))
        .debug(action => store.dispatch(action));

      this._actionStreams[type] = adapt(action$);

      // add listener to start funneling actions into store
      action$.addListener({ next() {}, error() {}, complete() {} });
    });
  }

  private _select(type, transform) {
    if (!this._actionStreams.hasOwnProperty(type)) {
      const action$: ActionStream = this
        .createActionStream(transform);

      this._actionStreams[type] = adapt(action$);
    }

    return this._actionStreams[type];
  }
}
