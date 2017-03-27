// alt for ramda/src/mapObjIndexed
export const mapObj = mapper =>
  obj =>
    Object
      .keys(obj)
      .reduce((newObj, key) => ({
        ...newObj,
        [key]: mapper(obj[key], key, obj),
      }), {});

