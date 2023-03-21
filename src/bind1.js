export function bindEngine(proxy, event){
		if (proxy.target.hasAttribute && proxy.target.hasAttribute('data-swap')){
			persister.Swap(proxy.target.getAttribute('data-swap'), proxy.target.textContent); 
			return;
		}
		if (proxy.type == "click" && proxy.target.nodeName != 'A') return;
		var changeTree = function(tree, path, setter){
			var field = path.shift();
			if (!path.length){
				tree[field] = setter(tree,field);
			}else{
				changeTree(tree[field], path, setter);
			}
			return tree;
		}
		var attr = function(node){ return target.getAttribute('data-hex') || target.getAttribute('data-field')||target.getAttribute('data-count')||target.getAttribute('data-set')||target.getAttribute('data-bool');}
		var target = proxy.target;
		while(target && !(target.getAttribute && attr(target))) target = target.parentNode;
		if (!target) return;

		var value = target.getAttribute('data-value') || proxy.target.value;
		var field = attr(target).split('.');
		var topField = field.shift();
		var change = {};
		var setter;
		if (target.getAttribute('data-bool')){
			value = target.getAttribute('data-value') || proxy.target.checked;
			setter = () => value;
		}else if (target.getAttribute('data-hex')){
			var number = parseInt(value);
			value = isNaN(number)?0:number;
			setter = () => value;
		}else if (target.getAttribute('data-field')){
			var number = parseFloat(value);
			if (!isNaN(number) && number == value) value = number;
			setter = () => value;
		}else if (target.getAttribute('data-count')){
			setter = (data,field) => (
						data[field].length<value?
						data[field].concat(Array(value-data[field].length).fill(0).map(_=>clone(this.defaults[field]))):
						data[field].slice(0, value)
					);
		}else if (target.getAttribute('data-set')){
			var number = parseFloat(value);
			if (!isNaN(number) && number == value) value = number;
			var op = target.checked?
						_=>_.concat(value).sort():
						_=>_.filter(_ => _!=value);
			setter = (data,field) => op(data[field]);
		}
		change[topField] = field.length?
							changeTree(clone(this.state[topField]), field, setter ):
							 setter(this.state,topField);
		if (event && event.preventDefault) event.preventDefault();
		if (proxy.preventDefault) proxy.preventDefault();
		proxy.stopPropagation();
		this.changed = true;
		this.setState(change);
}
