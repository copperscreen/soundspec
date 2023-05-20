export function defined(val){ return val !== undefined && val !== null;};
export function range(len){return (new Array(len)).fill(0,0,len).map((a,b)=>b);}
export function range2(start,len){return range(len).map(_ => _+start);}
export function clone(_){ return _?JSON.parse(JSON.stringify(_)):_;}
export function clone2(arr){ return arr.map( _ => _.slice());}
export function note2freq(note){return 440 * (2 ** ((note /* - 49*/ )/12));}
export function scaleNotePoint(point){ return (point-50)/50;};
export function clamp(min,x,max){ return Math.max(min,Math.min(max,x));};
export function lerp( start, end, x){
	var dx = (x - start.X) / (end.X - start.X);
	return (end.Y - start.Y) * dx + start.Y;
}
export function identity(i){return i;};
export function resize(arr, newLen, val){
	return 	arr.length > newLen ? 
		arr.slice(0, newLen) :
		arr.slice().concat(Array(newLen - arr.length).fill(0).map(_ => clone(val)));
}

export function log(){
//console.log.apply(this, arguments);
}
export function call(){
	var chain = arguments[0];
	var member = chain.shift();
	var owner;
	while(chain.length){
		owner = member;
		if (member[chain[0]]) member = member[chain.shift()];
		else return;
	}
	return member.apply(owner, A.slice.call(arguments,1));
}
export const A = Array.prototype;
