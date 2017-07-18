import OriginJsonp from 'jsonp';
export function jsonp(url, data, options) {
	url += url.indexOf("?") !==-1 ? "&" : "?" + params(data);
	return new Promise((resolve, reject) => {
		OriginJsonp(url, options, (err, data) => {
			if(!err){
				resolve(data);
			}
			else {
				reject(err)
			}
		})
	});
}
export function params(data) {
	let url=""
	for(let k in data){
		let val= !data[k] ? "" : data[k]
		let value=encodeURIComponent(val);
		url+=`&${k}=${value}`
	}
	return url ? url.substring(1) : '';
	
}