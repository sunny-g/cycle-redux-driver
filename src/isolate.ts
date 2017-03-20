import map from 'ramda/src/map';
import { Action } from './interfaces';
import MainActionSource from "./MainActionSource";

const ACTION_SCOPE_KEY = '$$CYCLE_ACTION_SCOPE';

export function isolateActionSource(actionSource, scope) {
  if (scope === null) { return actionSource; }

  const newSource = new MainActionSource(actionSource.action$$);
  const originalSelect = newSource.select.bind(newSource);
  newSource.select = (...args) => originalSelect(...args)
    .filter(action => {
      return action.hasOwnProperty('meta') &&
        action.meta.hasOwnProperty(ACTION_SCOPE_KEY) &&
        action.meta[ACTION_SCOPE_KEY] instanceof Set &&
        action.meta[ACTION_SCOPE_KEY].has(scope);
    });

  return newSource;
}

export function isolateActionSink(actionSink, scope) {
  if (scope === null) { return actionSink; }

  return actionSink
    .map(map(action$ => action$.map((action: Action) => {
      let meta = {};

      if (action.meta) {
        meta = { ...action.meta };
      }

      if (!action.meta.hasOwnProperty(ACTION_SCOPE_KEY)) {
        meta[ACTION_SCOPE_KEY] = new Set();
      }

      meta[ACTION_SCOPE_KEY].add(scope);

      return { ...action, meta };
    })));
}
