import { adapt } from '@cycle/run/lib/adapt';
import { Store } from 'redux';
import { Stream, fromObservable } from 'xstream';
import { isolateActionSource, isolateActionSink } from './isolate';
import {
  ActionSinkCollection,
  ActionSink,
  ActionSource,
  ActionStream,
} from './interfaces';

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

  public isolateSource = isolateActionSource;
  public isolateSink = isolateActionSink;

  private dispatchActionsToStore(actionsForStore: string[], store: Store<any>): void {
    actionsForStore.forEach(type => {
      this
        .getOrCreateActionStream(type)
        .debug(action => store.dispatch(action))
        .addListener({ next() {}, error() {}, complete() {} });
    });
  }

  private getOrCreateActionStream(type: string): ActionStream<any> {
    // TODO: should this be compose, so that we can update the saved stream if necessary?
    if (!this._actionStreams.hasOwnProperty(type)) {
      this._actionStreams[type] = this.action$$
        .map(action$s => {
          let stream = action$s[type];
          if (!(stream instanceof Stream)) {
            stream = fromObservable(stream);
          }
          return stream;
        })
        .flatten();
    }

    return this._actionStreams[type];
  }
}
