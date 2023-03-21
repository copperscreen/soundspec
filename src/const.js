import {range, clone} from './func';
export const soundTypes = ['tone','noise','both'];
export const instrumentCount = 6;
export const octavesUp = 5;
export const octavesDown = 2;
export const voice_defaults = {'transpose':0, 'sustain':false, 'noise': false};
export const instrument_defaults = { voices:[voice_defaults], 'pwm': false/*'delayFun': 'max', 'absDelay':0, 'relDelay':0*/};
export const noteList = ['C','C#','D', 'D#', 'E', 'F','F#', 'G', 'G#', 'A', 'A#', 'B'];
export const headerTitle = 'Click to fold';
export const defaultSettings = 	{
					'settings' : { 
						'master' : 1.7734470, 
						'lfsrWidth': 16, 
						'lfsrPoly': '0x801C',
						'mixer': 5,
						'framerate': 50,
						'split': 'No split',
						'swap': false
					},
					'clocks':[32,1],
					'oscillatorcfgs': range(2).map(_ => clone(
						{'width':12, 'depth':3, 'useclocks':[0,1], 'soundtype':soundTypes[0], 'pwm': false })).concat(
						{'width':12, 'depth':3, 'useclocks':[1],   'soundtype':soundTypes[0], 'pwm':true }).concat(
						{'width':12, 'depth':3, 'useclocks':[1],   'soundtype':soundTypes[2], 'pwm': false }
					)
				};
	