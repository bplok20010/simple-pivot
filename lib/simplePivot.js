
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _create = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/create"));

var _warning = _interopRequireDefault(require("warning"));

var _groupBy = _interopRequireDefault(require("lodash/groupBy"));

var _difference = _interopRequireDefault(require("lodash/difference"));

var _pick = _interopRequireDefault(require("lodash/pick"));

var _zipObject = _interopRequireDefault(require("lodash/zipObject"));

function pickName() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '_';
  return keys.map(function (key) {
    return data[key] + '';
  }).join(delimiter);
}

function makeMap() {
  var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var maps = (0, _create["default"])(null);
  keys.forEach(function (key) {
    return maps[key] = true;
  });
  return maps;
}
/**
 * 数据透视转换
 * @param {array} data - 数据集
 * @param {array<string>} data.columns - 列头
 * @param {array<array>} data.list - 数据列表
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
    (0, _warning["default"])(false, 'options.columns or options.values cannot be empty!');
  }

  var undefColumns = (0, _difference["default"])([].concat(pOpts.columns, pOpts.values), data.columns);

  if (undefColumns.length) {
    (0, _warning["default"])(false, 'simplePivot unknow columns: ' + undefColumns.join(','));
  }

  pOpts.rows = (0, _difference["default"])(data.columns, [].concat(pOpts.columns, pOpts.values));
  var dataset = data.list.map(function (d) {
    return (0, _zipObject["default"])(data.columns, d);
  });
  var groupNames = []; //记录分组顺序

  var groupNameMaps = (0, _create["default"])(null);
  var groupData = (0, _groupBy["default"])(dataset, function (row) {
    var gName = pickName(row, pOpts.rows, delimiter);

    if (!(gName in groupNameMaps)) {
      groupNameMaps[gName] = true;
      groupNames.push(gName);
    }

    return gName;
  });
  var newDataSet = [];
  var newColumns = pOpts.rows.slice();
  var newColumnsMap = makeMap(newColumns);

  var _loop = function _loop(i) {
    var gName = groupNames[i];
    var gData = groupData[gName];
    var newData = void 0;
    gData.forEach(function (item, i) {
      if (!i) {
        newData = (0, _pick["default"])(item, pOpts.rows);
      }

      pOpts.values.forEach(function (vKey) {
        var preKey = pickName(item, pOpts.columns, delimiter);
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

  for (var i = 0; i < groupNames.length; i++) {
    _loop(i);
  }

  var list = newDataSet.map(function (row) {
    return newColumns.map(function (column) {
      return row[column];
    });
  });
  return {
    columns: newColumns,
    list: list
  };
}

var _default = simplePivot;
exports["default"] = _default;