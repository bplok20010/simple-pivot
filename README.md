# simplePivot

数据透视

> 不进行数据的汇总计算

## Install

```
npm install --save simplepivot
```

## Usage

```ts
declare function simplePivot(
	data: PData,
	options?: PivotOptions
): {
	columns: string[];
	list: any[][];
};
```

## types

```ts
interface PData {
	columns: Array<string>;
	list: any[][];
	[x: string]: any;
}

interface PivotOptions {
	columns: Array<string>;
	values: string[];
	delimiter?: string;
}
```

## Options

### columns

透视列

```javascript
import { simplePivot, E_VALUE } from "simplepivot";

simplePivot(data, {
    ...
	columns: ["道具名称", E_VALUE, "道具类型"],
});
```

> 注：常量`E_VALUE`的值为`%E_VALUE%`，data.columns 中避免出现`%E_VALUE%`，否则将出现不可预测问题。

### values

透视值

### delimiter

默认: `_` 表头分隔符

## 使用

```

import { simplePivot, E_VALUE } from "simplepivot";

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


```

## 其他

```
/**
 * 数据透视效果
 * ============================================================================================
 * metadata
 *		columns
 *		 		[日期, 游戏, 渠道, 注册数, 付费数]
 *		list
 *			[
 *				//20170809
 * 				['20170809', '游戏A', '小米', 100, 100],
 *				['20170809', '游戏A', '华为', 100, 100],
 *				['20170809', '游戏B', '华为', 100, 100],
 *				//20170808
 *				['20170808', '游戏A', '华为', 100, 100],
 *				['20170808', '游戏B', '小米', 100, 100],
 *				['20170808', '游戏B', '华为', 100, 100],
 *				//20170807
 *				['20170807', '游戏A', '小米', 100, 100],
 *			]
 *		一，透视参数:
 *			行: 日期, 渠道
 *          列: 游戏
 *          值: 注册数, 付费数
 *
 * 		效果
 *			日期      渠道   游戏A_注册数  游戏A_付费数 	游戏B_注册数    游戏B_付费数
 * 			-----------------------------------------------------------------------------------
 *			20170809   小米   100             100
 *			-----------------------------------------------------------------------------------
 *			20170809   华为    100			   100              100	              100
 *			-----------------------------------------------------------------------------------
 *			20170808   华为    100			   100              100	              100
 *			-----------------------------------------------------------------------------------
 *			20170808   小米   			                        100	              100
 *			-----------------------------------------------------------------------------------
 *			20170807   小米   100			   100
 *			-----------------------------------------------------------------------------------
 *
  *		二，透视参数:
 *			行: 日期
 *          列: 游戏, 渠道
 *          值: 注册数, 付费数
 *
 * 		效果
 *			日期      游戏A_小米_注册数  游戏A_小米_付费数  游戏A_华为_注册数  游戏A_华为_付费数  游戏B_小米_注册数  游戏B_小米_付费数  游戏B_华为_注册数  华为B_小米_付费数
 * 			---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *			20170809   100                   100                  100                  100                                                            100                  100
 *			---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *			20170808                                              100                  100                  100                   100                 100                  100
 *			---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *			20170807   100			         100
 *			---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 * ============================================================================================
 *
 */
```
