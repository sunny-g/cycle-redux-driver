import { mapObj } from './util';
import MainActionSource from "./MainActionSource";
import { Action } from './interfaces';

const ACTION_SCOPE_KEY = '$$CYCLE_ACTION_SCOPE';

export function isolateActionSource(actionSource, scope) {
  if (scope === null) { return actionSource; }

  const newSource = new MainActionSource(actionSource.action$$);
  const originalSelect = newSource.select.bind(newSource);
  newSource.select = (...args) => originalSelect(...args)
    .filter(action =>
      action.hasOwnProperty('meta') &&
      action.meta.hasOwnProperty(ACTION_SCOPE_KEY) &&
      Array.isArray(action.meta[ACTION_SCOPE_KEY]) &&
      action.meta[ACTION_SCOPE_KEY].includes(scope)
    );

  return newSource;
}

export function isolateActionSink(actionSink, scope) {
  if (scope === null) { return actionSink; }

  return actionSink
    .map(mapObj(action$ => action$
      .map((action: Action) => {
        let meta = {};

        if (action.meta) {
          meta = { ...action.meta };
        }

        if (!action.meta.hasOwnProperty(ACTION_SCOPE_KEY) || !Array.isArray(action.meta[ACTION_SCOPE_KEY])) {
          meta[ACTION_SCOPE_KEY] = [];
        }

        meta[ACTION_SCOPE_KEY].push(scope);

        return { ...action, meta };
      })
    ));
}
