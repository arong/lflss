
let emptyArr = [],
  emptyObj = {},
  noop = function() { },
  core_slice = emptyArr.slice,
  toString = emptyObj.toString,
  hasOwn = emptyObj.hasOwnProperty;

/**
* 运行一个函数
* @param {function} fn 函数名
* @param {*} context 函数的this值
*/
function runFn(fn, context, ...args) {
  return typeof fn === 'function' ? fn.call(context, ...args) : fn;
}

/**
* 判断数据类型
* @param {*} input
*/
function type(input) {
  let typeMatch = toString.call(input).match(/^\[object\s*(\w+)\]$/);
  return typeMatch ? typeMatch[1].toLowerCase() : 'null';
}

function isArray(arr) {
  return arr && (Array.isArray ? Array.isArray(arr) : type(arr) === 'array');
}

function isEmptyObject(o) {
  let p;
  for (p in o) {
    return false;
  }

  return true;
}

/**
 * vuex通用mutation, 如果有特殊的可以自己在mutations中写
 */
function setState(state, { key, val } = {}) {
  if (typeof state[key] === 'undefined') {
    // error.throwError(`state中没有key: ${key}`);
    console.warn(`state中没有key: ${key}`);
  }

  let _val = null;
  let store = state[key];

  if (store && val && isArray(store) && isArray(val)) {
    _val = val;
  }

  // 对对象做合并处理
  else if (store &&
    val &&
    typeof store === 'object' &&
    typeof val === 'object') {
    _val = {};

    // _val = _.merge({}, store, val);
    if (isEmptyObject(val)) {
      _val = {};
    } else {
      _val = Object.assign({}, store, val);
    }

  } else {
    _val = val;
  }

  state[key] = _val;
}

export default {
  runFn,
  type,
  isArray,
  isEmptyObject,
  setState
};
