
const modifiers = /^(Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super)/i;
const keyCodes = /^(Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen|[0-9A-Z)!@#$%^&*(:+<_>?~{|}";=,\-./`[\\\]']|F1*[1-9]|F10|F2[0-4])/i;

export function reduceModifier({accelerator, event}, modifier) {
	switch (modifier) {
		case 'command':
		case 'cmd': {
			if (event.metaKey) {
				throw new Error('Double `Command` modifier specified.');
			}

			return {
				event: Object.assign({}, event, {metaKey: true}),
				accelerator: accelerator.slice(modifier.length)
			};
		}
		case 'control':
		case 'ctrl': {
			if (event.ctrlKey) {
				throw new Error('Double `Control` modifier specified.');
			}

			return {
				event: Object.assign({}, event, {ctrlKey: true}),
				accelerator: accelerator.slice(modifier.length)
			};
		}
		case 'commandorcontrol': {
			break;
		}
		case 'cmdorctrl': {
			break;
		}
		case 'option':
		case 'altgr':
		case 'alt': {
			if (event.altKey) {
				throw new Error('Double `Alt` modifier specified.');
			}

			return {
				event: Object.assign({}, event, {altKey: true}),
				accelerator: accelerator.slice(modifier.length)
			};
		}
		case 'shift': {
			if (event.shiftKey) {
				throw new Error('Double `Shift` modifier specified.');
			}

			return {
				event: Object.assign({}, event, {shiftKey: true}),
				accelerator: accelerator.slice(modifier.length)
			};
		}
		case 'super': {
			break;
		}
		default:
	}
}

export function reducePlus({accelerator, event}) {
	return {
		event,
		accelerator: accelerator.trim().slice(1)
	};
}

export function reduceCode({accelerator, event}, code) {
	return {
		event: Object.assign({}, event, {code}),
		accelerator: accelerator.trim().slice(code.length)
	};
}

const domKeys = Object.assign(Object.create(null), {
	delete: 'Delete'
});

export function reduceKey({accelerator, event}, key) {
	return {
		event: Object.assign({}, event, {key}),
		accelerator: accelerator.trim().slice(key.length)
	};
}

/**
 * This function transform an Electron Accelerator string into
 * a DOM KeyboardEvent object.
 *
 * @param  {string} accelerator an Electron Accelerator string, e.g. `Ctrl+C` or `Shift+Space`.
 * @return {object} a DOM KeyboardEvent object derivate from the `accelerator` argument.
 */
export function toKeyEvent(accelerator) {
	let state = {accelerator, event: {}};
	while (state.accelerator !== '') {
		const modifierMatch = state.accelerator.match(modifiers);
		if (modifierMatch) {
			const modifier = modifierMatch[0].toLowerCase();
			state = reduceModifier(state, modifier);
		} else if (state.accelerator.trim()[0] === '+') {
			state = reducePlus(state);
		} else {
			const keyCodeMatch = state.accelerator.match(keyCodes);
			if (keyCodeMatch) {
				const keyCode = keyCodeMatch[0].toLowerCase();
				if (keyCode in domKeys) {
					state = reduceKey(state, domKeys[keyCode]);
				} else {
					state = reduceCode(state, keyCode);
				}
			} else {
				throw new Error(`Unvalid accelerator: "${state.accelerator}"`);
			}
		}
	}
	return state.event;
}

export function match(accelerator, keyEvent) {
	if (toKeyEvent(accelerator).code === keyEvent.code) {
		return true;
	}
	return false;
}
