
function isArray(arr) {
  return arr && (Array.isArray ? Array.isArray(arr) : Object.prototype.toString.call(arr) === '[object Array]');
}

/**
 * 是否为空对象
 * @param {*} o 
 *
 * notice:
 *  isEmptyObject(null) got true
 */
function isEmptyObject(o) {
  let p;
  for (p in o) {
    return false;
  }

  return true;
}

export {
  isArray,
  isEmptyObject
};