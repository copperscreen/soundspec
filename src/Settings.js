import * as RB from 'react-bootstrap';
import {A, call, range, range2} from './func';
import {defaultSettings, headerTitle} from './const';
import {soundEngine} from './soundEng';

function foldable(Tag){
		var toggleFold = function(handler, e){
			//var isHeading = _ => call([_,'target', 'classList', 'contains'], 'panel-heading');
			//if (A.some.call(arguments, _ => isHeading(_))){
			if (e.target?.classList?.contains('card-title')){
				e.preventDefault();
				handler();
			}
		}	
		return function render(props) {
				return <RB.Card className="compact" style={props.folded?{'display':'none'}:{}} onClick={toggleFold.bind(this, props.foldHandler)}  >
				<RB.Card.Title title={headerTitle} className="bg-light">{props.header}</RB.Card.Title>
				<Tag {...props} />
				</RB.Card>;
		}
}
export  function Settings(props){		
//                let [settings, setSettings] = useState(defaultSettings.settings); 
		const labelCol = 2;
		const inputCol = 3;
		var notes = idx => noteList.map( _ => _.concat(idx));
		const selectMaster = val => props.upd('settings', {master: parseFloat(val)});
		const inputMaster = ev => props.upd('settings', {master: parseFloat(ev.target.value)});
		return <RB.Table horizontal pullLeft bsSize="small" className="compact settings"><tbody>

		<tr bsSize="small">
			<td sm={labelCol}>
				Master clock
			</td>
			<td sm={inputCol}>
			<RB.InputGroup>
				<RB.FormControl style={{'width':'100px'}} type="text" value={props.master} onChange={inputMaster} />
				<RB.DropdownButton componentClass={RB.InputGroup.Button} onSelect={selectMaster} >
				{[['PAL',1.7734470], ['NTSC', 1.7897725]].map(_ =>  <RB.Dropdown.Item eventKey={_[1]} key={_[0]}>{_[0]}</RB.Dropdown.Item>)}
				</RB.DropdownButton>
			</RB.InputGroup>
			</td>		
		</tr>

	    <tr >
			<td sm={labelCol}>
			<a href="https://users.ece.cmu.edu/~koopman/lfsr/index.html" target="_blank">LFSR width</a>
			</td>

			<td sm={inputCol}>
				<RB.FormSelect onChange={v => props.upd('settings', {lfsrWidth: v.target.value})} >
				{ range(28).map(_ => _+4).map(_ => <option key={_}  selected={_==props.lfsrWidth?true:null} value={_}>{_ + " bit"}</option> )	}
				</RB.FormSelect>
			</td>		
		</tr>
	    <tr >
			<td sm={labelCol}>
			<a href="https://users.ece.cmu.edu/~koopman/lfsr/index.html" target="_blank">LFSR Poly</a>
			</td>
			<td sm={inputCol}>
				<RB.FormControl onChange={ ev => props.upd('settings', {lfsrPoly: ev.target.value })} style={{'width':'100px'}} type="text"  value={props.lfsrPoly}   />
			</td>		
		</tr>
	    <tr className='clocks clock-top'>
			<td sm={labelCol}>
			Clocks
			</td>
			<td sm={inputCol}>
			<RB.FormSelect  onChange={ev => props.upd('clocks', parseInt(ev.target.value, 10))} value={props.clocks.length}>
			{ range(4).map(_ =>	<option key={_} value={_+1}>{_+1}</option> )	}
			</RB.FormSelect>
			</td>
		</tr>
		{ props.clocks.map((_,i) =>	
			<tr className={i==props.clocks.length-1?'clocks clock-bottom':'clocks'}><td sm={labelCol}>{Math.round(1000000*props.master/props.clocks[i])}
			</td><td sm={inputCol}>
			<RB.FormControl type="text" key={i} onChange={ev => props.upd('clock', [i, parseInt(ev.target.value)])} value={props.clocks[i]} />
			</td>
		</tr>)
		}
	    <tr>
			<td sm={labelCol}>
			Mixer width
			</td>
			<td sm={inputCol}>
			<RB.FormSelect onChange={ev => props.upd('settings', {mixer: parseInt(ev.target.value, 10)})} value={props.mixer}>
			{ range2(1,16).map(_ =>	<option key={_} value={_}>{_}</option> )	}
			</RB.FormSelect>
			</td>
		</tr>
	    <tr>
			<td sm={labelCol}>
			Vblank
			</td>
			<td sm={inputCol}>
			<RB.FormSelect onChange={ev => props.upd('settings', {framerate: parseInt(ev.target.value, 10)})} >
			{ [50,60].map(_ =>	<option key={_} value={_}>{_}</option> )	}
			</RB.FormSelect>
			</td>
		</tr>
	    <tr>
			<td sm={labelCol}>
			<RB.FormCheck onChange={ev => props.upd('settings', {swap: ev.target.checked})} checked={props.swap} >Swap MIDI</RB.FormCheck>
			</td>
			<td sm={inputCol}>
			<RB.FormSelect onChange={ev => props.upd('settings', {split: ev.target.value})} value={props.split}>
			{ range(7).map(_ => _? "Split at C" + _: 'No split').map(_ =>	<option key={_} value={_}>{_}</option> )	}
			</RB.FormSelect>
			</td>
		</tr>
		</tbody></RB.Table>
	}
//}
export const FoldableSettings = foldable(Settings);
