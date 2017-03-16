import { FSA } from 'flux-standard-action';
import { Stream, MemoryStream } from 'xstream';

export interface ActionMeta {
  scope?: string;
  [key: string]: any;
}

export type Action = FSA<any, ActionMeta>;

export type ActionStream = Stream<Action>;

export type ActionMemoryStream = MemoryStream<Action>;

export interface ActionSinkCollection {
  [type: string]: ActionStream | any;
}

export type ActionSinkStream = Stream<ActionSinkCollection>;

export interface ActionSource {
  select(
    type?: string,
    _transform?: (action$s: ActionSinkCollection) => ActionStream,
  ): ActionMemoryStream | any;
}

export interface StateSource {
  select(): MemoryStream<any> | any;
}

export interface ReduxSource {
  actions: ActionSource;
  state: StateSource;
}
