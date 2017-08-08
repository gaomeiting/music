<template>
<transition name="slide">
	<music-list :songs="data" :title="title" :bgImage="bgImage"></music-list>
</transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer";
import { getDiscDetail } from "api/recommend";
import { ERR_OK } from "api/config";
import { CreateSong } from "common/js/song";
import MusicList from "components/music-list/music-list";
export default {
	created() {
		this._getDiscDetail()
	},
	data() {
		return {
			data: []
		}
	},
	methods: {
		_getDiscDetail() {
			getDiscDetail(this.disc.dissid).then(res => {
				if(res.code=== ERR_OK) {
					this.data=this._normalizeData(res.cdlist[0].songlist)
				}
			}).catch(err => {
				console.log(err)
			})
		},
		_normalizeData(list) {
			let ret=[]
			list.forEach((musicData) => {
			          if (musicData.songid && musicData.albummid) {
			           	ret.push(CreateSong(musicData))
				}
			})
			return ret;
		}
	},
	components: {
		MusicList
	},
	computed: {
		title() {
			return this.disc.dissname
		},
		bgImage() {
			return this.disc.imgurl
		},
		...mapGetters ([
			'singer',
			'disc'
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