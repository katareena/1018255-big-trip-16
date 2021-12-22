import {camelCase} from 'lodash';

const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((value) => toCamelCase(value));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: toCamelCase(obj[key]),
      }),
      {},
    );
  }
  return obj;
};

export default toCamelCase;
