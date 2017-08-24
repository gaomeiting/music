import { mapGetters, mapMutations, mapActions } from "vuex";
import {playMode} from 'common/js/config';
import {shuffle} from 'common/js/until';
export const playlistMixin= {
	computed: {
		...mapGetters([
			'playList'
		])
	},
	mounted() {
		//console.log("mounted")
		this.handlePlayList(this.playList);
	},
	activated() {
		//console.log("activated")
		this.handlePlayList(this.playList);
	},
	
	watch: {
		playList(newVal) {
			//console.log("watch")
			this.handlePlayList(newVal);
		}
	},
	methods: {
		handlePlayList() {
			throw new Error('component must inplement handlePlayList')
		}
	}
};
export const playerMixin = {
	computed: {
		changIcon() {
			
			return this.mode == playMode.sequence ? 'icon-loop' : this.mode == playMode.loop ? 'icon-ttpodicon' : 'icon-xueshufeng-suijibofang'
		},
		...mapGetters([
			'currentSong',
			'playList',
			'sequenceList',
			'mode'
		])
	},
	methods: {
		toggleMode(){
			let n=(this.mode+1) % 3;
			let list=[];
			this.setMode(n);
			if(this.mode == playMode.random) {
				list=shuffle(this.sequenceList)
			}
			else {
				list=this.sequenceList
				
			}
			this._togglePlayList(list)
		},
		_togglePlayList(list) {
			let index=list.findIndex((item) => {
				return this.currentSong.id==item.id
			})
			this.setPlayList(list);
			this.setCurrentIndex(index);
			console.log(index, "setCurrentIndex")
		},
		...mapMutations({
			setMode: 'SET_MODE',
			setCurrentIndex: 'SET_CURRENT_INDEX',
			setPlayList: 'SET_PLAY_LIST'
		})
	}
};
export const searchMixin = {
	data() {
		return {
			query: ''
		}
	},
	computed: {
		...mapGetters([
			'searchHistory'
		])
	},
	methods: {
		beforeScrollStart() {
			this.$refs.searchBox.blur()
		}, 
		fadeOutSearch() {
			this.savedSearchHistory(this.query)
			if(this.$refs.topTip) {
				this.topTipShow()
			}
		},
		topTipShow() {
			this.$refs.topTip.show()
		},
		onQueryChange(query){
			this.query=query
			this.setQuery(query)
		},
		setQuery(item) {
			this.$refs.searchBox.setQuery(item)
		},
		...mapActions([
			'deleteOneSearchHistory',
			'savedSearchHistory'
		])
	}
};