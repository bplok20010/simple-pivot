const simplePivot = require('../index');

const dataset = {
    columns: ['性别', '人数'],
    list: [
        ['男', '1584'],
        ['女', '1514'],
    ]
};

const pivotData = simplePivot(dataset, {
    columns: ['性别'],
    values: ['人数']
});

console.log(pivotData);

const dataset1 = {
    columns: ['日期', '类型', '数值'],
    list: [
        ['20170809', 'A', 1],
        ['20170809', 'B', 2],
        ['20170808', 'A', 3],
        ['20170808', 'B', 4],
        ['20170808', 'C', 5],
        ['20170807', 'A', 6],
        ['20170807', 'B', 7],
    ]
};

console.log('====================')

const pivotData1 = simplePivot(dataset1, {
    columns: ['类型'],
    values: ['数值']
});

console.log(pivotData1);



