export const singer = state => state.singer;
export const playList = state => state.playList;
export const sequenceList = state => state.sequenceList;
export const currentIndex = state => state.currentIndex;
export const currentSong = state => {
	return state.playList[state.currentIndex] || {}
}
export const mode = state => state.mode;
export const playing = state => state.playing;
export const fullScreen = state => state.fullScreen;
export const disc = state => state.disc;
export const rank= state=>state.rank;
export const searchHistory = state => state.searchHistory;
export const playHistory =state=> state.playHistory;
export const favoriteList = state => state.favoriteList;