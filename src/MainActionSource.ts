import { adapt } from '@cycle/run/lib/adapt';
import { Store } from 'redux';
import xs, { Stream } from 'xstream';
import { inScope, isolateActionSource, isolateActionSink } from './isolate';
import {
  ActionSinkCollection,
  ActionSink,
  ActionSource,
  ActionStream,
} from './interfaces';

const NOOP = () => {};

export default class MainActionSource implements ActionSource {
  public action$$: ActionSink;
  private _actionStreams: ActionSinkCollection = {};

  constructor(
    action$$: ActionSink,
    _store?: Store<any>,
    _actionsForStore?: string[]
  ) {
    this.action$$ = action$$;

    const actionsForStore = _actionsForStore || [];
    const store = _store || null;

    if (store && actionsForStore && actionsForStore.length > 0) {
      this.dispatchActionsToStore(actionsForStore, store);
    }
  }

  public select(type) {
    if (type === undefined) {
      return adapt(this.action$$);
    }

    return adapt(this.getOrCreateActionStream(type));
  }

  public inScope = inScope;
  public isolateSource = isolateActionSource;
  public isolateSink = isolateActionSink;

  private dispatchActionsToStore(actionsForStore: string[], store: Store<any>): void {
    actionsForStore.forEach(type => {
      this
        .getOrCreateActionStream(type)
        .debug(action => store.dispatch(action))
        .addListener({ next: NOOP, error: NOOP, complete: NOOP });
    });
  }

  private getOrCreateActionStream(type: string): ActionStream<any> {
    // TODO: should this be compose, so that we can update the saved stream if necessary?
    if (!this._actionStreams.hasOwnProperty(type)) {
      this._actionStreams[type] = this.action$$
        .filter(action$s => action$s.hasOwnProperty(type))
        .map(action$s => {
          const stream = action$s[type];
          if (!(stream instanceof Stream)) {
            return xs.from(stream);
          }
          return stream;
        })
        .flatten();
    }

    return this._actionStreams[type];
  }
}
