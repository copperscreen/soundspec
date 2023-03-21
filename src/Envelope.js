import React, { Component } from 'react';
import {soundEngine} from './soundEng';
import {clamp, range, clone} from './func';
import {persister} from './persister';


var partition = function(arr,i){ return { 'left': arr.slice(0,i), 'right': arr.slice(i+1)};};

class Point{
	constructor(x,y, maxX){
		this.I = Point.i++;
		this.X = clamp(0,x,maxX);
		this.Y = clamp(0,y, maxHeight);
	}
}
Point.i = 0;
const maxLen = 500;

const maxHeight = 100;
const padX = 10;
const padY = 10;
const X = (_) => _ + padX;
const Y = (_) => maxHeight - _ + padY;


export class Envelope extends Component {
	constructor(props){
		super(props);
		this.undo = [];
		var max = props.max;
		soundEngine.update('envelope',
			this.state = { 'length': 200, 'left':0, 'right': 100, 'dragging':undefined, 'points':[new Point(0,this.props.defaultVal, maxLen),new Point(150,this.props.defaultVal, maxLen)] },
			this.props.instrument, this.props.voice, this.props.index
		);
		this.dnd = {};
		persister.Reg(this);
	}
	getKey(){
		return 'env_' + this.props.instrument + '_' + this.props.voice + '_' + this.props.index;
	}
	componentDidUpdate(prevProps,prevState){
		if (this.notify){
			this.notify = undefined;
			this.changed = undefined;
			soundEngine.update('envelope',this.state, this.props.instrument, this.props.voice, this.props.index);
			if ( this.props.stateChange) this.props.stateChange(this.state);
		}
	}
	componentWillUpdate(nextProps, nextState){
		if (this.step){
			var cloned = clone(this.state);
			cloned.dragging = undefined;
			this.undo.push(cloned);
			this.step = undefined;
		}
	};
	undo1(){
		if (this.props.off) return;
		var lastState = this.undo && this.undo.pop();
		if (lastState){
			this.notify = true;
			if (this.undo.length){
				var last = this.undo[this.undo.length-1];
			}
			this.setState(lastState);
		}
	};
	upListener(e){
			this.notify=true;
			if(this.state.dragging == 'left'){
			}else if(this.state.dragging == 'right'){
			}else if(this.state.points[this.state.dragging]){
			}else if(this.state.dragging == 'length'){
			}else{
				this.notify=undefined;
			}
			window.removeEventListener('mouseup', this.upListener);
			window.removeEventListener('mousemove', this.moveListener);
			this.setState({'dragging': undefined});
	};
	moveListener(e){
		if(this.state.dragging == 'left'){
			this.setState({'left': clamp(0, this.state.right, e.clientX - this.dnd.clientX + this.dnd.initialLeft, this.state.right)});
		}else if(this.state.dragging == 'right'){
			this.setState({'right': clamp(this.state.left, e.clientX - this.dnd.clientX + this.dnd.initialRight, maxLen)});
		}else if(this.state.dragging == 'length'){
			const newLen = clamp(0, e.clientX - this.dnd.clientX + this.dnd.initialLength, maxLen);
			var index = this.state.points.findIndex(_ => _.X >= newLen);
			var state = {'length': newLen};
			if (index > -1){
				var newPoints = this.state.points.slice(0,index);
				newPoints.push(new Point(newLen, this.state.points[index].Y, this.state.length));
				state.points = newPoints;
			}
			if (this.state.right > newLen) state.right = newLen;
			if (this.state.left > newLen) state.left = newLen;
			this.setState(state);
		}else if(this.state.dragging === undefined){
			
		}else{
			const oldPoint = this.state.points[this.state.dragging];
			const newPoint = new Point(e.clientX - this.dnd.clientX + this.dnd.initialX, -e.clientY + this.dnd.clientY + this.dnd.initialY, this.state.length);
			const parts = partition(this.state.points,this.state.dragging);
			this.setState({'points': parts.left.concat(newPoint).concat(parts.right)});
		}

	}
	startDragging(e){
		this.step=true;
		this.dnd.clientX = e.clientX;
		this.dnd.clientY = e.clientY;
		window.addEventListener('mouseup', this.upListener.bind(this));
		window.addEventListener('mousemove', this.moveListener.bind(this));
	}
    downLeft(e){
		if (this.props.off) return;
		this.dnd.initialLeft = this.state.left;
		this.startDragging(e);
		this.setState({'dragging': 'left'});
    }
    downRight(e){
		if (this.props.off) return;
		this.dnd.initialRight = this.state.right;
		this.startDragging(e);
		this.setState({'dragging': 'right'});
    }
    downLast(e){
		if (this.props.off) return;
		this.dnd.initialLength = this.state.length;
		this.startDragging(e);
		this.setState({'dragging': 'length'});
    }
    downPoint(e){
		if (this.props.off) return;
		e.preventDefault();
		if (e.button == 1){//del
			if (this.state.points.length>2){
				this.step = this.notify = true;
				var index = parseInt(e.target.getAttribute('data-index'),10);
				var parts = partition(this.state.points, index);
				this.setState({'points': parts.left.concat(parts.right)});
			}
		}else if (!e.button){
			var index = parseInt(e.target.getAttribute('data-index'),10);
			this.dnd.initialX = this.state.points[index].X;
			this.dnd.initialY = this.state.points[index].Y;
			this.startDragging(e);
			this.setState({'dragging': index});
		}
    }
	clickNew(e){
		if (this.props.off) return;
		this.step = this.notify =true;
		const ctm = e.target.getScreenCTM();
		const offsetX = ctm.e;
		const offsetY = ctm.f
		this.setState({'points': this.state.points.concat(new Point(e.clientX - offsetX - padX, maxHeight - (e.clientY - offsetY) + padY, this.state.length)).sort( (a,b) => a.X > b.X)});
	}
    render() {
	var vgrid = range(Math.floor(1 + this.state.length / 50)).map(_ => "M"+(50*_ + 10)+" 10 v 100" );
	var hgrid = range(5).map(_ => "M10 "+(20*_+10)+" h " + this.state.length );
	var lastTriangle = "M " + (this.state.length + padX) + " " + (- 30 + maxHeight / 2 ) + " l 0 60 l 10 -30";
	var point = _ => X(_.X) + " " + Y(_.Y);
	var line = "M " + point(this.state.points[0]) +  " " + this.state.points.slice(1).map(point).join(' ');
	var style = clone(this.props.inline) || {};
	if (this.props.off) style.filter = "blur(1px)";
        return <svg  className={this.props.sustain?'envelope':'envelope nosustain'} style={style} width={this.state.length + 2 * padX} height="110">
<style>
{'.control { cursor: pointer}'}
</style>
<g>
<rect className='sustain' fill="pink" stroke="#fff" strokeWidth="0" strokeOpacity="null" x={this.state.left + 10} y="10" width={this.state.right - this.state.left - 10} height="100" opacity="1"/>
<path strokeWidth="1px" stroke="lime" d={line} fill="transparent"/>
<path strokeWidth="1px" stroke="navy" d={"M10 10 v100 h" + this.state.length} fill="transparent"/>
<path strokeWidth="1px" stroke="silver" d={vgrid} fill="transparent"/>
<path strokeWidth="1px" stroke="silver" d={hgrid} fill="transparent"/>
<text fill="#000000" stroke="#000" strokeWidth="0" stroke-opacity="0.2" fillOpacity="0.3" x="11" y="60" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" >{this.props.text}</text>
<rect fill="transparent"  stroke="transparent" strokeWidth="0" strokeOpacity="1" x="0" y="0" width="510" height="110" opacity="0.5" onClick={this.clickNew.bind(this)} />
<rect className='sustain' fill="red" stroke="#fff" strokeWidth="0" strokeOpacity="null" x={this.state.left} y="0" width="10" height="10" opacity="1" onMouseDown={this.downLeft.bind(this)}/>
<rect className='sustain' fill="red" stroke="#fff" strokeWidth="0" strokeOpacity="null" x={this.state.right} y="0" width="10" height="10" opacity="1" onMouseDown={this.downRight.bind(this)}/>
{
	this.state.points.map((_,i) => <circle className="control" cx={X(_.X)} cy={Y(_.Y)} r="3" key={_.I} data-index={i} onMouseDown={this.downPoint.bind(this)} />)
}
<path strokeWidth="1px" stroke="lime" d={lastTriangle} fill="lime" onMouseDown={this.downLast.bind(this)} ><title>Set envelope length</title></path>
<rect fill={(this.undo && this.undo.length)?"green":"red"} stroke="#fff" strokeWidth="0" strokeOpacity="null" x="0" y={maxHeight} width="10" height="10" opacity="1" onMouseDown={this.undo1.bind(this)} ><title>Undo</title>X</rect>
</g>
		</svg>;
    }
}
