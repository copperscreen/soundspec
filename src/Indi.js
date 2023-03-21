import React, { Component } from 'react';
import {soundEngine} from './soundEng';

var cmpArray = function(a,b){
	if(a.length != b.length) return false;
	for(var i = 0; i< a.length;i++){
		if (a[i]!=b[i]) return false;
	}
	return true;
}

export class Indi extends Component{
	constructor(props){
		super(props);
		this.state = {'oscillators':[]};
	}
	update(oscillators){
		//if (!cmpArray(this.state.oscillators, oscillators)){
			this.setState({'oscillators':oscillators});
			//console.log(oscillators);
		//}
	}
	componentDidMount(){
		soundEngine.osciListeners.push(this.listener = this.update.bind(this));
	}
	componentWillUnmount() {
		if (this.listener){
			soundEngine.osciListeners = soundEngine.osciListeners.filter(a => a == this.listener);
		}
	}
	render(){
		var mid = Math.ceil(this.state.oscillators.length / 2.0);
		var items = this.state.oscillators.map(_ => <span className={_>-1?('instr'+(_+1)):null} >{'\u00A0'}</span>);
		
		return <div className='indi'>{
			items.slice(0,mid).concat(<br/>).concat(items.slice(mid))
		}</div>;
	}
}
