import * as RB from 'react-bootstrap';
import {range, range2} from './func';
import {soundTypes, instrumentCount} from './const';


//oscillator{width,depth,clocks,noise{yes,no,optional}}
//'width':12, 'depth':3, 'clocks':[], 'noise':false 
export function OscillatorCfg(props){
	return <tr>
	<th>Width</th>
	<td> <RB.FormSelect  onChange={ev => props.upd('oscillator', ['width',  parseInt(ev.target.value, 10)], props.index)} value={props.width}>
		{ range2(4,14).map(_ =>	<option key={_} value={_}>{_ + " bit"}</option> )	}
		</RB.FormSelect>
	</td>
	<td>
	 <RB.FormSelect onChange={ev => props.upd('oscillator', ['depth', parseInt(ev.target.value, 10)], props.index)} value={props.depth}>
		{ range2(1,7).map(_ =>	<option key={_} value={_}>{_ + " bit"}</option> )	}
		</RB.FormSelect>
	</td>
	<td>
		<RB.FormCheck className="pwm" onChange={ev => props.upd('oscillator', ['pwm', ev.target.checked], props.index)}  checked={props.pwm}  readOnly/>
	</td>
	<td>
	 <RB.FormSelect onChange={ev => props.upd('oscillator', ['soundtype', ev.target.value], props.index)} value={props.soundtype}>
		{ soundTypes.map(_ =>	<option key={_} value={_}>{_}</option> )	}
		</RB.FormSelect >
	</td>
    <td className='use-clock'>
    { range(props.clocks).map((_, i) => 
	<RB.FormCheck onChange={ev => props.upd('useclocks', i, props.index)} 
		checked={props.useclocks.indexOf(_)>-1}  readOnly label={_}></RB.FormCheck>	
	)}
	</td></tr>
}
