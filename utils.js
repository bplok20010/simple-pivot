'use strict';

var ArrayProto = Array.prototype;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var nativeKeys = Object.keys;
var enumerables = null;
var nativeForEach = ArrayProto.forEach;
var nativeMap = ArrayProto.map;

// Keys in IE 6-? that won't be iterated by `for key in ...` and thus missed.
function enumerablesTest(){
	for(var i in {toString: 1}){
		return 0;
	}
	return 1;	
}

if (enumerablesTest()) {
	enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
				   'toLocaleString', 'toString', 'constructor'];
}

function toArray(obj) {
    return isArray(obj) ? obj : [obj];
}

function isUndefined(obj) {
    return obj === undefined;
}

function isDefined(obj) {
    return obj !== undefined;
}

function isObject(o) {
    return typeof o === 'object';
}

function throwError(message) {
    if (!message) {
        message = 'a runtime error occured!';
    }
    throw new Error('PivotTable Error: ' + message);
}

/**
 * 数组或对象遍历
 * @param {Object|Array} obj
 * @param {Function} cb
 * @param {*} [context]
 */
function each(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.forEach && obj.forEach === nativeForEach) {
        obj.forEach(cb, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, len = obj.length; i < len; i++) {
            cb.call(context, obj[i], i, obj);
        }
    } else {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                cb.call(context, obj[key], key, obj);
            }
        }
    }
}

/**
 * 数组映射
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
function map(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.map && obj.map === nativeMap) {
        return obj.map(cb, context);
    } else {
        var result = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            result.push(cb.call(context, obj[i], i, obj));
        }
        return result;
    }
}

function assign(target) {
    if (Object.assign) {
        return Object.assign.apply(Object, arguments);
    }

    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
            for (var nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                    output[nextKey] = source[nextKey];
                }
            }
        }
    }
    return output;
};

function has(obj, key) {
	return obj != null && hasOwnProperty.call(obj, key);
};

function keys(obj) {
	if (!isObject(obj)) return [];
	
	if (nativeKeys) return nativeKeys(obj);
	
	var keys = [];
	
	for (var key in obj) if (has(obj, key)) keys.push(key);
	// Ahem, IE < 9.
	if (enumerables) {
		for (var j = enumerables.length; j--;) {
			k = enumerables[j];
			if (obj.hasOwnProperty(k)) {
				keys.push(k);
			}
		}	
	} 
	
	return keys;
};

// An internal function used for aggregate "group by" operations.
var group = function(behavior) {
	return function(obj, iteratee, context) {
		var result = {}, hasContext = context === void 0 ? false : true;
		
		each(obj, function(value, index) {
			var key = iteratee.call(hasContext ? context : value, value, index, obj);
		  
			behavior(result, value, key);
		});
		
		return result;
	};
};

// Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.
var groupBy = group(function(result, value, key) {
	if (has(result, key)) result[key].push(value); else result[key] = [value];
});

function indexOf(array, item){
	var i = 0, length = array && array.length;
	
	for (; i < length; i++) if (array[i] === item) return i;
	
	return -1;	
}

function array2Object(list, values) {
	if (list == null) return {};
	var result = {};
	
	for (var i = 0, length = list.length; i < length; i++) {
		if (values) {
			result[list[i]] = values[i];
		} else {
			result[list[i][0]] = list[i][1];
		}
	}
	
	return result;
}

module.exports = {
	toArray: toArray,
	isUndefined: isUndefined,
	isDefined: isDefined,
	isObject: isObject,
	throwError: throwError,
	each: each,
	map: map,
	assign: assign,
	has: has,
	keys: keys,
	groupBy: groupBy,
	array2Object: array2Object,
};