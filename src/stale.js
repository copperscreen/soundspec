class sound{
	constructor(note, time, instrument){
		this.Note = note;
		this.Freq = 440 * (2 ** ((note /* - 49*/ )/12));
		//console.log(this.Freq);
		this.StartTime = time;
		this.Instrument = instrument;
	}
}
var replace = function(arr, index, val){
	var aCopy = arr.slice();
	aCopy[index] = val;
	return aCopy;
}
