import warning from "warning";
import groupBy from "lodash/groupBy";
import difference from "lodash/difference";
import pick from "lodash/pick";
import zipObject from "lodash/zipObject";

function pickName(data = {}, keys = [], delimiter = "_") {
    return keys.map(key => data[key] + "").join(delimiter);
}

function pickName2(data = {}, keys = [], vKey, delimiter = "_", VALUE_MACRO) {
    return keys
        .map(key => (key === VALUE_MACRO ? vKey : data[key] + ""))
        .join(delimiter);
}

function makeMap(keys = []) {
    const maps = Object.create(null);
    keys.forEach(key => (maps[key] = true));
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
 * @param {array<string>} options.valueMacro - 数据透视表中的数值占位符
 * @param {string} [options.delimiter='_'] - 多级表头分隔符
 */
function simplePivot(data = {}, options = {}) {
    const pOpts = {
        columns: options.columns || [],
        values: options.values || []
    };
    const delimiter = options.delimiter || "_";
    const VALUE_MACRO = options.valueMacro || "E_VALUE";

    if (pOpts.columns.indexOf(VALUE_MACRO) === -1) {
        pOpts.columns = [].concat(pOpts.columns, VALUE_MACRO);
    }

    const columnsWithoutMacro = pOpts.columns.filter(
        column => column !== VALUE_MACRO
    );

    data.columns = data.columns || [];
    data.list = data.list || [];

    if (!pOpts.values.length) {
        //!pOpts.columns.length ||
        warning(false, "options.values cannot be empty!"); //options.columns or
    }

    const undefColumns = difference(
        [].concat(columnsWithoutMacro, pOpts.values),
        data.columns
    );
    if (undefColumns.length) {
        warning(false, "simplePivot unknow columns: " + undefColumns.join(","));
    }

    pOpts.rows = difference(
        data.columns,
        [].concat(columnsWithoutMacro, pOpts.values)
    );

    const dataset = data.list.map(d => zipObject(data.columns, d));

    const groupNames = []; //记录分组顺序
    const groupNameMaps = Object.create(null);
    const groupData = groupBy(dataset, row => {
        const gName = pickName(row, pOpts.rows, delimiter);

        if (!(gName in groupNameMaps)) {
            groupNameMaps[gName] = true;
            groupNames.push(gName);
        }

        return gName;
    });

    const newDataSet = [];
    const newColumns = pOpts.rows.slice();
    const newColumnsMap = makeMap(newColumns);

    for (let i = 0; i < groupNames.length; i++) {
        const gName = groupNames[i];
        const gData = groupData[gName];
        let newData;
        gData.forEach((item, i) => {
            if (!i) {
                newData = pick(item, pOpts.rows);
            }
            pOpts.values.forEach(vKey => {
                const columnName = pickName2(
                    item,
                    pOpts.columns,
                    vKey,
                    delimiter,
                    VALUE_MACRO
                );
                newData[columnName] = item[vKey];

                if (!newColumnsMap[columnName]) {
                    newColumnsMap[columnName] = true;
                    newColumns.push(columnName);
                }
            });
        });

        newDataSet.push(newData);
    }

    const list = newDataSet.map(row => {
        return newColumns.map(column => row[column]);
    });

    return {
        columns: newColumns,
        list
    };
}

export default simplePivot;
