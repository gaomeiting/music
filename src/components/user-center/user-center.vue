<template>
<transition name="slide">
<div class="user-center">
	<div class="back" @click.stop="back">
		<i class="iconfont icon-chevron-thin-left icon-back"></i>
	</div>
	<div class="switches-wrapper">
		<switches :currentIndex="currentIndex" :switches="switches" @switchItem="switchItem"></switches>
	</div>
	<div ref="playBtn" class="play-btn" @click.stop="setRandomPlay">
	    <i class="icon-play"></i>
	    <span class="text">随机播放全部</span>
	</div>
	<div class="list-wrapper" ref="listWrapper">
		<scroll class="list-scroll" v-if="currentIndex==0" :data="favoriteList" ref="favoriteList">
			<div class="list-inner">
				<song-list :songs="favoriteList" @selectSong="selectSong"></song-list>
			</div>
		</scroll>
		<scroll class="list-scroll"  v-else :data="playHistory" ref="playHistory">
			<div class="list-inner">
				<song-list :songs="playHistory" @selectSong="selectSong"></song-list>
			</div>
		</scroll>
		<div class="no-result-wrapper">
			<no-result v-if="!noResult.len" :title="noResult.title"></no-result>
		</div>
	</div>
</div>
</transition>
</template>

<script type="text/ecmascript-6">
import Switches from "base/switches/switches";
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import NoResult from "base/no-result/no-result";
import {Song} from "common/js/song";
import {playlistMixin} from "common/js/mixin"
import {mapGetters, mapActions} from "vuex";
export default {
mixins: [playlistMixin],
data() {
	return {
		currentIndex: 0,
		switches: [
			{ name: '我喜欢的' },
			{ name: '最近听的' },
		]
	}
},
computed: {
	noResult() {
		let obj={}
		if(!this.currentIndex) {
			obj.len=this.favoriteList.length
			obj.title="您还没有收藏过音乐~~"
		}
		else{
			obj.len=this.playHistory.length
			obj.title="您还没有听过音乐~~"
		}
		return obj;
	},
	...mapGetters([
		'favoriteList',
		'playHistory'
	])
},
methods: {
	back() {
		this.$router.back()
	},
	switchItem(index) {
		this.currentIndex=index;
	},
	selectSong(item) {
		this.insertPlay(new Song(item))
	},
	setRandomPlay() {
		let songs=this.currentIndex===1 ? this._changeSong(this.playHistory) : this._changeSong(this.favoriteList)
		if(!songs.length) return;
		this.randomPlay({songs})
	},
	_changeSong(arr) {
		return arr.map((item) => {
				return new Song(item)
			})
	},
	handlePlayList(playlist) {
		let bot=playlist.length ? '60px' : 0;
		this.$refs.listWrapper.style.bottom=bot;
		this.$refs.playHistory&&this.$refs.playHistory.refresh()
		this.$refs.favoriteList&&this.$refs.favoriteList.refresh()
	},
	...mapActions([
		'insertPlay',
		'randomPlay'
	])
},
components: {
	Switches,
	Scroll,
	SongList,
	NoResult
}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";
.user-center {
	position: fixed;
	top: 0;
	bottom: 0;
	z-index: 100;
	width: 100%;
	background: $color-background;
	&.slide-enter-active, &.slide-leave-active {
	  transition: all 0.3s ease-out;
	}
	&.slide-enter, &.slide-leave-to {
	  transform: translate3d(100%, 0, 0);
	}
	.back {
		position: absolute;
		top: 0;
		left: 6px;
		z-index: 50;
		.icon-back {
			display: block;
			padding: 10px;
			font-size: $font-size-large-x;
			color: $color-theme;
		}
	}
	.switches-wrapper {
	  	margin: 10px 0 30px 0;
	}
	.play-btn {
		box-sizing: border-box;
		width: 135px;
		padding: 7px 0;
		margin: 0 auto;
		text-align: center;
		border: 1px solid  $color-text-l;
		color: $color-text-l;
		border-radius: 100px;
		font-size: 0;
		.icon-play {
			display: inline-block;
			vertical-align: middle;
			margin-right: 6px;
			font-size: $font-size-medium-x;
		}
		.text {
			display: inline-block;
			vertical-align: middle;
			font-size: $font-size-small;
		}
	}
	.list-wrapper {
		position: absolute;
		top: 110px;
		bottom: 0;
		width: 100%;
		.list-scroll {
			height: 100%;
			overflow: hidden;
			.list-inner {
				padding: 20px 30px;
			}
		}
	 }
	.no-result-wrapper {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>