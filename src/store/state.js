import { playMode } from "common/js/config";
import { loadSearch, loadPlaySpoor } from "common/js/catch";
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
	playHistory: loadPlaySpoor() || []
}
export default state;