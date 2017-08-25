import { playMode } from "common/js/config";
import { loadSearch, loadPlaySpoor, loadFavoriteList } from "common/js/catch";
const state= {
	singer: {},
	playList: [],
	sequenceList: [],
	currentIndex: 0,
	playing: false,
	mode: playMode.sequence,
	fullScreen: false,
	disc: {},
	rank: {},
	searchHistory: loadSearch() || [],
	playHistory: loadPlaySpoor() || [],
	favoriteList: loadFavoriteList() || []
}
export default state;