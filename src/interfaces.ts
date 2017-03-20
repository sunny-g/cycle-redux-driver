import { FSA } from 'flux-standard-action';
import { Stream, MemoryStream } from 'xstream';

export type StateStream = MemoryStream<any>;

export interface ActionMeta {
  $$CYCLE_ACTION_SCOPE: Set<string>;
  [key: string]: any;
}

export type Action = FSA<any, ActionMeta>;

export type ActionStream = Stream<Action>;

export interface ActionSinkCollection {
  [type: string]: ActionStream | any;
}

export type ActionSink = Stream<ActionSinkCollection>;

export interface ActionSource {
  select(
    type?: string,
    transform?: (action$s: ActionSinkCollection) => ActionStream,
  ): ActionStream | any;
  isolateSource(source: ActionSource, scope: string | null): ActionSource;
  isolateSink(sink: ActionSink, scope: string | null): ActionSink;
}

export interface StateSource {
  select(): StateStream | any;
}

export interface ReduxSource {
  actions: ActionSource;
  state: StateSource;
}
