import warning from "warning";
import groupBy from "lodash/groupBy";
import difference from "lodash/difference";
import pick from "lodash/pick";
import zipObject from "lodash/zipObject";

export const E_VALUE = "E_VALUE";

function pickName<T extends {}, E extends keyof T>(data: T, keys: E[], delimiter = "_") {
	return keys.map(key => data[key] + "").join(delimiter);
}

function pickName2<T extends {}, E extends keyof T>(
	data: T,
	keys: E[],
	vKey: string,
	delimiter: string = "_"
) {
	return keys.map(key => (key === E_VALUE ? vKey : data[key] + "")).join(delimiter);
}

function makeMap(keys: string[] = []): { [x: string]: boolean } {
	const maps = Object.create(null);
	keys.forEach(key => (maps[key] = true));
	return maps;
}

export interface PData {
	columns: Array<string>;
	list: any[][];
	[x: string]: any;
}

export interface PivotOptions {
	columns: Array<string>;
	values: string[];
	delimiter?: string;
}

simplePivot.E_VALUE = E_VALUE;

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
export function simplePivot(
	data: PData = {
		columns: [],
		list: [],
	},
	options: PivotOptions = {
		columns: [],
		values: [],
	}
) {
	const pOpts: PivotOptions & {
		rows: string[];
	} = {
		columns: options.columns || [],
		values: options.values || [],
		rows: [],
	};
	const delimiter = options.delimiter || "_";

	if (pOpts.columns.indexOf(E_VALUE) === -1) {
		pOpts.columns = pOpts.columns.concat(E_VALUE);
	}

	pOpts.values = pOpts.values.filter(column => column !== E_VALUE);

	const columnsWithoutMacro = pOpts.columns.filter(column => column !== E_VALUE);

	data.columns = data.columns || [];
	data.list = data.list || [];

	if (!pOpts.values.length) {
		//!pOpts.columns.length ||
		warning(false, "options.values cannot be empty!"); //options.columns or
	}

	const undefColumns = difference(columnsWithoutMacro.concat(pOpts.values), data.columns);
	if (undefColumns.length) {
		warning(false, "simplePivot unknown columns: " + undefColumns.join(","));
	}

	pOpts.rows = difference(data.columns, columnsWithoutMacro.concat(pOpts.values));

	const dataset = data.list.map(d => zipObject(data.columns, d));

	const groupNames: string[] = []; //记录分组顺序
	const groupNameMaps: {
		[x: string]: boolean;
	} = Object.create(null);
	const groupData: {
		[x: string]: { [x: string]: any }[];
	} = groupBy(dataset, row => {
		const gName = pickName(row, pOpts.rows, delimiter);

		if (!(gName in groupNameMaps)) {
			groupNameMaps[gName] = true;
			groupNames.push(gName);
		}

		return gName;
	});

	const newDataSet: { [x: string]: any }[] = [];
	const newColumns = pOpts.rows.slice();
	const newColumnsMap = makeMap(newColumns);

	for (let i = 0; i < groupNames.length; i++) {
		const gName = groupNames[i];
		const gData = groupData[gName];
		let newData: { [x: string]: any } = {};
		gData.forEach((item, i) => {
			if (!i) {
				newData = pick(item, pOpts.rows);
			}
			pOpts.values.forEach(vKey => {
				const columnName = pickName2(item, pOpts.columns, vKey, delimiter);
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
		list,
	};
}

export default simplePivot;
