var warning = require('warning');
var groupBy = require('nex-utils/groupBy');
var difference = require('nex-utils/difference');
var pick = require('nex-utils/pick');

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
		warning(false, 'options.columns or options.values cannot be empty!');
	}

	pOpts.rows = difference(data.columns, [].concat(pOpts.columns, pOpts.values));

	var dataset = data.list;
	var groupData = groupBy(dataset, function (row) {
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
				newData = pick(item, pOpts.rows);
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

module.exports = simplePivot;

//export default simplePivot;
//use in umd
//export {simplePivot};