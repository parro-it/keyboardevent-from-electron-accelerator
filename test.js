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
		event: {ctrl: true}
	});
});

test('handle control', t => {
	const newState = reduceModifier({
		accelerator: 'control+c',
		event: {}
	}, 'control');

	t.deepEqual(newState, {
		accelerator: '+c',
		event: {ctrl: true}
	});
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
