const simplePivot = require("../index");
const dataset = require("./dataset.json").data;

{
    const pivotData = simplePivot(dataset, {
        columns: ["日期"],
        values: ["数量", "用户数"]
    });

    console.log(pivotData);
}

{
    const pivotData = simplePivot(dataset, {
        columns: ["E_VALUE", "道具类型", "道具名称"],
        values: ["数量", "用户数"]
    });
    console.log(pivotData);
}
