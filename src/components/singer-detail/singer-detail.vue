<template>
<transition name="slide">
	<music-list :songs= "data" :title="title" :bgImage="bgImage"></music-list>
</transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer";
import { ERR_OK } from "api/config";
import { CreateSong } from "common/js/song";
import MusicList from "components/music-list/music-list";
export default {
	created() {
		this._getSingerDetail()
	},
	data() {
		return {
			data: []
		}
	},
	methods: {
		_getSingerDetail() {
			if(!this.singer.id) {
				this.$router.push({
					path: '/singer'
				})
				return;
			}
			getSingerDetail(this.singer.id).then((res) => {
				if(res.code === ERR_OK) {
					this.data=this._normalizeSongs(res.data.list);
				}
				else {
					console.log(res.code)
				}
			}).catch(err => {
				console.log(err)
			})
		},
		_normalizeSongs(list) {
			let ret=[]
			list.forEach(item => {
				let {musicData} = item;
				if(musicData.songid && musicData.albummid)  ret.push(CreateSong(musicData))
			
			}) 
			return ret
		}
	},
	components: {
		MusicList
	},
	computed: {
		title() {
			return this.singer.name
		},
		bgImage() {
			return this.singer.avatar
		},
		...mapGetters ([
			'singer'
		])
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