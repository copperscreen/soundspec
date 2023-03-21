import React, { Component } from 'react';
import {soundEngine} from './soundEng';
import {octavesUp, octavesDown} from './const';
import {A, clamp, note2freq} from './func';

var lerp1 = function( fromStart, fromEnd, toStart, toEnd, x){
	var dx = (x - fromStart)/(fromEnd - fromStart);
	return (toEnd - toStart) * dx + fromEnd;
}

export class OutOfTune extends Component{
	constructor(props){
		super(props);
		soundEngine.appRefresh.push(this.redraw.bind(this));
		this.noteRange = 12 * (1 + octavesUp + octavesDown);
		this.noteWidth = 2;
		this.width = this.noteRange * this.noteWidth;
                this.canvas = React.createRef();
	}
	rescale(val){
		return lerp1(-25, 25, 0, 400, clamp(-25, val, 25));
	}
	redraw(){
		const lowestNote = 12 * octavesDown;
		const ctx = this.canvas?.current?.getContext('2d');
		if (!ctx) return;
		ctx.globalAlpha = 1;
		ctx.clearRect(0, 0, this.width*2, 400)
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillRect(0,this.rescale(10), this.width*2, 1);
		ctx.fillRect(0,this.rescale(-10), this.width*2, 1);
		//rgb(16, 18, 160)
		//rgb(58, 142, 232)
		ctx.fillStyle = 'rgb(58, 142, 232)';
		var zero = this.rescale(0);
		var offset = 0;
		for(var mode of ['tone','noise']){
			var oscillators = soundEngine.oscillators.filter(_ => _[mode]);
			var allErrors = [];
			for(var i=0; i<=this.noteRange; i++){
				if (i == (octavesDown + 3)*12 + 3) ctx.fillStyle = 'rgb(37, 92, 150)';
				var minErr = Number.MAX_SAFE_INTEGER;
				var errors = [];
				var freq = note2freq(i-lowestNote);
				for(var osci of oscillators){
					var err = 100 * (1 - osci.getHwFreq(freq).freq / freq);
					if (Math.abs(minErr) > Math.abs(err)) minErr = err;
					errors.push(err);
				}
				var err1 = this.rescale(minErr);
				var y = Math.min(err1, zero);
				var h = Math.abs(err1 - zero);
				ctx.fillRect(i*this.noteWidth + offset,y, this.noteWidth, h);
				allErrors.push(errors);
				//console.log('detune', minErr, errors);
			}
			ctx.globalAlpha = 0.5;
			for(var j=0; j<=errors.length; j++){
				ctx.fillStyle = 'rgb(255, 0, 0)';
				for(var i=0; i<=this.noteRange; i++){
					var errors = allErrors[i];
					var error = errors[j];
					var err1 = this.rescale(error);
					ctx.fillRect(i*this.noteWidth + offset,err1, this.noteWidth, 2);
				}
			}
			offset = this.width+1;
		}
		ctx.globalAlpha = 1;
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillRect(0,zero, 88*4, 1);
		ctx.fillRect(offset, 0, 1, 400);
	}
	render(){
		return <canvas width={this.width*2} height={400} ref={this.canvas} style={{'border':'solid 1px black'}} />
	};
}
