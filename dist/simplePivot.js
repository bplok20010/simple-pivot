(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.simplePivot = factory());
}(this, (function () { 'use strict';

/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var __DEV__ = "production" !== 'production';

var warning = function warning() {};

if (__DEV__) {
  warning = function warning(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.length < 10 || /^[s\W]*$/.test(format)) {
      throw new Error('The warning format should be able to uniquely identify this ' + 'warning. Please, use a more descriptive format than: ' + format);
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    }
  };
}

var warning_1 = warning;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__') {
    Object.defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * isLength(3)
 * // => true
 *
 * isLength(Number.MIN_VALUE)
 * // => false
 *
 * isLength(Infinity)
 * // => false
 *
 * isLength('3')
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * isArrayLike([1, 2, 3])
 * // => true
 *
 * isArrayLike(document.body.children)
 * // => true
 *
 * isArrayLike('abc')
 * // => true
 *
 * isArrayLike(Function)
 * // => false
 */
function isArrayLike(value) {
  return value != null && typeof value != 'function' && isLength_1(value.length);
}

var isArrayLike_1 = isArrayLike;

var hasOwn = Object.prototype.hasOwnProperty;

function has(obj, key) {
	return obj != null && hasOwn.call(obj, key);
}

var has_1 = has;

var nativeKeys = Object.keys;

function keys(obj) {
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) {
        if (has_1(obj, key)) keys.push(key);
    }return keys;
}

var keys_1 = keys;

function createReduce(dir) {
	// Wrap code that reassigns argument variables in a separate function than
	// the one that accesses `arguments.length` to avoid a perf hit. (#1991)
	var reducer = function reducer(obj, iteratee, memo, initial) {
		var keys = !isArrayLike_1(obj) && keys_1(obj),
		    length = (keys || obj).length,
		    index = dir > 0 ? 0 : length - 1;
		if (!initial) {
			memo = obj[keys ? keys[index] : index];
			index += dir;
		}
		for (; index >= 0 && index < length; index += dir) {
			var currentKey = keys ? keys[index] : index;
			memo = iteratee(memo, obj[currentKey], currentKey, obj);
		}
		return memo;
	};

	return function (obj, iteratee, memo) {
		var initial = arguments.length >= 3;
		return reducer(obj, iteratee, memo, initial);
	};
}

var _createReduce = createReduce;

var reduce = _createReduce(1);

var hasOwnProperty = Object.prototype.hasOwnProperty;

function groupBy(collection, iteratee) {
	return reduce(collection, function (result, value, key) {
		key = iteratee(value);
		if (hasOwnProperty.call(result, key)) {
			result[key].push(value);
		} else {
			_baseAssignValue(result, key, [value]);
		}
		return result;
	}, {});
}

var groupBy_1 = groupBy;

var toString = Object.prototype.toString;

var toString_1 = toString;

var isString = function isString(obj) {
	return toString_1.call(obj) === '[object String]';
};

function values(obj) {
	return obj == null ? [] : keys_1(obj).map(function (key) {
		return obj[key];
	});
}

var values_1 = values;

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement, fromIndex) {
		var k;

		if (this == null) {
			throw new TypeError('"this" is null or not defined');
		}

		var O = Object(this);

		var len = O.length >>> 0;

		if (len === 0) {
			return -1;
		}

		var n = +fromIndex || 0;

		if (Math.abs(n) === Infinity) {
			n = 0;
		}

		if (n >= len) {
			return -1;
		}

		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

		while (k < len) {
			if (k in O && O[k] === searchElement) {
				return k;
			}
			k++;
		}
		return -1;
	};
}

function indexOf(array, value) {
	var fromIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	return array.indexOf(value, fromIndex);
}

var indexOf_1 = indexOf;

var nativeMax = Math.max;

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */
function includes(collection, value) /*, guard*/{
  var fromIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  collection = isArrayLike_1(collection) ? collection : values_1(collection);

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }
  return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && indexOf_1(collection, value, fromIndex) > -1;
}

var includes_1 = includes;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
};

var isArguments = function isArguments(obj) {
	return (typeof obj === 'undefined' ? 'undefined' : _typeof$1(obj)) == 'object' && obj !== null && toString_1.call(obj) === '[object Arguments]';
};

function _toConsumableArray(arr) {
	if (Array.isArray(arr)) {
		for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
			arr2[i] = arr[i];
		}return arr2;
	} else {
		return Array.from(arr);
	}
}

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
	return Array.isArray(value) || isArguments(value);
}

/**
 * The base implementation of `flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
	predicate || (predicate = isFlattenable);
	result || (result = []);

	if (array == null) {
		return result;
	}

	for (var i = 0, length = array.length; i < length; i++) {
		var value = array[i];
		if (depth > 0 && predicate(value)) {
			if (depth > 1) {
				// Recursively flatten arrays (susceptible to call stack limits).
				baseFlatten(value, depth - 1, predicate, isStrict, result);
			} else {
				var _result;

				(_result = result).push.apply(_result, _toConsumableArray(value));
			}
		} else if (!isStrict) {
			result[result.length] = value;
		}
	}
	return result;
}

var _flatten = baseFlatten;

function each(collection, iteratee) {
	var length = void 0,
	    i = void 0;

	if (isArrayLike_1(collection)) {
		length = collection.length;
		for (i = 0; i < length; i++) {
			if (iteratee(collection[i], i, collection) === false) {
				break;
			}
		}
	} else {
		var keys = keys_1(collection);

		for (i = 0, length = keys.length; i < length; i++) {
			if (iteratee(collection[keys[i]], keys[i], collection) === false) {
				break;
			}
		}
	}

	return collection;
}

var each_1 = each;

function filter(collection, predicate) {
	var results = [];
	var resIndex = 0;

	each_1(collection, function (value, index, collect) {
		if (predicate(value, index, collect)) results[resIndex++] = value;
	});

	return results;
}

var filter_1 = filter;

function difference(array) {
	for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		values[_key - 1] = arguments[_key];
	}

	values = _flatten(values, 1);
	return filter_1(array, function (value) {
		return !includes_1(values, value);
	});
}

var difference_1 = difference;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Recursively flattens `array`.
 *
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @see flatMap, flatMapDeep, flatMapDepth, flatten, flattenDepth
 * @example
 *
 * flattenDeep([1, [2, [3, [4]], 5]])
 * // => [1, 2, 3, 4, 5]
 */
function flattenDeep(array) {
  var length = array == null ? 0 : array.length;
  return length ? _flatten(array, INFINITY) : [];
}

var flattenDeep_1 = flattenDeep;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * const object = { 'a': 1 }
 * const other = { 'a': 1 }
 *
 * eq(object, object)
 * // => true
 *
 * eq(object, other)
 * // => false
 *
 * eq('a', 'a')
 * // => true
 *
 * eq('a', Object('a'))
 * // => false
 *
 * eq(NaN, NaN)
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

var eq_1 = eq;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$1.call(object, key) && eq_1(objValue, value)) || value === undefined && !(key in object)) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/**
 * The base implementation of `pickBy`.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
	var index = -1;
	var length = paths.length;
	var result = {};

	while (++index < length) {
		var path = paths[index];
		var value = object[path];
		if (predicate(value, path)) {
			_assignValue(result, path, value);
		}
	}
	return result;
}

var _basePickBy = basePickBy;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 * @see has, hasPath, hasPathIn
 * @example
 *
 * const object = create({ 'a': create({ 'b': 2 }) })
 *
 * hasIn(object, 'a')
 * // => true
 *
 * hasIn(object, 'b')
 * // => false
 */
function hasIn(object, key) {
  return object != null && key in Object(object);
}

var hasIn_1 = hasIn;

function pick(object) {
	for (var _len = arguments.length, paths = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		paths[_key - 1] = arguments[_key];
	}

	return object == null ? {} : _basePickBy(object, flattenDeep_1(paths), function (value, key) {
		return hasIn_1(object, key);
	});
}

var pick_1 = pick;

function pickNmae() {
	var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '_';

	return keys.map(function (key) {
		return data[key] + '';
	}).join(delimiter);
}

function makeMap() {
	var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	var maps = {};
	keys.forEach(function (key) {
		return maps[key] = true;
	});
	return maps;
}

/**
 * 数据透视转换
 * @param {array} data - 数据集
 * @param {array<string>} data.columns - 列头
 * @param {array<object>} data.list - 数据列表
 * @param {object} options - 配置参数
 * @param {array<string>} options.rows - 数据透视行配置，此参数在simplePivot里无效
 * @param {array<string>} options.columns - 数据透视列配置
 * @param {array<string>} options.values - 数据透视值配置
 * @param {string} [options.delimiter='_'] - 多级表头分隔符  
 */
function simplePivot() {
	var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var pOpts = {
		columns: options.columns || [],
		values: options.values || []
	};
	var delimiter = options.delimiter || '_';

	data.columns = data.columns || [];
	data.list = data.list || [];

	if (!pOpts.columns.length || !pOpts.values.length) {
		warning_1(false, 'options.columns or options.values cannot be empty!');
	}

	pOpts.rows = difference_1(data.columns, [].concat(pOpts.columns, pOpts.values));

	var dataset = data.list;
	var groupData = groupBy_1(dataset, function (row) {
		return '__' + pickNmae(row, pOpts.rows, delimiter);
	});

	var newDataSet = [];
	var newColumns = pOpts.rows.slice();
	var newColumnsMap = makeMap(newColumns);

	var _loop = function _loop(group) {
		var gData = groupData[group];
		var newData = void 0;
		gData.forEach(function (item, i) {
			if (!i) {
				newData = pick_1(item, pOpts.rows);
			}
			pOpts.values.forEach(function (vKey) {
				var preKey = pickNmae(item, pOpts.columns, delimiter);
				var columnName = preKey + delimiter + vKey;
				newData[columnName] = item[vKey];

				if (!newColumnsMap[columnName]) {
					newColumnsMap[columnName] = true;
					newColumns.push(columnName);
				}
			});
		});

		newDataSet.push(newData);
	};

	for (var group in groupData) {
		_loop(group);
	}

	return {
		columns: newColumns,
		list: newDataSet
	};
}

var simplePivot_1 = simplePivot;

return simplePivot_1;

})));
//# sourceMappingURL=simplePivot.js.map
