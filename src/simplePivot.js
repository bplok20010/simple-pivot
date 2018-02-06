const warning = require('warning');
const groupBy = require('nex-utils/groupBy');
const difference = require('nex-utils/difference');
const pick = require('nex-utils/pick');

function pickNmae(data = {}, keys = [], delimiter = '_'){
	return keys.map( key => data[key] + '' ).join(delimiter);
}

function makeMap(keys = []){
	const maps = {};
	keys.forEach( key => maps[key] = true );
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
function simplePivot(data = {}, options = {}) {
	const pOpts = {
		columns: options.columns || [],
		values: options.values || [],
	};
	const delimiter = options.delimiter || '_';
	
	data.columns = data.columns || [];
	data.list = data.list || [];
	
	if( !pOpts.columns.length || !pOpts.values.length ) {
		warning(
			false,
			'options.columns or options.values cannot be empty!'
		);
	}
	
	pOpts.rows = difference(data.columns, [].concat(pOpts.columns, pOpts.values));
	
	const dataset = data.list;
	const groupData = groupBy(dataset, row => {
		return '__' + pickNmae(row, pOpts.rows, delimiter);
	});
	
	const newDataSet = [];
	const newColumns = pOpts.rows.slice();
	const newColumnsMap = makeMap(newColumns);
	
	for(let group in groupData) {
		const gData = groupData[group];
		let newData;
		gData.forEach( (item, i) => {
			if(!i) {
				newData = pick(item, pOpts.rows);		
			}
			pOpts.values.forEach( vKey => {
				const preKey = pickNmae(item, pOpts.columns, delimiter);
				const columnName = preKey + delimiter + vKey;
				newData[columnName] = item[vKey];
				
				if( !newColumnsMap[columnName] ) {
					newColumnsMap[columnName] = true;
					newColumns.push(columnName);	
				}
			} );
		} );
		
		newDataSet.push( newData );
	}
	
	return {
		columns: newColumns,
		list: newDataSet
	}
}

module.exports = simplePivot;
