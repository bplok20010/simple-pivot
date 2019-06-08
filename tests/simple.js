const simplePivot = require('../index');
// const zipObject = require('nex-utils/zipObject');
const dataset = require('./dataset.json').data;

// dataset.list = dataset.list.map(d => zipObject(dataset.columns, d));

const pivotData = simplePivot(dataset, {
    //columns: ['道具类型', '道具名称'],
    columns: ['日期'],
    values: ['数量', '用户数']
});

console.log(pivotData);



