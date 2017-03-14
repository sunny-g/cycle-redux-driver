import { FSA } from 'flux-standard-action';
import { Stream, MemoryStream } from 'xstream';

export interface ActionMeta {
  scope: string;
  [key: string]: any;
}

export type Action = FSA<any, ActionMeta>;

export type ActionStream = Stream<Action>;

export type ActionMemoryStream = MemoryStream<Action>;

export type ActionSinkStream = Stream<{ [type: string]: ActionStream }>;

export interface ActionSource {
  select(type: string): ActionMemoryStream | any;
  // isolateSource(source: ReduxActionSource, scope: string): ReduxActionSource;
  // isolateSink(sink: Stream<RequestInput>, scope: string): Stream<RequestInput>;
}

export interface StateSource {
  getState$(): MemoryStream<any> | any;
}

export interface ReduxSource {
  actions: ActionSource;
  state: StateSource;
}
