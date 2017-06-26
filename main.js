
const modifiers = /^(Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super)/i;
const keyCodes = /^([0-9A-Z)!@#$%^&*(:+<_>?~{|}";=,\-./`[\\\]']|F1*[1-9]|F10|F2[0-4]|Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen)/i;

export function reduceModifier({accelerator, event}, modifier) {
	switch (modifier) {
		case 'command':
		case 'cmd': {
			return {
				event: Object.assign({}, event, {meta: true}),
				accelerator: accelerator.slice(modifier.length)
			};
		}
		case 'control':
		case 'ctrl': {
			return {
				event: Object.assign({}, event, {ctrl: true}),
				accelerator: accelerator.slice(modifier.length)
			};
		}
		case 'commandorcontrol': {
			break;
		}
		case 'cmdorctrl': {
			break;
		}
		case 'alt': {
			break;
		}
		case 'option': {
			break;
		}
		case 'altgr': {
			break;
		}
		case 'shift': {
			break;
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

export function reduceKeyCode({accelerator, event}, code) {
	return {
		event: Object.assign({}, event, {code}),
		accelerator: accelerator.trim().slice(code.length)
	};
}

export function toKeyEvent(accelerator) {
	let state = {accelerator, event: {}};
	while (state.accelerator !== '') {
		const modifierMatch = modifiers.match(accelerator);
		if (modifierMatch) {
			const modifier = modifierMatch[0].toLowerCase();
			state = reduceModifier(state, modifier);
		}

		if (state.accelerator.trim()[0] === '+') {
			state = reducePlus(state);
		}

		const keyCodeMatch = keyCodes.match(accelerator);
		if (keyCodeMatch) {
			const keyCode = keyCodeMatch[0].toLowerCase();
			state = reduceKeyCode(keyCode);
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
