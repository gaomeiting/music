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
		this.handlePlayList(this.playList);
	},
	activated() {
		this.handlePlayList(this.playList);
	},
	
	watch: {
		playList(newVal) {
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
export const favoriteMixin = {
	computed: {
		...mapGetters([
			'favoriteList'
		])
	},
	methods: {
		hasFavorite(song) {
			//console.log(this.isFavorite(song))
			let isFavorite=this.isFavorite(song);
			if(isFavorite) {
				return  'icon iconfont icon-xiai icon-favorite'
			}
			else {
				return  'icon iconfont icon-xiai'
			}
		},
		toggleFavorite(song) {
			let isFavorite=this.isFavorite(song);
			if(isFavorite) {
				this.deleteFavorite(song)
			}
			else {
				this.savedFavorite(song)
			}
		},
		isFavorite(song) {
			let favoriteList= this.favoriteList;
			let index=favoriteList.findIndex((item)=> {
				return item.id===song.id
			})
			return index !==-1
		},
		...mapActions([
			'savedFavorite',
			'deleteFavorite'
		])
	}
};