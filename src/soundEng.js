import { oscillator } from './oscillator';
import { range, clone, log, lerp } from './func';
import { instrumentCount, instrument_defaults } from './const';
import { voice } from './voice';
import { noise } from './noise';
import { pwm } from './pwm';

var keyTouch = function (note, instr) {
	this.note = note;
	this.instr = instr;
}

var osciCounter = 0;
class soundEng{
        constructor(props){
        }
	//this.voices = [];
	voiceEnqueue = [];
	voiceDequeue = [];
	noteListeners = [];
	osciListeners = [];
        oscillators = [];
	appRefresh = [];
	//this.voiceKeys = [];
	settings = {};
	instruments = range(instrumentCount).map(_ => clone(instrument_defaults));
	envelopes = range(instrumentCount).map(_ => [{}, {}, {}]);
	keyboard = [];

	reset() {
		//this.voices = [];
		this.voiceEnqueue = [];
		this.voiceDequeue = [];
		this.running = false;
		if (this.oscillators) this.oscillators.forEach(_ => _.voice = undefined);
	}
	update(type, state, param1, param2, param3) {
		log(type, JSON.stringify(state), param1, param2, param3);
		switch (type) {
			case 'stop':
				this.running = false;
				this.reset();
				this.refreshOsciDisplay();
				break;
			case 'keydown':
				var note = state;
				var instr = this.instruments[param1];
				this.running = true;
				this.voiceEnqueue.push(new keyTouch(state, param1));
				for (var l of this.noteListeners) l(note, param1);
				break;
			case 'keyup':
				log(type, JSON.stringify(state), param1, param2, param3);
				var note = state, idx;
				this.voiceDequeue.push(new keyTouch(state, param1));
				break;
			case 'envelope':
				this.reset();
				this.envelopes[param1][param2][['volume', 'frequency', 'dutyCycle'][param3]] = state;
				break;
			case 'instrument':
				this.reset();
				this.instruments[param1] = state;
				break;
			case 'app':
				this.reset();
				this.settings = state.settings;
				this.oscillatorcfgs = state.oscillatorcfgs;
				this.oscillators = this.oscillatorcfgs.map(_ => new oscillator(_, state.clocks, state.settings.master * 1000000, _.pwm));
				var osciCount = Math.min(1, state.oscillatorcfgs.length);
				var maxVol = Math.max.apply(null, state.oscillatorcfgs.map(_ => Math.pow(2, _.depth)));
				this.mixVol = Math.min(1, state.settings.mixer / (osciCount * maxVol));
				this.refreshOsciDisplay();
				for (var h of this.appRefresh) h();
		}
	}
	start() {
		if (window.webkitAudioContext)
			this.audioContext = new window.webkitAudioContext();
		else if (window.AudioContext)
			this.audioContext = new window.AudioContext();
		else {
			var makeFakeNode = function () {
				return {
					'connect': function () { },
					'gain': {},
				};
			}

			this.audioContext = {
				'createScriptProcessor': makeFakeNode,
				'createGain': makeFakeNode,
				'destination': {}
			};
		}
		this.init();
	}

//	var value = 0xffffffff;

	init() {
		const bufferSize = 4096;
		this.scriptNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
		this.lastSample = -1;
		this.lastMasterClock = 0;
		this.lastTime = -1;
		this.lastVblank = -1;
		this.gainNode = this.audioContext.createGain();
		this.gainNode.gain.value = 1;
		this.scriptNode.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);

		this.scriptNode.onaudioprocess = (e) => {
			var output = e.outputBuffer.getChannelData(0);
			var frameTime = 1000 / this.settings.framerate;
			var frameSize = e.outputBuffer.sampleRate / this.settings.framerate;
			if (!this.running) {
				for (var i = 0; i < bufferSize; i++) output[i] = 0;
				if (!this.seq) return;
			}
			//console.log(that.voices.length);
			//var sampleCount = that.lastSample;
			var now = Date.now();
			var vblankSlip = this.lastVblank == -1 ? 0 : Math.min(frameTime / 1000, Math.max(0, now - this.lastVblank - frameSize));
			if (this.lastVblank == -1 || now - this.lastVblank > frameSize) {
				this.handleVblank(0);
				this.lastVblank = now + vblankSlip;
			}
			var nextVblank = frameSize - Math.min(frameSize - 1, vblankSlip * e.outputBuffer.sampleRate);
			var samplesLeft = bufferSize;
			var from = 0;
			while (samplesLeft > 0) {
				if (nextVblank < samplesLeft) {
					this.writeData(from, from + nextVblank, output);
					this.handleVblank(nextVblank / e.outputBuffer.sampleRate);
					from = from + nextVblank;
					samplesLeft -= nextVblank;
				} else {
					this.writeData(from, from + samplesLeft, output);
					samplesLeft = 0;
				}
				nextVblank = frameSize;

			}

			//this.writeData(0, bufferSize, output);

			//if (this.position > 720896000) this.position = that.position % 720896000;
		}

	}
	writeData(from, to, output) {
		var sampleCount = this.lastSample;
		var voiceCount = 0;
		for (var i = from; i < to; i++) {
			sampleCount++;
			//var masterClockPerSecond = 524288;
			var masterClock = sampleCount * Math.floor(500000 * this.settings.master) / this.audioContext.sampleRate;
			var step = Math.floor(masterClock) - this.lastMasterClock;
			var voices = this.oscillators.filter(function (o) { return o.voice }).map(function (_) { return _.voice });
			voiceCount += !!voices.length;
			voices.forEach(_ => _.next(step));
			//if (that.noise) that.noise.next(step);
			//var noiseSample = that.noise && that.noise.on || 0;
			var sample = voices.map(function (_) { return _.on * _.vol }).reduce((prev, curr) => prev + curr, 0)/* + noiseSample*/;
			//sample = Math.min(sample, this.settings.mixer);
			this.lastMasterClock = Math.floor(masterClock);
			//value = value & (size-1);
			output[i] = Math.min(sample / (this.oscillatorcfgs.length * 100), this.mixVol);
			if (Number.isInteger(masterClock)) {
				sampleCount = 0;
				this.lastMasterClock = 0;
			}
			this.lastSample = sampleCount;
		}
		//console.log('data', voiceCount);
	}
	handleVblank(step) {
		var now = Date.now();
		this.lastVblank += step;
		var refreshOsci = false;
		for (var osci of this.oscillators) {
			if (osci.voice && !osci.voice.nextTick(osci)) {
				osci.voice = undefined;
				refreshOsci = true;
			}
		}
		//this.voices = this.voices.filter( v => v.nextTick());
		if (this.seq) {
			if (Math.floor(this.seqIndex) != this.seqLastIndex) {
				var index = this.seqLastIndex = Math.floor(this.seqIndex);
				for (var j = 0; j < this.seq.notes.length; j++) {
					var note = this.seq.notes[j][index];
					if (note == '~') {

					} else {
						var instr = this.seq.instruments[j][index];
						if (defined(this.seqPrev[j])) {
							var prevNote = this.seq.notes[j][this.seqPrev[j]];
							var prevInst = this.seq.instruments[j][this.seqPrev[j]];
							if (defined(prevNote)) {
								//	console.log(type,JSON.stringify(state), param1, param2, param3);
								//var note = state, idx;
								this.voiceDequeue.push(new keyTouch(prevNote, prevInst - 1));
							}
						}
						if (defined(note) /*&& !(sameNote && */) {
							log('aha', note, instr);
							this.voiceEnqueue.unshift(new keyTouch(note, instr - 1));
							this.seqPrev[j] = index;
						}
					}
				}
			}
			this.seqIndex += this.seqStep;
			if (this.seqIndex >= 32) {
				if (this.seq.repeat) this.seqIndex = 0;
				else { this.seqLastIndex = this.seqNum = this.seq = this.seqStep = undefined; this.seqPrev = []; }
			}
		}
		for (var touch of this.voiceEnqueue) {
			var instr = this.instruments[touch.instr];
			//var lastVoice;
			for (var i = 0; i < instr.voices.length; i++) {
				if (instr.pwm && i > 0) continue;
				var v1 = instr.voices[i];
				var env = this.envelopes[touch.instr][i];
				var bestFree, bestBusy;
				bestFree = clone(bestBusy = { 'error': Number.MAX_SAFE_INTEGER });
				for (var j = 0; j < this.oscillators.length; j++) {
					var osci = this.oscillators[j];
					if (osci[v1.noise ? 'noise' : 'tone']) {
						if (instr.pwm) {
							if (j >= this.oscillators.length - 1) continue;
							var next = this.oscillators[j + 1];
							if (!next.pwm) continue;
							if (!next[v1.noise ? 'noise' : 'tone']) continue;
							var err = osci.calcError2(touch.note + v1.transpose, env.frequency.points, env.dutyCycle.points);
						} else {
							var err = osci.calcError(touch.note + v1.transpose, env.frequency.points);
						}
						var best = osci.voice ? bestBusy : bestFree;
						//this.state = { 'length': 200, 'left':0, 'right': 100, 'dragging':undefined, 'points':[new Point(0,this.props.defaultVal, maxLen),new Point(150,this.props.defaultVal, maxLen)] };
						//var voice_defaults = {'transpose':0, 'sustain':false, 'noise': false};
						if (best.error > err || (best.error == err && osci.index < best.index)) {
							best.error = err;
							best.osci = osci;
							best.index = osci.index;
						}
					}
				}

				best = bestFree.osci ? bestFree : bestBusy;
				if (best.osci) {
					//this.voices.push(
					var ctor = instr.pwm ? pwm : v1.noise ? noise : voice;
					best.osci.voice = new ctor({
						note: touch.note + v1.transpose,
						instr, 
						freqEnvelope: env.frequency, 
						volEnvelope: env.volume, 
						sustain: v1.sustain, 
						osci: best.osci, 
						instIndex: touch.instr, 
						dutyCycle: env.dutyCycle,
						lfsrWidth: this.settings.lfsrWidth, 
						lfsrPoly: this.settings.lfsrPoly,
					});
					//);
					best.osci.index = osciCounter++;
					best.osci.voice.nextTick(best.osci);
					refreshOsci = true;
				}
				//lastVoice = best.osci.voice;
				//if (osci.voice && !osci.voice.nextTick()) osci.voice = undefined;
			}
		}

		this.voiceEnqueue = [];
		for (touch of this.voiceDequeue) {
			var instr = this.instruments[touch.instr];
			for (var { voice: v } of this.oscillators) {
				if (v && v.note == touch.note && v.instr == instr) v.released = true;
			}
		}
		this.voiceDequeue = [];
		if (refreshOsci) this.refreshOsciDisplay();
	}
	refreshOsciDisplay() {
		if (this.oscillators) {
			var stateMap = this.oscillators.map(_ => _.voice && this.instruments.indexOf(_.voice.instr));
			this.osciListeners.forEach(_ => _(stateMap));
		}
	}
}
export var soundEngine = new soundEng();
