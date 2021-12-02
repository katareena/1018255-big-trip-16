const _ = require('lodash');

const toCamelCase = (obj) => _.transform(obj, (acc, value, key, target) => {
  const camelKey = _.isArray(target) ? key : _.camelCase(key);

  acc[camelKey] = _.isObject(value) ? toCamelCase(value) : value;
});

export default toCamelCase;
