import * as is from "./is.js";

const fnToString = Object.prototype.toString;
const ObjectFunctionString = fnToString.call(Object);

const isPlainObject = function(obj) {
  var proto, Ctor;

  // Detect obvious negatives
  // Use toString instead of jQuery.type to catch host objects
  // if (!obj || toString.call(obj) !== "[object Object]") {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  proto = Object.getPrototypeOf(obj);

  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  if (!proto) {
    return true;
  }

  Ctor = proto.hasOwnProperty("constructor") && proto.constructor;
  return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
}

/**
 * 简单遍历对象
 */
function mapObj(obj, iteratee) {
  let ret = {};

  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      const element = obj[p];
      let callValue = iteratee.call(obj, element, p, obj);

      if (callValue === false) {
        return ret;
      }

      ret[p] = callValue;
    }
  }

  return ret;
}

function extend() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if (typeof target === "boolean") {
    deep = target;

    // Skip the boolean and the target
    target = arguments[i] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  // if (typeof target !== "object" && !isFunction(target)) {
  if (typeof target !== "object" && typeof target != 'function') {
    target = {};
  }

  // Extend jQuery itself if only one argument is passed
  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {

    // Only deal with non-null/undefined values
    if ((options = arguments[i]) != null) {

      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (isPlainObject(copy) ||
          (copyIsArray = is.isArray(copy)))) {

          if (copyIsArray) {
            copyIsArray = false;
            clone = src && is.isArray(src) ? src : [];

          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[name] = extend(deep, clone, copy);

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

export {
  isPlainObject,

  mapObj,
  extend,
};