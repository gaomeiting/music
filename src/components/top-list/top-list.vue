<template>
<transition name="slide">
	<music-list :songs="songs" :title="title" :bgImage="bgImage" :topList="topList"></music-list>
</transition>
</template>

<script type="text/ecmascript-6">
import MusicList from "components/music-list/music-list";
import {mapGetters} from "vuex";
import { getTopList } from "api/rank";
import {ERR_OK} from 'api/config'
import { CreateSong } from 'common/js/song'
export default {
	data() {
		return {
			songs: [],
			topList: true
		}
	},
	created() {
		this._getTopList(this.rank.id)
	},
	computed: {
		title() {
			return this.rank.topTitle
		},
		bgImage() {
			if(this.songs.length){
				return this.songs[0]['image']
			}
			return this.rank.picUrl
		},
		...mapGetters([
			'rank'
		])
	},
	methods: {
		_getTopList(id) {
			if(!id) {
				this.$router.push({path: '/rank'})
			}
			getTopList(id).then(res => {
				if(res.code===ERR_OK) {
					this.songs=this._normalizeTopList(res.songlist)
				}
				else {
					console.log(res.code)
				}
			}).catch(err => {
				console.log(err)
			})
		},
		_normalizeTopList(list) {
			let ret=[]
			list.forEach(item => {
				let musicData=item.data;
				if(musicData.albumid&&musicData.songid) {
					ret.push(CreateSong(musicData))
				}
			})
			return ret;

		}
	},
	
	components: {
		MusicList
	}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

.slide-enter-active, .slide-leave-active {
	transition: all .3s ease-out;	
}
.slide-enter, .slide-leave-to {
	transform: translate3d(100%, 0, 0);
}
</style>