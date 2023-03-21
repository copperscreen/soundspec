export function Octave(props) {	
	var mode = props.pressed.map(_ => "k" + _).join(' ') + " " +props.keys + (props.upper?" upper ":"");
	//	<style>	  #low2, #high1, #high2 {display:none}	</style>
	return <svg className="octave" viewBox="0 0 210 105">
	<g className={mode}>
		<line id="svg_10" fill="none" stroke="#000" strokeLinecap="null" strokeWidth="1.5" x1="29.5" x2="30" y1="50" y2="100"/>
		<line id="svg_11" fill="none" stroke="#000" strokeLinecap="null" strokeWidth="1.5" x1="59.5" x2="60" y1="50" y2="100"/>
		<line id="svg_12" fill="none" stroke="#000" strokeLinecap="null" strokeWidth="1.5" x1="90" x2="90" y1="0" y2="100"/>
		<line id="svg_13" fill="none" stroke="#000" strokeLinecap="null" strokeWidth="1.5" x1="120.5" x2="121" y1="50" y2="100"/>
		<line id="svg_14" fill="none" stroke="#000" strokeLinecap="null" strokeWidth="1.5" x1="149.5" x2="150" y1="50" y2="100"/>
		<line id="svg_15" fill="none" stroke="#000" strokeLinecap="null" strokeWidth="1.5" x1="180" x2="180" y1="50" y2="100"/>
		<g id="white">
			<rect height="99.24048" id="svg_4" width="29.36708" fill="none" opacity="0.5" stroke="#fff" strokeOpacity="null" strokeWidth="0" x="0.37101" y="-0.03163"/>
			<rect height="99.24048" id="svg_29" width="29.36708" fill="none" opacity="0.5" stroke="#fff" strokeOpacity="null" strokeWidth="0" x="30.21699" y="-0.03163"/>
			<rect height="99.24048" id="svg_30" width="29.36708" fill="none" opacity="0.5" stroke="#fff" strokeOpacity="null" strokeWidth="0" x="60.06298" y="-0.03163"/>
			<rect height="99.24048" id="svg_31" width="29.36708" fill="none" opacity="0.5" stroke="#fff" strokeOpacity="null" strokeWidth="0" x="90.21665" y="-0.03163"/>
			<rect height="99.24048" id="svg_32" width="29.36708" fill="none" opacity="0.5" stroke="#fff" strokeOpacity="null" strokeWidth="0" x="120.37032" y="-0.03163"/>
			<rect height="99.24048" id="svg_33" width="29.36708" fill="none" opacity="0.5" stroke="#fff" strokeOpacity="null" strokeWidth="0" x="150.2163" y="-0.03163"/>
			<rect height="99.24048" id="svg_34" width="29.36708" fill="none" opacity="0.5" stroke="#fff" strokeOpacity="null" strokeWidth="0" x="180.06228" y="-0.03163"/>
		</g>
		<g id="black">
			<rect height="50" id="svg_5" width="20" fill="#000" stroke="#fff" strokeWidth="0" x="20" y="0"/>
			<rect height="50" id="svg_6" width="20" fill="#000" stroke="#fff" strokeWidth="0" x="50" y="0"/>
			<rect height="50" id="svg_7" width="20" fill="#000" stroke="#fff" strokeWidth="0" x="110" y="0"/>
			<rect height="50" id="svg_8" width="20" fill="#000" stroke="#fff" strokeWidth="0" x="140" y="0"/>
			<rect height="50" id="svg_9" width="20" fill="#000" stroke="#fff" strokeWidth="0" x="170" y="0"/>
		</g>
		<g id="low1">
			<text id="svg_16" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="6.5" y="89">Z</text>
			<text id="svg_17" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="37.5" y="89">X</text>
			<text id="svg_18" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="67.5" y="89">C</text>
			<text id="svg_19" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="98.5" y="89">V</text>
			<text id="svg_20" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="127.5" y="89">B</text>
			<text id="svg_21" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="157.5" y="89">N</text>
			<text id="svg_22" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="186.5" y="89">M</text>
			<text id="svg_23" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="22.5" y="35">S</text>
			<text id="svg_24" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="51.5" y="35">D</text>
			<text id="svg_25" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="110.5" y="35">G</text>
			<text id="svg_26" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="141.5" y="35">H</text>
			<text id="svg_27" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="173.5" y="35">J</text>
		</g>
		<g id="low2">
			<text id="svg_16" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="6.5" y="89">,</text>
			<text id="svg_17" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="37.5" y="89">.</text>
			<text id="svg_18" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="67.5" y="89">/</text>
			<text id="svg_23" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="22.5" y="35">l</text>
			<text id="svg_24" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="51.5" y="35">;</text>
		</g>
		<g id="high1">
			<text id="svg_16" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="6.5" y="89">Q</text>
			<text id="svg_17" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="34.5" y="89">W</text>
			<text id="svg_18" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="67.5" y="89">E</text>
			<text id="svg_19" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="98.5" y="89">R</text>
			<text id="svg_20" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="127.5" y="89">T</text>
			<text id="svg_21" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="157.5" y="89">Y</text>
			<text id="svg_22" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="185.5" y="89">U</text>
			<text id="svg_23" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="22.5" y="35">2</text>
			<text id="svg_24" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="52.5" y="35">3</text>
			<text id="svg_25" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="112.5" y="35">5</text>
			<text id="svg_26" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="142.5" y="35">6</text>
			<text id="svg_27" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="173.5" y="35">7</text>
		</g>
		<g id="high2">
			<text id="svg_16" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="6.5" y="89">I</text>
			<text id="svg_17" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="37.5" y="89">O</text>
			<text id="svg_18" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="67.5" y="89">P</text>
			<text id="svg_19" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="98.5" y="89">[</text>
			<text id="svg_20" fill="#000000" fillOpacity="null" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#000" strokeOpacity="null" strokeWidth="0" x="127.5" y="89">]</text>
			<text id="svg_23" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="22.5" y="35">9</text>
			<text id="svg_24" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="51.5" y="35">0</text>
			<text id="svg_25" fill="#ffffff" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" stroke="#fff" strokeWidth="0" x="110.5" y="35">=</text>
		</g>
		<line id="svg_28" fill="none" stroke="#000" strokeLinecap="null" strokeWidth="1.5" x1="210" x2="210" y1="0" y2="100"/>
		<line id="svg_2" fill="none" stroke="#000" strokeLinecap="null" strokeWidth="1.5" x1="0" x2="210" y1="100" y2="100"/>
		<rect height="5" id="svg_3" width="212" fill="#ffaaff" stroke="#000" strokeWidth="1.5" x="-0.5" y="100"/>
	</g>
</svg>;
}
