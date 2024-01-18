/**
 * @typedef {Object} ObjectDifference
 * @prop {String} key
 * @prop {*} previous
 * @prop {*} current
 * 
 */
/**
 * 
 * @param {Object} previousObject
 * @param {Object} currentObject
 * @param {Object} fieldDataTypes `getFieldDataTypesObject_`
 * 
 * @returns {Array<ObjectDifference>}
 */
function getFlatObjectsDifferences_(previousObject, currentObject, fieldDataTypes = {}) {
  const typesMap = getCommonDataTypesMap_();

  /** @type Array<ObjectDifference> */
  let result = [];
  let eq;
  let getEq_ = function(curr, pre, key) {
    if (curr === null && pre === "") {
      return true;
    }
    if (pre === null && curr === "") {
      return true;
    }
    let eq = curr == pre;
    const type = fieldDataTypes[key];
    if (!type) return eq;
    const _bigReplacement = function(str) {
      const res = str
        .replace(/\\\\n/g, ' ')
        .replace(/\\n/g, ' ')
        .replace(/\n/g,' ')
        .replace(/''/g, '"')
        .replace(/\n$/g, '')
        .replace(/\\/g, '');
        ;
      return res;
    }

    if (!eq && typesMap.string === type && curr !== null && pre !== null) {
      curr = _bigReplacement(curr);
      pre = _bigReplacement(pre);
      eq = curr == pre
    }
    if ([typesMap.date, typesMap.datetime].indexOf(type) > -1) {
      const format = "YYY-MM-dd hh:mm:ss"
      let formatted1 = formatDate_(new Date(curr), format);
      let formatted2 = formatDate_(new Date(pre), format);
      return formatted1 === formatted2;
    } 
    if (type === typesMap.boolean) {
      if (pre === null) pre = false;
      eq = ("" + pre) === ("" + curr);
    }
    return eq; 
  }

  let current = null, previous = null;
  for (let key in currentObject) {
    current = currentObject[key];
    previous = previousObject[key];
    eq = getEq_(current, previous, key);
    if (!eq) {
      result.push({
        key,
        previous,
        current,
      });
    }
  }
  return result;
}


/**
 * @param {Array<String>} fieldKeys
 * @param {Array<String>} dataTypes `getCommonDataTypesMap_`
 * 
 * @returns {Object}
 */
function getFieldDataTypesObject_(fieldKeys, dataTypes) {
  if (!fieldKeys || !fieldKeys.length || !dataTypes || !dataTypes.length) {
    return {};
  }
  let res = {};
  for (let i = 0; i < fieldKeys.length; i++) {
    res[fieldKeys[i]] = dataTypes[i];
  }
  return res;
}