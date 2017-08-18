import {playMode} from "common/js/config";
import * as types from "./mutation-types";
import {shuffle} from "common/js/until";
import { savedSearch, deleteOneSearch } from "common/js/catch";
export const selectPlay = function( {commit, state}, {songs, index}) {
	if(state.mode==playMode.random) {
		commit(types.SET_MODE, playMode.random);
		let list=shuffle(songs)
		let Index=find(state.playList, songs[index])
		commit(types.SET_CURRENT_INDEX, Index);
		commit(types.SET_PLAY_LIST, state.playList);
	}
	else {
		if(state.mode==playMode.loop) {
			commit(types.SET_MODE, playMode.loop);
		}
		commit(types.SET_MODE, playMode.sequence);
		commit(types.SET_PLAY_LIST, songs);
		commit(types.SET_CURRENT_INDEX, index);
	}
	commit(types.SET_FULLSCREEN, true);
	commit(types.SET_PLAYING, true);
	commit(types.SET_SEQUENCE_LIST, songs);
}
export const insertPlay=function({commit, state}, song) {
	let songs=state.playList.slice()
	let currentIndex=state.currentIndex
	let index=find(songs, song)
	if(index!==-1) {
		//原数组有插入的歌曲，需先删除重复歌曲；
		songs.splice(index,1)
		if(index<=currentIndex) {
			//在currentIndex之前删除选项；
			currentIndex-=1;
		}
	}
	else {
		//原数组没有插入的歌曲
		
	}
	if(!songs.length) {
		currentIndex=0;
	}
	else{
		
		currentIndex+=1;	
	}
	console.log(currentIndex)
	songs.splice(currentIndex,0, song)
	commit(types.SET_FULLSCREEN, true);
	commit(types.SET_PLAYING, true);
	commit(types.SET_SEQUENCE_LIST, songs);
	commit(types.SET_PLAY_LIST, songs);
	commit(types.SET_CURRENT_INDEX, currentIndex);
}
export const randomPlay = function( {commit, state}, {songs}) {
	let list=shuffle(songs);
	commit(types.SET_CURRENT_INDEX, 0);
	commit(types.SET_PLAY_LIST, list);
	commit(types.SET_FULLSCREEN, true);
	commit(types.SET_PLAYING, true);
	commit(types.SET_SEQUENCE_LIST, songs);
	commit(types.SET_MODE, playMode.random);
}
export const savedSearchHistory= function({commit, state}, query) {
	commit(types.SET_SEARCH_HISTORY, savedSearch(query))
}
export const deleteOneSearchHistory= function({commit, state}, query) {
	commit(types.SET_SEARCH_HISTORY, deleteOneSearch(query))
}
export const deleteAllSearchHistory= function({commit, state}) {
	commit(types.SET_SEARCH_HISTORY, [])
}
function find(list, song) {
	return list.findIndex((item)=>{
			return item.id==song.id
		})
}