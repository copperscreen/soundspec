import {voice} from './voice';
import {log, lerp, note2freq} from './func';

export class pwm extends voice{
	constructor(options){
		super(options);
		this.dutyCycleEnvelope = options.dutyCycle;
	}
	switch_(){
		//console.log('switch3', this.pwm,  this.cycleLen+this.cycleLen2,  this.cycleLen,  this.cycleLen2);
		this.counter = this.on ? this.cycleLen2 : this.cycleLen;
		//this.counter = this.cycleLen2;
		this.on = !this.on;
	}
	adjust(note, vol, osci){
		//this.freq = osci.getHwFreq(noteCounters[Math.floor(10*(note+49))]).freq;
		//this.freq = osci.getHwFreq(note2freq(note)).freq;
		var freq = note2freq(note);
		//var pwm = freq*(1 - this.pwm/100);
		var pwm = this.pwm/100;
		var f = osci.getHwFreq2(freq, pwm);
		var f1 = osci.getHwFreq(freq);
		if (this.freq != f.freq || this.freq2 != f.freq2){
			this.div = f.div;
			this.freq = f.freq;
			this.freq2 = f.freq2;
			this.cycleLen = f.counter * this.div;
			this.cycleLen2 = f.counter2 * this.div;
			//console.log('adjust2', freq, this.pwm, this.freq, this.freq2, this.cycleLen, this.cycleLen2, this.freq+this.freq2);
			log('adjust2', f1.counter - f.counter, f1.counter - f.counter2,  f.counter, f.counter2, f1.counter, f.div, f1.div);
			//this.counter = f.counter + (this.shift || 0);
		}
		var k = Math.pow(2, this.depth);
		this.vol = k * Math.floor(vol/k);
	}
	nextTick(osci){
		this.dutyTick += 1;
		if (!this.released && this.sustain){
			if (this.dutyCycleEnvelope.right > this.dutyTick) this.dutyTick = this.dutyCycleEnvelope.left;
		}
		
		this.pwm = 0;
		
		if (this.dutyCycleEnvelope.length > this.dutyTick){
			for(var i = 0; i < this.dutyCycleEnvelope.points.length-1;i++){
				var curr = this.dutyCycleEnvelope.points[i];
				var next = this.dutyCycleEnvelope.points[i+1];
				if (curr.X <= this.dutyTick && next.X >= this.dutyTick) {
					this.pwm = lerp(curr, next, this.dutyTick);
					break;
				}
			}
		}
		var result = super.nextTick(osci);
		return result;
	}
}
