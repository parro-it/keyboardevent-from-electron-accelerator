import test from 'ava';
import {match, reduceModifier, reducePlus, reduceKeyCode} from '.';

test('exports a function', t => {
	t.is(typeof match, 'function');
});

test('handle ctrl', t => {
	const newState = reduceModifier({
		accelerator: 'ctrl+c',
		event: {}
	}, 'ctrl');

	t.deepEqual(newState, {
		accelerator: '+c',
		event: {ctrlKey: true}
	});
});

test('handle alt', t => {
	const newState = reduceModifier({
		accelerator: 'alt+c',
		event: {}
	}, 'alt');

	t.deepEqual(newState, {
		accelerator: '+c',
		event: {altKey: true}
	});
});

test('handle control', t => {
	const newState = reduceModifier({
		accelerator: 'control+c',
		event: {}
	}, 'control');

	t.deepEqual(newState, {
		accelerator: '+c',
		event: {ctrlKey: true}
	});
});

test('handle cmd', t => {
	const newState = reduceModifier({
		accelerator: 'cmd+c',
		event: {}
	}, 'cmd');

	t.deepEqual(newState, {
		accelerator: '+c',
		event: {metaKey: true}
	});
});

test('handle command', t => {
	const newState = reduceModifier({
		accelerator: 'command+c',
		event: {}
	}, 'command');

	t.deepEqual(newState, {
		accelerator: '+c',
		event: {metaKey: true}
	});
});

test('throw with double command', t => {
	const err = t.throws(() => reduceModifier({
		accelerator: 'command+c',
		event: {metaKey: true}
	}, 'command'));

	t.is(err.message, 'Double `Command` modifier specified.');
});

test('throw with double control', t => {
	const err = t.throws(() => reduceModifier({
		accelerator: 'ctrl+c',
		event: {ctrlKey: true}
	}, 'ctrl'));

	t.is(err.message, 'Double `Control` modifier specified.');
});

test('handle plus', t => {
	const event = {};
	const newState = reducePlus({
		accelerator: '+c',
		event
	}, 'control');

	t.deepEqual(newState, {
		accelerator: 'c',
		event
	});
	t.is(event, newState.event);
});

test('handle keyCode', t => {
	const newState = reduceKeyCode({
		accelerator: 'c',
		event: {}
	}, 'c');

	t.deepEqual(newState, {
		accelerator: '',
		event: {code: 'c'}
	});
});
