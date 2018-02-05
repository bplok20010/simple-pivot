const simplePivot = require('../lib/simplePivot');

const dataset = {
	columns: ['性别', '人数'],
	list: [
		{"性别": "男", "人数": 1584},
		{"性别": "女", "人数": 1514},
	]	
};

//dataset.columns = _.difference( dataset.columns, ['道具id'] );

//dataset.list = dataset.list.map( d => _.omit( d, ['道具id'] ) );

const pivotData = simplePivot( dataset, {
	//columns: ['道具类型', '道具名称'],
	columns: ['性别'],
	values: ['人数']	
} );

console.log( pivotData );



