import {voice} from './voice';

export class noise extends voice{
	constructor(options){
		super(options);
		this.size = 2**options.lfsrWidth; //2**16;
		this.poly = parseInt(options.lfsrPoly); //0x801C;
		this.value = 0xffffffff;
		//this.temp = [];
	}
	switch_(){
		//console.log('switch2', this.cycleLen);
		this.counter = this.cycleLen;
		this.value = this.value & (this.size-1);
		this.on = this.value & 1;
		//this.temp.push(this.value);
		if (this.value & 1) { this.value = (this.value >> 1) ^ this.poly; }
		else { this.value = (this.value >> 1);       }
	//	return v;
	}
}
