'use strict';
const assert = require('assert');
const utils = require('../utils');

//test groupBy
const groupByData = [
	['2017-08-09', '游戏A', '小米', 100, 100],
	['2017-08-09', '游戏A', '华为', 100, 100],
	['2017-08-09', '游戏A', 'vivo', 100, 100],
	['2017-08-09', '游戏B', '华为', 100, 100],
	['2017-08-09', '游戏B', 'vivo', 100, 100],
	['2017-08-09', '游戏C', '小米', 100, 100],
	
	['2017-08-08', '游戏A', '华为', 100, 100],
	['2017-08-08', '游戏A', 'vivo', 100, 100],
	['2017-08-08', '游戏B', '小米', 100, 100],
	['2017-08-08', '游戏B', '华为', 100, 100],
	['2017-08-08', '游戏B', 'oppo', 100, 100],
	['2017-08-08', '游戏C', '小米', 100, 100],
	
	['2017-08-07', '游戏A', '小米', 100, 100],
	['2017-08-07', '游戏A', '华为', 100, 100],
	['2017-08-07', '游戏B', '小米', 100, 100],
	['2017-08-07', '游戏B', '华为', 100, 100],
	['2017-08-07', '游戏C', '小米', 100, 100],
	['2017-08-07', '游戏C', '华为', 100, 100],
	['2017-08-07', '游戏C', 'oppo', 100, 100],
];

const G_result1 = utils.groupBy(groupByData, function(data){
	return '__group__:' + data[0] + '_' + data[1];	
});

assert.equal( utils.keys(G_result1).length, 9, '分组不正确1' );

const G_result2 = utils.groupBy(groupByData, function(data){
	return '__group__:' + data[0] + '_' + data[1] + '_' + data[2];	
});

assert.equal( utils.keys(G_result2).length, groupByData.length, '分组不正确2' );