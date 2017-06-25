import test from 'ava';
import keyboardeventMatchElectronAccelerator from '.';

test('exports a function', t => {
	t.is(typeof keyboardeventMatchElectronAccelerator, 'function');
});
