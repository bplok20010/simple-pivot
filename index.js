/**
 * 数据透视
 * author: nobo.zhou
 * email: nobo.zhou@foxmail.com
 * version: 0.1
 */
 
var utils = require('./utils');

/**
 * 数据透视
 * @author nobo.zhou<nobo.zhou@foxmail.com>
 * @class
 * @param {Object} data - 需要透视数据
 * @param {Array} data.columns - 数据的列
 * @param {Array} data.list - 数据列的值
 * @param {Object} options - 透视参数
 * @param {Array} options.pivotColumn - 透视列
 * @param {Array} options.pivotRow - 透视行
 * @param {Array} options.pivotValue - 透视值
 */ 

function PivotTable(data, options){
	this._metedata = {}; 
	  
}

PivotTable.prototype = {
	constructor: PivotTable,
	
}
