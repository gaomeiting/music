import { playMode } from "common/js/config";
const state= {
	singer: {},
	playList: [],
	sequenceList: [],
	currentIndex: 0,
	playing: false,
	mode: playMode.sequence,
	fullScreen: false
}
export default state;