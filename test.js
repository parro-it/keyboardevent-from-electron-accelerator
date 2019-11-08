import fs from 'fs';
import test from 'ava';
import {
	reduceModifier,
	reducePlus,
	reduceKey,
	toKeyEvent,
	UNSUPPORTED
} from '.';

const accelerators = JSON.parse(
	fs.readFileSync('./github-search-results.json', 'utf-8')
);

test('VolumeUp', t => {
	const event = toKeyEvent('VolumeUp');

	t.deepEqual(event, {
		code: 'AudioVolumeUp',
		key: 'volumeup'
	});
});

test('Space', t => {
	const event = toKeyEvent('Space');

	t.deepEqual(event, {
		code: 'Space',
		key: 'space'
	});
});

test('ctrl+shift+v', t => {
	const event = toKeyEvent('ctrl+shift+v');

	t.deepEqual(event, {
		ctrlKey: true,
		shiftKey: true,
		key: 'v',
		code: 'KeyV'
	});
});

test('Command shortcuts are not converted on Windows and Linux', t => {
	const event = toKeyEvent('cmd+v');

	if (process.platform === 'darwin') {
		t.deepEqual(event, {
			metaKey: true,
			key: 'v',
			code: 'KeyV'
		});
	} else {
		t.deepEqual(event, {
			unsupportedKeyForPlatform: true
		});
	}
});

test('Options shortcuts are not converted on Windows and Linux', t => {
	const event = toKeyEvent('option+v');

	if (process.platform === 'darwin') {
		t.deepEqual(event, {
			altKey: true,
			key: 'v',
			code: 'KeyV'
		});
	} else {
		t.deepEqual(event, {
			unsupportedKeyForPlatform: true
		});
	}
});

test('CmdOrCtrl+v', t => {
	const event = toKeyEvent('CmdOrCtrl+v');
	if (process.platform === 'darwin') {
		t.deepEqual(event, {
			metaKey: true,
			key: 'v',
			code: 'KeyV'
		});
	} else {
		t.deepEqual(event, {
			ctrlKey: true,
			key: 'v',
			code: 'KeyV'
		});
	}
});

for (let i = 1; i <= 24; i++) {
	test(`F${i}`, t => {
		const event = toKeyEvent(`Ctrl+F${i}`);
		t.deepEqual(event, {
			ctrlKey: true,
			key: `f${i}`,
			code: `F${i}`
		});
	});
}

test('Control+Alt+Delete', t => {
	const event = toKeyEvent('Control+Alt+Delete');

	t.deepEqual(event, {
		ctrlKey: true,
		altKey: true,
		code: 'Delete',
		key: 'delete'
	});
});

test('handle ctrl', t => {
	const newState = reduceModifier(
		{
			accelerator: 'ctrl+c',
			event: {}
		},
		'ctrl'
	);

	t.deepEqual(newState, {
		accelerator: '+c',
		event: {ctrlKey: true}
	});
});

test('handle alt', t => {
	const newState = reduceModifier(
		{
			accelerator: 'alt+c',
			event: {}
		},
		'alt'
	);

	t.deepEqual(newState, {
		accelerator: '+c',
		event: {altKey: true}
	});
});

test('handle altgr', t => {
	const newState = reduceModifier(
		{
			accelerator: 'altgr+c',
			event: {}
		},
		'altgr'
	);

	t.deepEqual(newState, {
		accelerator: '+c',
		event: {altKey: true}
	});
});

test('handle option', t => {
	const newState = reduceModifier(
		{
			accelerator: 'option+c',
			event: {}
		},
		'option'
	);

	if (process.platform === 'darwin') {
		t.deepEqual(newState, {
			accelerator: '+c',
			event: {altKey: true}
		});
	} else {
		t.is(newState, UNSUPPORTED);
	}
});

test('handle shift', t => {
	const newState = reduceModifier(
		{
			accelerator: 'shift+c',
			event: {}
		},
		'shift'
	);

	t.deepEqual(newState, {
		accelerator: '+c',
		event: {shiftKey: true}
	});
});

test('handle control', t => {
	const newState = reduceModifier(
		{
			accelerator: 'control+c',
			event: {}
		},
		'control'
	);

	t.deepEqual(newState, {
		accelerator: '+c',
		event: {ctrlKey: true}
	});
});

test('handle cmd', t => {
	const newState = reduceModifier(
		{
			accelerator: 'cmd+c',
			event: {}
		},
		'cmd'
	);

	if (process.platform === 'darwin') {
		t.deepEqual(newState, {
			accelerator: '+c',
			event: {metaKey: true}
		});
	} else {
		t.is(newState, UNSUPPORTED);
	}
});

test('handle command', t => {
	const newState = reduceModifier(
		{
			accelerator: 'command+c',
			event: {}
		},
		'command'
	);

	if (process.platform === 'darwin') {
		t.deepEqual(newState, {
			accelerator: '+c',
			event: {metaKey: true}
		});
	} else {
		t.is(newState, UNSUPPORTED);
	}
});

test('Throw for multi-chars keycode that are not valid DOM KeyValues', t => {
	const err = t.throws(() => toKeyEvent('ctrl+cs'));
	t.is(err.message, 'Unvalid keycode `s`.');
});

test('Throw for multiples keycodes', t => {
	const err = t.throws(() => toKeyEvent('Ctrl+VolumeUp+VolumeDown'));
	t.is(err.message, 'Duplicated keycode `volumedown`.');
});

test('throw with double command', t => {
	if (process.platform === 'darwin') {
		const err = t.throws(() =>
			reduceModifier(
				{
					accelerator: 'command+c',
					event: {metaKey: true}
				},
				'command'
			)
		);

		t.is(err.message, 'Double `Command` modifier specified.');
	} else {
		const newState = reduceModifier(
			{
				accelerator: 'command+c',
				event: {metaKey: true}
			},
			'command'
		);
		t.is(newState, UNSUPPORTED);
	}
});

test('throw with double alt', t => {
	const err = t.throws(() =>
		reduceModifier(
			{
				accelerator: 'alt+c',
				event: {altKey: true}
			},
			'alt'
		)
	);

	t.is(err.message, 'Double `Alt` modifier specified.');
});

test('throw with double shift', t => {
	const err = t.throws(() =>
		reduceModifier(
			{
				accelerator: 'shift+c',
				event: {shiftKey: true}
			},
			'shift'
		)
	);

	t.is(err.message, 'Double `Shift` modifier specified.');
});

test('throw with double control', t => {
	const err = t.throws(() =>
		reduceModifier(
			{
				accelerator: 'ctrl+c',
				event: {ctrlKey: true}
			},
			'ctrl'
		)
	);

	t.is(err.message, 'Double `Control` modifier specified.');
});

test('handle plus', t => {
	const event = {};
	const newState = reducePlus(
		{
			accelerator: '+c',
			event
		},
		'control'
	);

	t.deepEqual(newState, {
		accelerator: 'c',
		event
	});
	t.is(event, newState.event);
});

test('handle keyCode', t => {
	const newState = reduceKey(
		{
			accelerator: 'c',
			event: {}
		},
		'c'
	);

	t.deepEqual(newState, {
		accelerator: '',
		event: {
			key: 'c',
			code: 'KeyC'
		}
	});
});

/* Used to generate fixture
const res = {};
let i = 0;
*/

Object.keys(accelerators).forEach(accelerator =>
	test(`Convert ${accelerator}`, t => {
		const ev = toKeyEvent(accelerator);
		/* Used to generate fixture
	res[accelerator] = ev;
	i++;
	if (i === accelerators.length) {
		console.log(JSON.stringify(res, null, '\t').slice(1, -1) + ',');
	}
	*/
		// t.is(typeof ev.code, "string");
		if (
			ev.code &&
			(ev.code.startsWith('Digit') || ev.code.startsWith('Key'))
		) {
			delete ev.code;
		}

		const acc = accelerators[accelerator];
		const expected = hasOSCustomResult(acc) ? acc[process.platform] : acc;
		t.deepEqual(ev, expected);
	})
);

function hasOSCustomResult(expected) {
	return (
		Reflect.has(expected, 'linux') ||
		Reflect.has(expected, 'darwin') ||
		Reflect.has(expected, 'win32')
	);
}
