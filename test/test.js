const test = require('ava');
const whatsnext = require("../public/whatsnext.js")

// Time
const { Time } = whatsnext
test('constructor with two arguments', t => {
	const time_point = new Time(2, 30)

	t.true(time_point instanceof Time)
});

test('parse time', t => {
	const time_point = Time.parse("7:45")

	t.pass()
})

// Whatsnext
const { Whatsnext } = whatsnext.Whatsnext
/*
test('bar_2', async t => {
	const bar = Promise.resolve('bar');
	t.is(await bar, 'bar');
});*/