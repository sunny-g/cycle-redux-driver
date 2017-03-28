// alt for ramda/src/mapObjIndexed
export const mapObj = mapper =>
  obj => Object
    .keys(obj)
    .reduce((newObj, key) => ({
      ...newObj,
      [key]: mapper(obj[key], key, obj),
    }), {});

export const createReducer = (initialState, reducers) =>
  (state = initialState, action) =>
    (reducers.hasOwnProperty(action.type))
      ? reducers[action.type](state, action)
      : state;

export const makeActionCreator = type =>
  (payload, error = false, meta = {}) => ({
    type, payload, error, meta,
  });
