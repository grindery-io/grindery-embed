import _ from "lodash";

export const flattenObject = (o: any, prefix?: string, result?: any): any => {
  prefix = prefix ? prefix : "";
  result = result ? result : {};

  if (_.isString(o) || _.isNumber(o) || _.isBoolean(o)) {
    result[prefix] = o;
    return result;
  }

  if (_.isArray(o) || _.isPlainObject(o)) {
    for (let i in o) {
      let pref = prefix;
      if (_.isArray(o)) {
        pref = pref + `[${i}]`;
      } else {
        if (_.isEmpty(prefix)) {
          pref = i;
        } else {
          pref = prefix + "." + i;
        }
      }

      flattenObject(o[i], pref, result);
    }
    return result;
  }

  return result;
};
