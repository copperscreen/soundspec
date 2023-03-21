import {clone, log} from './func';

export var persister = {
	Controls: {},
	Data: {},
	Load(ev){
		var target = ev.target;
		var file = target.files[0];
		if (!file)return;
		var fr = new FileReader();
		fr.onload = e => {
			var lines = e.target.result;
			this.Data = JSON.parse(lines); 
			for(var i in this.Controls){
				var ctrl = this.Controls[i];
				//console.log(ctrl, this.Data[i]);
				if (ctrl.constructor.name == "Envelope") ctrl.notify = true;
				ctrl.setState(clone(this.Data[i]));
				this.Data[i] = undefined;
			}
			log(soundEngine);
		};
		fr.readAsText(file);

		//(a,b)=>console.log(a,b)||(a.target.value="")
	},
	Save(){
		this.Data = {};
		for(var i in this.Controls){
			this.Data[i] = this.Controls[i].state;
		};
	    var a = document.createElement("a");
		var file = new Blob([JSON.stringify(this.Data)], {type: 'text/plain'});
		//var file = new Blob([JSON.stringify(this.Data)], {type: 'application/octet-stream'});
		a.href = URL.createObjectURL(file);
		a.download = 'settings.txt';
		a.click();

	},
	Reg(ctrl){
		var key = ctrl.getKey();
		this.Controls[key] = ctrl;
		if (this.Data[key]){
			var data = clone(this.Data[key]);
			setTimeout( () => (ctrl.notify = true) && ctrl.setState(data), 0);
			this.Data[key] = undefined;
		}
	},
	Swap(src, dst){
		//dst = parseInt(dst,10)-1;
		var delayed = [];
		for(var c1 in this.Controls){
			var ctrl1 = this.Controls[c1];
			if (ctrl1.constructor.name == "Instrument" && ctrl1.props.index == src){
				for(var c2 in this.Controls){
					var ctrl2 = this.Controls[c2];
					if (ctrl2.constructor.name == "Instrument" && ctrl2.props.index == dst){
						ctrl1.setState(clone(ctrl2.state));
						ctrl2.setState(clone(ctrl1.state));
					}
				}
			}
			else if (ctrl1.constructor.name == "Envelope" && ctrl1.props.instrument == src){
				var found = false;
				for(var c2 in this.Controls){
					var ctrl2 = this.Controls[c2];
					if (ctrl2.constructor.name == "Envelope" && ctrl2.props.instrument == dst && ctrl1.props.voice == ctrl2.props.voice && ctrl1.props.index == ctrl2.props.index){
						ctrl1.notify = ctrl2.notify = true;
						ctrl1.setState(clone(ctrl2.state));
						ctrl2.setState(clone(ctrl1.state));
						found = true;
					}
				}
				if (!found){
					delayed.push( { 'state' : clone(ctrl1.state), 'instr': dst, 'voice': ctrl1.props.voice, 'index': ctrl1.props.index});
					delayed.push( { 'state' : clone(ctrl2.state), 'instr': src, 'voice': ctrl1.props.voice, 'index': ctrl1.props.index});
				}
			}
		}
		if (delayed.length){
			setTimeout( () =>{
				for(var cmd of delayed)
					for(var id in this.Controls){
						var ctrl = this.Controls[id];
						if (ctrl.constructor.name != "Envelope") continue;
						var props = ctrl.props;
						if (props.instrument == cmd.instr && props.voice == cmd.voice && props.index == cmd.index) ctrl.setState(cmd.state);
					}
			},0);
		}
		log('swap',src,dst);
	}
};
