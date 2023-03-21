import React, { Component } from 'react';
import * as RB from 'react-bootstrap';

import {voice_defaults, instrument_defaults, octavesUp, octavesDown} from './const';
import {soundEngine} from './soundEng';
import {clone, range, log, resize} from './func';
import {persister} from './persister';
import {Envelope} from './Envelope';

function Voice(props){
	return <span>
			<Envelope defaultVal={100} text={'Volume ' + (1+props.index)} instrument={props.instrument} voice={props.index} index={0} stateChange={props.stateChange} sustain={props.sustain} />
			<Envelope defaultVal={50} text={'Frequency ' + (1+props.index)} instrument={props.instrument} voice={props.index} index={1}stateChange={props.stateChange} sustain={props.sustain} />
			</span>;
}

export class Instrument extends Component{
	constructor(props){
		super(props);
		this.defaults = {'voices':voice_defaults};
		soundEngine.update('instrument',
			this.state = clone(instrument_defaults),
			this.props.index
		);
		persister.Reg(this);
	}
	componentDidUpdate(prevProps,prevState){
		//if (this.changed){
			//this.changed = undefined;
			soundEngine.update('instrument',this.state, this.props.index);
		//}
	}
	getKey(){
		return 'inst_' + this.props.index;
	}
	swapSettings(ev, to){
		persister.Swap(this.props.index, to);
	}
	setVoices(ev){
		const newState = clone(this.state);
		const count = parseInt(ev.target.value, 10);
		if (!isNaN(count)){
			newState.voices = resize(newState.voices, count, voice_defaults);
			newState.pwm = false;
		}else{
			newState.voices = resize(newState.voices, 1, voice_defaults);
			newState.pwm = true;			
		}
		this.setState(newState);
	}
	setVoiceParam(index, name, ev){
		const newState = clone(this.state);
		if (name === 'transpose'){
			newState.voices[index].transpose = parseInt(ev.target.value, 10);
		}else{
			newState.voices[index][name] = ev.target.checked;
		}
		this.setState(newState);
	}
	render(){
		var insertSecond = function(array, value){ 
			return (array.length>1)?
			[array[0]].concat(value).concat(array.slice(1)):
			array;
		};
		var numbers = range(6).filter(_ => _ != this.props.index);
		var head = [this.props.head, 
			<RB.ButtonToolbar className="right">
				<RB.ButtonGroup bsSize="xsmall">
					{ numbers.map(_ =>	 <RB.Button 
						size="xsmall" 
						style={{'outline':'none'}} 
						title={"Press to swap settings between instruments " + (this.props.index+1) + " and " + (_+1)} 
						onClick={ev => this.swapSettings(ev, _)} >
						{_+1}</RB.Button>)	
					}
				</RB.ButtonGroup>
			</RB.ButtonToolbar>
		];
		var voiceCount = (this.state.voices.length > 1 && this.state.pwm) ? 1 : this.state.voices.length;
		return <RB.Card style={{'display':this.props.hidden?'none':'inline-block'}} className={'instrument instr-' + (1+this.props.index)}   
				onClick={this.props.click}  >
	        		<RB.Card.Title>{head}</RB.Card.Title>
				<RB.Table horizontal pullLeft bsSize="small" className="compact" 
					style={{'float':'left'}} striped>
					<tbody>
						<tr bsSize="small">
							<td colSpan={2}>Voices</td>
							<td colSpan={2}>
								<RB.FormSelect  
									onChange={ev => this.setVoices(ev)}
									value={this.state.pwm ? 'PWM' : this.state.voices.length}>
									{ [1, 2, 'PWM'].map(_ =>	<option key={_} value={_}>{_}</option> ) }
								</RB.FormSelect>
							</td>
						</tr>
						<tr><td></td><th>Transpose</th>{/*<th>Sustain</th>*/}<th>Noise</th></tr>
						{ this.state.voices.slice(0,voiceCount).map((_,i) =>
							<tr><td>{i+1}</td><td>
								<RB.FormSelect onChange={ev => this.setVoiceParam(i, 'transpose', ev)} value={_.transpose}>
								{ range(12*(octavesUp + octavesDown + 1)).
									map(_ => _-12*octavesDown).map(_ => <option value={_}>{_}</option> )	
								}
								</RB.FormSelect>
								</td>{/*<td>
									<RB.FormCheck onChange={ev => this.setVoiceParam(i, 'sustain', ev)} checked={ _.sustain} >
									</RB.FormCheck>
								</td>*/}<td>
									<RB.FormCheck onChange={ev => this.setVoiceParam(i, 'noise', ev)} checked={_.noise}
										disabled={this.state.pwm}>
									</RB.FormCheck>
								</td>
							</tr>
						)}
					</tbody>
				</RB.Table>
				<div style={{'display':'inline-block'}}>
	  { this.state.pwm?
			[
				<Voice sustain={this.state.voices[0].sustain} instrument={this.props.index} index={0}/>, 
				<br/>,
				<Envelope defaultVal={100} text={'Duty cycle'} instrument={this.props.index} voice={0} index={2} stateChange={this.props.stateChange} sustain={this.state.voices[0].sustain} />
			]
			:insertSecond(this.state.voices.map((_,i) =>
			<Voice sustain={_.sustain} instrument={this.props.index} index={i}/>
		), <br/>)
	  }</div>
	</RB.Card>
	}
}
