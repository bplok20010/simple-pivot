import simplePivot, { E_VALUE } from "../src";

test("simplePivot-1", () => {
	const dataset = {
		columns: ["性别", "人数"],
		list: [
			["男", 1584],
			["女", 1514],
		],
	};

	expect(
		simplePivot(dataset, {
			columns: ["性别"],
			values: ["人数"],
		})
	).toEqual({ columns: ["男_人数", "女_人数"], list: [[1584, 1514]] });

	expect(
		simplePivot(dataset, {
			columns: [],
			values: ["人数"],
		})
	).toEqual({
		columns: ["性别", "人数"],
		list: [
			["男", 1584],
			["女", 1514],
		],
	});

	expect(
		simplePivot(dataset, {
			columns: [],
			values: [],
		})
	).toEqual({
		columns: ["性别", "人数"],
		list: [
			["男", 1584],
			["女", 1514],
		],
	});
});

test("simplePivot-2", () => {
	const dataset = {
		columns: ["学校", "年级", "男孩", "女孩"],
		list: [
			["学校A", "小班", 15, 20],
			["学校A", "中班", 25, 13],
			["学校A", "大班", 20, 18],
			["学校B", "小班", 16, 21],
			["学校B", "中班", 22, 12],
			["学校B", "大班", 21, 17],
			["学校C", "中班", 26, 25],
			["学校C", "大班", 31, 34],
		],
	};

	expect(
		simplePivot(dataset, {
			columns: ["年级"],
			values: ["男孩", "女孩"],
		})
	).toEqual({
		columns: [
			"学校",
			"小班_男孩",
			"小班_女孩",
			"中班_男孩",
			"中班_女孩",
			"大班_男孩",
			"大班_女孩",
		],
		list: [
			["学校A", 15, 20, 25, 13, 20, 18],
			["学校B", 16, 21, 22, 12, 21, 17],
			["学校C", undefined, undefined, 26, 25, 31, 34],
		],
	});

	expect(
		simplePivot(dataset, {
			columns: ["年级"],
			values: ["女孩", "男孩"],
		})
	).toEqual({
		columns: [
			"学校",
			"小班_女孩",
			"小班_男孩",
			"中班_女孩",
			"中班_男孩",
			"大班_女孩",
			"大班_男孩",
		],
		list: [
			["学校A", 20, 15, 13, 25, 18, 20],
			["学校B", 21, 16, 12, 22, 17, 21],
			["学校C", undefined, undefined, 25, 26, 34, 31],
		],
	});

	expect(
		simplePivot(dataset, {
			columns: [E_VALUE, "年级"],
			values: ["男孩", "女孩"],
		})
	).toEqual({
		columns: [
			"学校",
			"男孩_小班",
			"女孩_小班",
			"男孩_中班",
			"女孩_中班",
			"男孩_大班",
			"女孩_大班",
		],
		list: [
			["学校A", 15, 20, 25, 13, 20, 18],
			["学校B", 16, 21, 22, 12, 21, 17],
			["学校C", undefined, undefined, 26, 25, 31, 34],
		],
	});
});

test("simplePivot-3", () => {
	const dataset = {
		columns: ["学校", "学期", "年级", "男孩", "女孩"],
		list: [
			["学校A", "上学期", "小班", 15, 20],
			["学校A", "上学期", "中班", 25, 13],
			["学校A", "上学期", "大班", 20, 18],
			["学校B", "上学期", "小班", 16, 21],
			["学校B", "上学期", "中班", 22, 12],
			["学校B", "上学期", "大班", 21, 17],
			["学校C", "上学期", "中班", 26, 25],
			["学校C", "上学期", "大班", 31, 34],
			["学校A", "下学期", "小班", 15, 20],
			["学校A", "下学期", "中班", 25, 13],
			["学校A", "下学期", "大班", 20, 18],
			["学校B", "下学期", "小班", 16, 21],
			["学校B", "下学期", "中班", 22, 12],
			["学校B", "下学期", "大班", 21, 17],
			["学校C", "下学期", "中班", 26, 25],
			["学校C", "下学期", "大班", 31, 34],
		],
	};

	expect(
		simplePivot(dataset, {
			columns: ["年级", E_VALUE, "学期"],
			values: ["男孩", "女孩"],
		})
	).toEqual({
		columns: [
			"学校",
			"小班_男孩_上学期",
			"小班_女孩_上学期",
			"中班_男孩_上学期",
			"中班_女孩_上学期",
			"大班_男孩_上学期",
			"大班_女孩_上学期",
			"小班_男孩_下学期",
			"小班_女孩_下学期",
			"中班_男孩_下学期",
			"中班_女孩_下学期",
			"大班_男孩_下学期",
			"大班_女孩_下学期",
		],
		list: [
			["学校A", 15, 20, 25, 13, 20, 18, 15, 20, 25, 13, 20, 18],
			["学校B", 16, 21, 22, 12, 21, 17, 16, 21, 22, 12, 21, 17],
			["学校C", undefined, undefined, 26, 25, 31, 34, undefined, undefined, 26, 25, 31, 34],
		],
	});
});

test("simplePivot-4", () => {
	const dataset = {
		columns: ["地区", "性别", "人数"],
		list: [
			["深圳", "男", 1584],
			["深圳", "女", 1514],
			["广州", "男", 1584],
			["广州", "女", 1514],
		],
	};

	expect(
		simplePivot(dataset, {
			columns: ["地区", "性别"],
			values: [],
		})
	).toEqual({ columns: ["人数"], list: [[1584], [1514]] });

	expect(
		simplePivot(dataset, {
			columns: ["性别"],
			values: [],
		})
	).toEqual({
		columns: ["地区", "人数"],
		list: [
			["深圳", 1584],
			["深圳", 1514],
			["广州", 1584],
			["广州", 1514],
		],
	});

	expect(
		simplePivot(dataset, {
			columns: [],
			values: ["人数"],
		})
	).toEqual({
		columns: ["地区", "性别", "人数"],
		list: [
			["深圳", "男", 1584],
			["深圳", "女", 1514],
			["广州", "男", 1584],
			["广州", "女", 1514],
		],
	});

	expect(
		simplePivot(dataset, {
			columns: ["人数"],
			values: ["人数"],
		})
	).toEqual({
		columns: ["地区", "性别", "1584_人数", "1514_人数"],
		list: [
			["深圳", "男", 1584, undefined],
			["深圳", "女", undefined, 1514],
			["广州", "男", 1584, undefined],
			["广州", "女", undefined, 1514],
		],
	});

	expect(
		simplePivot(dataset, {
			columns: ["性别", "人数"],
			values: ["人数"],
		})
	).toEqual({
		columns: ["地区", "男_1584_人数", "女_1514_人数"],
		list: [
			["深圳", 1584, 1514],
			["广州", 1584, 1514],
		],
	});

	expect(
		simplePivot(dataset, {
			columns: ["性别1", "人数"],
			values: ["人数2"],
		})
	).toEqual({
		columns: ["地区", "性别", "undefined_1584_人数2", "undefined_1514_人数2"],
		list: [
			["深圳", "男", undefined, undefined],
			["深圳", "女", undefined, undefined],
			["广州", "男", undefined, undefined],
			["广州", "女", undefined, undefined],
		],
	});
});
