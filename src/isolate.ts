import { mapObj } from './util';
import MainActionSource from "./MainActionSource";
import { ACTION_SCOPE_KEY, Action } from './interfaces';

export function inScope({ meta }, scope) {
  if (meta[ACTION_SCOPE_KEY] === undefined) { return false; }

  return Array.isArray(meta[ACTION_SCOPE_KEY])
    && meta[ACTION_SCOPE_KEY].indexOf(scope) !== -1;
}

export function isolateActionSource(actionSource, scope) {
  if (scope === null) { return actionSource; }

  const predicate = action =>
    action.hasOwnProperty('meta') &&
    action.meta.hasOwnProperty(ACTION_SCOPE_KEY) &&
    Array.isArray(action.meta[ACTION_SCOPE_KEY]) &&
    action.meta[ACTION_SCOPE_KEY].includes(scope);
  const filterer = mapObj(action$ => action$.filter(predicate));

  return new MainActionSource(actionSource.action$$.map(filterer));
}

export function isolateActionSink(actionSink, scope) {
  if (scope === null) { return actionSink; }

  const addScopeToActions = mapObj(action$ => action$
    .map((action: Action<any>) => {
      let meta = {};

      if (action.meta) {
        meta = { ...action.meta };
      }

      if (!action.meta.hasOwnProperty(ACTION_SCOPE_KEY) || !Array.isArray(action.meta[ACTION_SCOPE_KEY])) {
        meta[ACTION_SCOPE_KEY] = [];
      }

      meta[ACTION_SCOPE_KEY].push(scope);

      return { ...action, meta };
    }))

  return actionSink.map(addScopeToActions);
}
