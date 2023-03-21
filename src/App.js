import React, { Component } from 'react';
import * as RB from 'react-bootstrap'
import './App.css';

import {soundEngine} from './soundEng';
import {defaultSettings, soundTypes, instrumentCount, headerTitle} from './const';
import {A, call, range, clone, identity, resize} from './func';
import {persister} from './persister';
import {Indi} from './Indi';
import {FoldableSettings} from './Settings';
import {OscillatorCfg} from './OscillatorCfg';
import {OutOfTune} from './OutOfTune';
import {Instrument} from './Instrument';
//import {bindEngine} from './bind';
import {keyCallbacks} from './keyCallbacks';
import {Keybrd} from './Keyboard';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';


import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavItem from 'react-bootstrap/NavItem';
import NavDropdown from 'react-bootstrap/NavDropdown';

/*var Navbar = ReactBootstrap.Navbar,
Nav = ReactBootstrap.Nav,
NavItem = ReactBootstrap.NavItem,
DropdownButton = ReactBootstrap.DropdownButton,
MenuItem = ReactBootstrap.MenuItem;

lfsr{width,mask}masterClock,[clocks][oscillators]
oscillator{width,depth,clocks,noise{yes,no,optional}}
sound{noise,loop,transpose, oscillators}
instrument-input{row1,row2,f1-f4},[sound]

*/

/*
PAL C64 master clock: 17.734475 MHz
NTSC C64 master clock: 14.318180 MHz
The CPU frequency is then calculated from that by simply dividing the frequency by 18 (PAL) or 14 (NTSC). 
985248,61111111111111111111111111
1022727,1428571428571428571428571

PAL : 1.7734470 MHz
NTSC: 1.7897725 MHz

data: Uint8Array(3) pedal
0: 176
1: 64
2: 0

0: 176
1: 64
2: 127
note: 
0: 144
1: 53
2: 108

0: 144
1: 53
2: 0
*/
//var oscillator

window.addEventListener('load',  function(){
	var before = document.getElementById('beforerun');
	before.onclick = function(ev){
	        if (ev.target.nodeName != "A"){
			before.style.display = "none";
			soundEngine.start();
		}
	}
});

var midiCount = 0;
var invert = function(i){return !i+0;}
if (!navigator) navigator = {}
if (!navigator['requestMIDIAccess']) navigator.requestMIDIAccess = function(){return Promise.resolve({'inputs':[]});};

navigator.requestMIDIAccess().then(
	midi => {
		//var inputs = []; 
		//console.log(midi.inputs);
		midi.inputs.forEach(
			input => {
			var index = midiCount++;
			//inputs.push(input);
			input.open().then(
			openInput => {
				 openInput.onmidimessage=function(e){
					var note = (e.data.length > 1) &&( e.data[1]-48);
					var idx = index;
					if (keyCallbacks.split != 'No split' && note < 12*(keyCallbacks.split.substring("Split at C".length)*1)) idx = invert(idx);
					idx = keyCallbacks.instr(idx);
//console.log(note, index, idx, e.data, e.data[0] & 0xf0, 12*(keyCallbacks.split+0));
					switch(e.data[0] & 0xf0){
						case 144: 
							if (e.data[2]){
								//console.log('on', e.data[1]);
								soundEngine.update('keydown', note, idx);
								keyCallbacks.keydown.forEach( _ => _(note, idx));
							}else{
								soundEngine.update('keyup', note, idx);
								keyCallbacks.keyup.forEach( _ => _(note, idx));
							}
							break;//korg 48..72
						case 128: 
							//console.log('off', e.data[1]);
							soundEngine.update('keyup', note, idx);
							keyCallbacks.keyup.forEach(_ => _(note, idx));
							break;
						case 224: 
							//console.log('pitch', e.data[1] + (e.data[2] << 7));
							break;//0..8192..16383
					}
			}; 
				//console.log('open',openInput); 
				});
		});
	}	
);
function whatever(){
	debugger;
}



var ancestry = function(node){
	var node1 = node;
	var result = [];
	while(node1){
		result.push(node1);
		node1 = node1.parentNode;
	}
	return result;
}
var gather = function(list){
	var result = [];
	A.slice.call(arguments,1).forEach(_ => result.push(list[_]));
	return result; 
}
var hasClass = function(item,className){ return item && item.classList && item.classList.contains(className);}


class App extends Component {
	constructor(props){
		super(props);
		//oscillator{width,depth,clocks,noise{yes,no,optional}}
		this.defaults = {'oscillatorcfgs': {'width':12, 'depth':3, 'useclocks':[0,1], 'soundtype':soundTypes[0], 'pwm': false }, 'clocks':1};
		this.fkeys = [8, 45, 36, 33]; //[115, 118,120,121];
		soundEngine.update('app', defaultSettings);
		this.state = Object.assign({ 'foldedSettings': true, 'foldedOscillators': true, 'foldedOutOfTune': true,
				'foldedSeq': [ true, true, true], 'foldedInstr': range(instrumentCount).map(_ => true)}, defaultSettings);
			
		persister.Reg(this);
	}
	getKey(){
		return 'app';
	}
	foldHandler(field){
		var newState = {};
		newState[field] = !this.state[field];
		this.setState(newState);
	}
	stateChange(id, newState){
		if (this.props.stateChange){
			this.props.stateChange(id, newState);
		}
	}
	toggleFold(field, index){
		var isHeading = _ => call([_,'target', 'classList', 'contains'], 'card-title');
		//var isButton = _ => call([_,'target', 'getAttribute'], 'role') == 'button';
		//var isButton = _ => ancestry(_).some(_ => _.getAttribute && _.getAttribute('role') == 'button');
                var isButton = _ => _?.target?.classList?.contains('navbar-brand');
		var isNavbar = _ => [_].concat(ancestry(_)).some( node => node.tagName == 'NAV');
		if (A.some.call(arguments, _ => isHeading(_) || ( isButton(_) && isNavbar(_.target)))){
			var field1 = clone(this.state[field]);
			if (Number.isInteger(index))
				field1[index] = !field1[index];
			else
				field1 = !field1;
			var change = {};
			change[field] = field1;
			this.setState(change);
			Array.from(arguments).pop().preventDefault();
		}
	}	
	toggleFold1(field, index){
			var field1 = clone(this.state[field]);
			if (Number.isInteger(index))
				field1[index] = !field1[index];
			else
				field1 = !field1;
			var change = {};
			change[field] = field1;
			this.setState(change);
	}	
	keydown(e){
		if (e.repeat) return;
		if (document.activeElement.nodeName!="INPUT"){
			var instr = 0;
			if ( (instr = this.fkeys.indexOf(e.keyCode))>-1){
				//this.changed  = true;
				soundEngine.update('keydown', 0, instr + 2);
			}else if (e.keyCode == 32) soundEngine.update('stop');
		}
	}
	keyup(e){
		if (document.activeElement.nodeName!="INPUT"){
			//this.changed=true;
			var instr = 0;
			if ( (instr = this.fkeys.indexOf(e.keyCode))>-1){
				soundEngine.update('keyup', 0, instr + 2);
			}
		}
	}

	componentDidUpdate(prevProps,prevState){
		keyCallbacks.instr = this.state.settings.swap?invert:identity;
		keyCallbacks.split = this.state.settings.split;
		soundEngine.update('app',this.state);
	}
	componentWillMount(){
		document.addEventListener("keydown", this.keydown.bind(this),false);
		document.addEventListener("keyup", this.keyup.bind(this),false);
	}
	componentWillUnmount() {
		document.removeEventListener("keydown", this.keydown,false);
		document.removeEventListener("keyup", this.keyup,false);
	}

	foldAll(){
		this.setState({'foldedSettings': true, 'foldedOscillators': true, 'foldedOutOfTune': true, 'foldedSeq': this.state.foldedSeq.map(_ => true), 'foldedInstr': this.state.foldedInstr.map(_ => true)});
	}
	swap(proxy, event){
		var q = 1;
	}
	updateSettings(type, val, index){
		const setNewState = newState => {
				soundEngine.update('app', newState);
				this.setState(newState);
		}
		switch(type){
			case 'settings':
				const settings = Object.assign({}, this.state.settings, val);
				setNewState(Object.assign({}, this.state, {settings}));
				break;
			case 'clocks':
				const clocks = resize(this.state.clocks, val, 1);
				setNewState(Object.assign({}, this.state, {clocks}));
				break;
			case 'clock':
				const newClocks = clone(this.state.clocks);
				newClocks[val[0]] = val[1];
				setNewState(Object.assign({}, this.state, {clocks: newClocks}));
				break;
			case 'oscillators':
				const oscillatorcfgs = resize(this.state.oscillatorcfgs, val, {
					'width':12, 
					'depth':3, 
					'useclocks':[0], 
					'soundtype':soundTypes[0]
				});
				setNewState(Object.assign({}, this.state, {oscillatorcfgs}));
				break;
			case 'oscillator':
				const osc = this.state.oscillatorcfgs.slice();
				osc[index] = clone(osc[index]);
				osc[index][val[0]] = val[1];
				setNewState(Object.assign({}, this.state, {oscillatorcfgs: osc}));
				break;
			case 'useclocks':
				const oscil = this.state.oscillatorcfgs.slice();
				oscil[index] = clone(oscil[index]);
				if (oscil[index].useclocks.indexOf(val) === -1) oscil[index].useclocks.push(val);
				else (oscil[index].useclocks = oscil[index].useclocks.filter( _ => _ != val));
				oscil[index].useclocks.sort();
				setNewState(Object.assign({}, this.state, {oscillatorcfgs: oscil}));
		}
	}
	//<Settings vals={this.state.settings}  change={()=>console.log('change')} oscillatorCount={this.state.oscillatorCount} hidden={this.state.foldedSettings} click={this.toggleFold.bind(this,'foldedSettings')}/>
	render(){
		const head = ["(upper keys/MIDI 1)", "(lower keys/MIDI 2)", "(backspace)", "(insert)", "(home)", "(pgup)"]
		return <div >
 <Navbar bg="light"><Navbar.Collapse>
    <Nav>
	<Navbar.Brand><Indi/></Navbar.Brand>
	<Nav.Link onClick={soundEngine.init.bind(soundEngine)}>Reset</Nav.Link>
	<Navbar.Brand className='loader'><input type='file' id='fileinput' onClick={a=>a.stopPropagation()} onChange={persister.Load.bind(persister)}/>Load</Navbar.Brand>
	<Navbar.Brand onClick={persister.Save.bind(persister)}>Save</Navbar.Brand>
    <Navbar.Brand onClick={this.foldAll.bind(this)}>        Fold all    </Navbar.Brand>
	{		this.state.foldedSettings?<Navbar.Brand eventKey="1" href="#" onClick={this.toggleFold.bind(this,'foldedSettings')}>Setings</Navbar.Brand>:""		}
	{		this.state.foldedOscillators?<Navbar.Brand eventKey="2" href="#" onClick={this.toggleFold.bind(this,'foldedOscillators')}>Oscillators</Navbar.Brand>:""		}
	{/*		this.state.foldedOutOfTune?<Navbar.Brand eventKey="3" href="#" onClick={this.toggleFold.bind(this,'foldedOutOfTune')}>OutOfTune</Navbar.Brand>:""		*/}
	{		this.state.foldedInstr.map( (val,i) => this.state.foldedInstr[i]?<Navbar.Brand key={i} eventKey={'b'+i} href="#" className={"instr-"+(i+1)} onClick={this.toggleFold.bind(this,'foldedInstr', i)}>Instrument{i+1}</Navbar.Brand>:"")	}
    </Nav>
</Navbar.Collapse></Navbar>
	<div style={{'display':'flex', 'flexDirection':'row', 'flexWrap':'wrap', 'alignItems': 'flex-start'}}>
		<FoldableSettings upd={this.updateSettings.bind(this)} folded={this.state.foldedSettings} foldHandler={this.toggleFold1.bind(this,'foldedSettings')} header="Settings" clocks={this.state.clocks} {...this.state.settings} />
		<RB.Card className="compact" style={this.state.foldedOscillators?{'display':'none'}:{}} onClick={this.toggleFold.bind(this,'foldedOscillators')}>
<RB.Card.Title title={headerTitle} className="bg-light">{"Oscillators"}</RB.Card.Title>
		<RB.Form inline>
    <RB.FormGroup controlId="formInlineName">
      <RB.Form.Label>Number of oscillators</RB.Form.Label>
			<div style={{'margin':'10px'}} className="osciNum">
			<RB.FormSelect onChange={ev => this.updateSettings('oscillators', parseInt(ev.target.value))} value={this.state.oscillatorcfgs.length}>
			{ range(16).map(_ =>	<option key={_} value={_+1}>{_+1}</option> )	}
			</RB.FormSelect></div>
    </RB.FormGroup>
	</RB.Form>
		<RB.Table className="compact lines" striped><tbody>
    <tr><th>Number</th><th>Width</th><th>Volume</th><th>PWM</th><th>Noise</th><th>Clocks</th></tr>
{ range(this.state.oscillatorcfgs.length).map(_ =>
	<OscillatorCfg  key={_} upd={this.updateSettings.bind(this)} clocks={this.state.clocks.length} index={_} {...this.state.oscillatorcfgs[_]} />
)}
</tbody></RB.Table>
</RB.Card>
{<RB.Card className="compact" style={this.state.foldedOutOfTune?{'display':'none'}:{}} onClick={this.toggleFold.bind(this,'foldedOutOfTune')} >
<RB.Card.Title title={headerTitle} className="bg-light">{"OutOfTune"}</RB.Card.Title>
<OutOfTune  oscillators={this.state.oscillatorcfgs} clocks={this.state.clocks}/>
</RB.Card>}
</div>
{range(instrumentCount).map((_, i) => <Instrument  hidden={this.state.foldedInstr[_]} head={"Instrument " + (_+1) + " " + head[_]} index={_} click={this.toggleFold.bind(this,'foldedInstr',_)} stateChange={this.stateChange.bind(this, 'Instrument', _)} />)}

		<Keybrd instrument={0} split={this.state.settings.split} keyCodes={[81,50,87,51,69,82,53,84,54,89,55,85,73,57,79,48,80,219,187,221]} shiftLocation={1} labels={['high1','high2']}/>
		<hr/>
		<Keybrd instrument={1} split={this.state.settings.split} keyCodes={[90,83,88,68,67,86,71,66,72,78,74,77,188,76,190,186,191]} shiftLocation={2} labels={['low1','low2']}/>
		</div>
	}
}
export default App;
