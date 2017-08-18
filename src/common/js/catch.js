import storage from "good-storage";
const SEARCH_KEY='__search__';
const SEARCH_LENGTH=15;
function insertArray(arr, item, compare, maxLen) {
	let index=arr.findIndex(compare)
	if(index !== -1) {
		arr.splice(index, 1)
	}
	arr.unshift(item)
	if(maxLen && arr.length > maxLen) {
		arr.pop()
	}
	return arr;
}
function deleteArray(arr, item, compare) {
	let index=arr.findIndex(compare)
	if(index===-1) return;
	arr.splice(index, 1)
	return arr;
}
export function savedSearch (query) {
	let ret_searches=[]
	let searches=storage.get(SEARCH_KEY,[])
	ret_searches=insertArray(searches, query, (item) => {
		return item===query
	}, SEARCH_LENGTH)
	storage.set(SEARCH_KEY, ret_searches)
	return ret_searches;
}
export function loadSearch () {
	let searches=storage.get(SEARCH_KEY,[])
	return searches;
}
export function deleteOneSearch(query) {
	let searches=storage.get(SEARCH_KEY, []);
	let ret_arr=deleteArray(searches, query, (item) => {
			return item===query
		})
	storage.set(SEARCH_KEY, ret_arr);
	return ret_arr;
}