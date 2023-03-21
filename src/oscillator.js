import {scaleNotePoint, note2freq} from './func';

export function oscillator(oscillatorcfgs, clocks, master, pwm){
	this.cfg = oscillatorcfgs;
	this.depth = oscillatorcfgs.depth;
	this.pwm = pwm;
	this.noise = ['noise','both'].includes(oscillatorcfgs.soundtype);
	this.tone = ['tone','both'].includes(oscillatorcfgs.soundtype);
	this.clocks = clocks.filter((_,i) => oscillatorcfgs.useclocks.indexOf(i)>-1).map(_ => ({ 'max': 2**oscillatorcfgs.width - 1, 'const': Math.round(master / _), 'div':_}));
	this.calcError = function(note, points){
		var err = 0;
		for(var i  = 0; i< points.length;i++){
			var curr = points[i];
			var n = note + scaleNotePoint(curr.Y);
			var freq = note2freq(n);
			var realFreq = this.getHwFreq(freq).freq;
			err += Math.abs(freq-realFreq);
		}
		return err;
	}
	this.calcError2 = function(note, points, points2){
		var err = 0;
		for(var i  = 0; i< points.length;i++){
			var curr = points[i];
			var n = note + scaleNotePoint(curr.Y);
			var freq = note2freq(n);
			var realFreq = this.getHwFreq(freq).freq;
			err += Math.abs(freq-realFreq);
		}
		return err;
	}
	this.getHwFreq = function(freq){
		var err = Number.MAX_SAFE_INTEGER;
		var result = {};
		for(var j =0; j < this.clocks.length;j++){
			var clock = this.clocks[j];
			for(var i = 1; i <= clock.max; i++){
				var f = clock.const/i;
				var diff = Math.abs(freq - f);
				if (diff < err){
					err = diff;
					result = { 'freq': f, 'clock': j, 'counter': i, 'div': clock.div};
				}
			}
		}
		return result;
	}
	this.getHwFreq2 = function(freq, pw){
		var err = Number.MAX_SAFE_INTEGER;
		var result;
		//if (!window.logdone)
		//console.log('freq2------------------------------------------')
		for(var j =0; j < this.clocks.length;j++){
			var clock = this.clocks[j];
			var err = Number.MAX_SAFE_INTEGER;
			for(var i = 1; i <= clock.max; i++){
				var i2 = 2*i/pw - i;
				var iUp = Math.ceil(i2);
				var diff = Math.abs(freq - 2*clock.const/(i+iUp));
				if (diff < err){
					err = diff;
					result = {'freq':clock.const/i, 'counter':i, 'freq2': clock.const/iUp, 'counter2':iUp, 'err': diff, 'clock': j, 'div': clock.div};
				}
				var iDown = Math.floor(i2);
				diff = Math.abs(freq - 2*clock.const/(i+iDown));
				if (diff < err){
					err = diff;
					result = {'freq':clock.const/i, 'counter':i, 'freq2': clock.const/iDown, 'counter2':iDown, 'err': diff, 'clock': j, 'div': clock.div};
				}
			}
		}
		return result;
	}
	this.getHwFreq3 = function(freq, pw){
		var removeWorst = function(list){
			var max = 0;
			var maxI;
			for(var i =0; i<list.length;i++){
				var item=list[i];
				if (item.err > max){
					max = item.err;
					maxI = i;
				}
			}
			return list.splice(maxI,1);
		}

		//var pw1 = freq * pw / 100;
		var pw1 = pw;
		var freq1 = freq - pw1;
		var freq2 = freq + pw1;
		var sumDiff = Number.MAX_SAFE_INTEGER;
		var finalResults = [];
		//if (!window.logdone)
		//console.log('freq2------------------------------------------')
		for(var j =0; j < this.clocks.length;j++){
			var finalResult;
			var results = {'low':[],'high':[]};
			var clock = this.clocks[j];
			var err = Number.MAX_SAFE_INTEGER;
			for(var i = 1; i <= clock.max; i++){
				var f = clock.const/i;
				var diff = Math.abs(freq1 - f);
				results.low.push({ 'freq': f,  'counter': i,  'err':diff});
				//if (!window.logdone)console.log('freq2_low', f, i, diff);
				if (results.low.length > 30) /*console.log('freq2_low_removing ', JSON.stringify(*/removeWorst(results.low)/*))*/;
				var diff = Math.abs(freq2 - f);
				results.high.push({ 'freq': f,  'counter': i,  'err':diff});
				//if (!window.logdone)console.log('freq2_high', f, i, diff);
				if (results.high.length > 30) /*console.log('freq2_high_removing ', JSON.stringify(*/removeWorst(results.high)/*))*/;
			}
					
			for(var r1 of results.low)
				for(var r2 of results.high)
				{
					var c = (r1.counter+r2.counter);
					var diff = Math.abs(freq - clock.const*2/c);
					if (diff < err){
						finalResult = {'freq':r1.freq, 'counter':r1.counter, 'freq2': r2.freq, 'counter2':r2.counter, 'err': diff, 'clock': j, 'div': clock.div};
						err = diff;
					}
				}
			finalResults.push(finalResult);
		}
		while(finalResults.length>1) removeWorst(finalResults);
		
		//if (!window.logdone)console.log('freq2-------------done---------------------')
		//window.logdone = 1;
		return finalResults.pop();
	}
		//'oscillators': {'width':12, 'depth':3, 'useclocks':[0], 'soundtype':soundTypes[0] }	
}
