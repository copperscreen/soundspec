import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
//import { render } from 'react-snapshot'
//import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

function dump(i,s){
	console.log(i,s);
}
window.addEventListener('load', function(){
const container = document.getElementById('root');
console.log('qqqq', container);
const root = ReactDOMClient.createRoot(container);
root.render(<App stateChange={dump} />);

//ReactDOM.render(<App stateChange={dump} />, document.getElementById('root'));
//render(<App stateChange={dump} />, document.getElementById('root'));
registerServiceWorker();
});