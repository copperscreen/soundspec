import React, { Component } from 'react';
import { keyCallbacks } from './keyCallbacks';
import { range } from './func';
import {soundEngine} from './soundEng';
import {octavesUp, octavesDown} from './const';
import {Octave} from './Octave';

class Press{
	constructor(note, key){
		this.Note = note;
		this.Key = key;
	}
}

export class Keybrd extends Component{
	constructor(props){
		super(props);
		this.state = { 'pressed':[], 'shift':0 };
		keyCallbacks.keydown.push((note, instr) => { 
			if (instr == this.props.instrument) this.setState({'pressed':this.state.pressed.concat(new Press(note,undefined))});
		});
		keyCallbacks.keyup.push((note, instr) => { 
			if (instr == this.props.instrument) this.setState({'pressed':this.state.pressed.filter( _ => _.Note != note)});
		});
	}
	keydown(e){
		if (e.repeat) return;
		if (document.activeElement.nodeName!="INPUT"){
			if(e.location == this.props.shiftLocation){
				if (e.key == "Shift" && this.state.shift <= octavesUp){
					this.changed=true;
					this.setState({'shift': this.state.shift+1});
				}else if (e.key == "Control" && this.state.shift > -octavesDown){
					this.changed = true;
					this.setState({'shift': this.state.shift-1});
				}
			}else if (this.props.keyCodes.indexOf(e.keyCode)>-1){
				var note = this.state.shift * 12 + this.props.keyCodes.indexOf(e.keyCode);
				if (!this.state.pressed.some(_ => _.Key == e.keyCode)){
					this.changed  = true;
					soundEngine.update('keydown', note, this.props.instrument);
					this.setState({'pressed':this.state.pressed.concat(new Press(note,e.keyCode))});
				}
			}
		}
	}
	keyup(e){
		if (document.activeElement.nodeName!="INPUT"){
			if (this.state.pressed.some(_ => _.Key == e.keyCode))
			{
				this.changed=true;
				soundEngine.update('keyup', this.state.pressed.filter( _ => _.Key == e.keyCode).shift().Note, this.props.instrument);
				this.setState({'pressed':this.state.pressed.filter( _ => _.Key != e.keyCode)});
			}
		}
	}
	keyLabels(base){
		if (base == this.state.shift) return this.props.labels[0];
		else if (base == this.state.shift1 + 1) return this.props.labels[1];
		else return "";
	}
	componentWillMount(){
		document.addEventListener("keydown", this.keydown.bind(this),false);
		document.addEventListener("keyup", this.keyup.bind(this),false);
	}
	componentWillUnmount() {
		document.removeEventListener("keydown", this.keydown,false);
		document.removeEventListener("keyup", this.keyup,false);
	}
	componentDidUpdate(prevProps,prevState){
		if (this.changed){
			this.changed = undefined;
		}
	}

	within(low,list){
		return list.map(_ => _.Note).filter(_ => _ >= low && (_ < low + 12)).map(_ => _ - low);
	}
	render(){
		//console.log(this.state.pressed.map(_ => '{'+_.Key+':'+_.Note+'}').join(' '));
		return <div className="keyboard">{ range(octavesUp+octavesDown+2).map(_ => _ - octavesDown).map(_ => <Octave keys={this.keyLabels(_)} 
			pressed={this.within(_*12, this.state.pressed)} />) }</div>;
	}
}
