import fs from 'fs';
import got from 'got';
let paths = ['build/', 'src/', 'offline/'];
let from = 'index.html';//process.argv[2];
let to = 'offline/index.html';//process.argv[3];
let load = async name =>{
	try{
		if (name.startsWith('http:') || name.startsWith('https:')){
			return (await got(name)).body;
		}
	}catch (ex){console.log(ex)}
	for(var path of paths){
		try{
			return fs.readFileSync(path + name, { encoding: 'utf8'});
		}catch{}
	}
}
let data = await load(from);
let mapping = [
	[/<link[^>]+href="\/?([^"]+).css"[^>]*>/g, '.css', '\r\n<style>', '</style>\r\n'], 
//	[/<script[^>]+src="\/?([^"]+)" *>/g, '', '\r\n<script type="text/javascript">', '</script>\r\n']
	[/<script[^>]+src="\/?([^"]+)"[^>]*>(?:<\/script>)?/g, '', '\r\n<script type="text/javascript">', '</script>\r\n']

];
let matched;
for(const part of mapping){
    for(let matched of part[0][Symbol.matchAll](data)){
	const included = await load(matched[1] + part[1]);
        console.log(matched[0], matched[1], included.length);
	let index = data.indexOf(matched[0]);
	data = data.substring(0, index) + part[2] + included + part[3] + data.substring(index + matched[0].length);
    }
}
fs.writeFileSync(to, data);
