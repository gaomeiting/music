import {playMode} from "common/js/config";
import * as types from "./mutation-types";
import {shuffle} from "common/js/until";
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
export const randomPlay = function( {commit, state}, {songs}) {
	let list=shuffle(songs);
	commit(types.SET_CURRENT_INDEX, 0);
	commit(types.SET_PLAY_LIST, list);
	commit(types.SET_FULLSCREEN, true);
	commit(types.SET_PLAYING, true);
	commit(types.SET_SEQUENCE_LIST, songs);
	commit(types.SET_MODE, playMode.random);
}
function find(list, song) {
	return list.findIndex((item)=>{
			return item.id==song.id
		})
}