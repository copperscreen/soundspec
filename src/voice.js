import {scaleNotePoint, note2freq, lerp, log} from './func';

export class voice {
	constructor({note, instr, freqEnvelope, volEnvelope, sustain, osci, instIndex}){
		this.instIndex = instIndex;
		this.depth = osci.depth;
		this.osci = osci;
		this.note = note;
		this.vol = 100;
		this.instr = instr;
		this.freqEnvelope = freqEnvelope;
		this.volEnvelope = volEnvelope;
		this.sustain = sustain;
		//this.playing = false;
		this.freqTick = 0;
		this.volTick = 0;
		this.dutyTick = 0;
		//this.freq = osci.getHwFreq(noteCounters[Math.floor(10*(note+49))]).freq;
		var f = osci.getHwFreq(note2freq(note));
		this.freq = f.freq;
		this.div = f.div;
		this.cycleLen = f.counter * this.div;
		this.counter = this.cycleLen;//  + (this.shift || 0);
		this.on = true;
	}
	nextTick(osci){
		this.freqTick += 1;
		this.volTick += 1;
		if (!this.released && this.sustain){
			log('wrap');
			if (this.freqEnvelope.right > this.freqTick) this.freqTick = this.freqEnvelope.left; 
			if (this.volEnvelope.right > this.volTick) this.volTick = this.volEnvelope.left;
		}
		var freqOn = false;
		var volOn = false;
		var note = this.note;
		var vol = this.volume;
		if (this.freqEnvelope.length > this.freqTick){
			for(var i = 0; i < this.freqEnvelope.points.length-1;i++){
				var curr = this.freqEnvelope.points[i];
				var next = this.freqEnvelope.points[i+1];
				if (curr.X <= this.freqTick && next.X >= this.freqTick) {
					freqOn = true;
					note = this.note + scaleNotePoint(lerp(curr, next, this.freqTick));
					break;
				}
			}
		}
		if (this.volEnvelope.length > this.volTick){
			for(var i = 0; i < this.volEnvelope.points.length-1;i++){
				var curr = this.volEnvelope.points[i];
				var next = this.volEnvelope.points[i+1];
				if (curr.X <= this.volTick && next.X >= this.volTick) {
					volOn = true;
					vol = lerp(curr, next, this.volTick);
					break;
				}
			}
		}
		this.adjust(note,vol, osci);
		return 	freqOn && volOn;
	}
	adjust(note, vol, osci){
		//this.freq = osci.getHwFreq(noteCounters[Math.floor(10*(note+49))]).freq;
		//this.freq = osci.getHwFreq(note2freq(note)).freq;
		var f = osci.getHwFreq(note2freq(note));
		if (this.freq != f.freq){
			this.div = f.div;
			this.freq = f.freq;
			this.cycleLen = f.counter * this.div;
			//this.counter = f.counter + (this.shift || 0);
		}
		var k = Math.pow(2, this.depth);
		this.vol = k * Math.floor(vol/k);
	}
	switch_(){
		//console.log('switch1', this.cycleLen);
		this.counter = this.cycleLen;
		this.on = !this.on;
	}
	next(steps){
		if (steps > 0){
			while(steps > this.counter){
				steps -= this.counter;
				this.switch_();
			}
			if (steps > 0) this.counter -= steps;
		}
	}
}
