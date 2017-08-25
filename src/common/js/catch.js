import storage from "good-storage";
const SEARCH_KEY='__search__';
const SEARCH_LENGTH=15;
const PLAY_KEY='__paly__';
const PLAY_HEIGHT=200;
const FAVORITE_KEY="__favorite__"
const FAVORITE_LENGTH=200
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
export function savedPlaySpoor(song) {
	let arr=storage.get(PLAY_KEY,[])
	let ret=insertArray(arr, song, (item) => {
		return item.id===song.id
	}, PLAY_HEIGHT)
	storage.set(PLAY_KEY, ret)
	return ret;
}
export function loadPlaySpoor() {
	let ret=storage.get(PLAY_KEY, [])
	return ret
}
export function savedFavoriteList(song) {
	let arr=storage.get(FAVORITE_KEY, [])
	let ret=insertArray(arr, song, (item) => {
			return song.id===item.id
		}, FAVORITE_LENGTH)
	storage.set(FAVORITE_KEY, ret)
	return ret;
}
export function deleteFavoriteList(song) {
	let arr=storage.get(FAVORITE_KEY, [])
	let ret=deleteArray(arr, song, (item)=> {
		return item.id===song.id
	})
	storage.set(FAVORITE_KEY, ret)
	return ret
}
export function loadFavoriteList(song) {
	return storage.get(FAVORITE_KEY, [])
}