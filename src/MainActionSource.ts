import { adapt } from '@cycle/run/lib/adapt';
import { Store } from 'redux';
import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
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

  public select(type, transform) {
    let action$: ActionStream;

    if (type === undefined) {
      action$ = this.getOrCreateActionStream(
        '*',
        (action$s: ActionSinkCollection) => {
          const actionStreams: Array<ActionStream> = Object
            .keys(action$s)
            .map(actionType => action$s[actionType]);
          return xs.merge(...actionStreams);
        },
      );
    } else {
      action$ = this.getOrCreateActionStream(type, transform);
    }

    return adapt(action$);
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

  private getOrCreateActionStream(
    type: string,
    transform?: (action$s: ActionSinkCollection) => ActionStream,
  ): ActionStream {
    // TODO: should this be compose, so that we can update the saved stream if necessary?
    if (!this._actionStreams.hasOwnProperty(type)) {
      this._actionStreams[type] = this.action$$
        .map((typeof transform === 'function') ?
          transform :
          action$s => action$s[type]
        )
        .flatten();
    }

    return this._actionStreams[type];
  }
}
