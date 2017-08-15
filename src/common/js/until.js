export function shuffle (arr) {
	let _arr = arr.slice()
	let max= _arr.length-1;
	for (let i = 0; i < _arr.length; i++) {
		let j = getRandomInt(i, max)
		let t = _arr[i]
		_arr[i] = _arr[j]
		_arr[j] = t
	}
	  return _arr
}
function getRandomInt(min,max){
	return Math.floor(Math.random()*Math.abs(min-max+1)+min)
}

export function debounce (fn, delay) {
	let timer;
	return function(...args) {
		if(timer) {
			clearTimeout(timer);
		}
		timer=setTimeout(()=>{
			fn.apply(this, args)
		},delay)	
	}
	
}