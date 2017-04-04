import { mapObj } from './util';
import MainActionSource from "./MainActionSource";
import { ACTION_SCOPE_KEY, Action } from './interfaces';

export function isolateActionSource(actionSource, scope) {
  if (scope === null) { return actionSource; }

  const predicate = action =>
    action.hasOwnProperty('meta') &&
    action.meta.hasOwnProperty(ACTION_SCOPE_KEY) &&
    Array.isArray(action.meta[ACTION_SCOPE_KEY]) &&
    action.meta[ACTION_SCOPE_KEY].includes(scope);

  const newSource = new MainActionSource(actionSource.action$$);
  const originalSelect = newSource.select.bind(newSource);
  newSource.select = (...args) => {
    if (args.length === 0) {
      return originalSelect()
        .map(mapObj(action$ => action$.filter(predicate)));
    }

    return originalSelect(...args).filter(predicate);
  };

  return newSource;
}

export function isolateActionSink(actionSink, scope) {
  if (scope === null) { return actionSink; }

  return actionSink
    .map(mapObj(action$ => action$
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
      })
    ));
}
