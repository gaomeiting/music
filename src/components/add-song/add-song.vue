<template>
<transition name="slide">
<div class="add-song" v-if="flag" @click.stop>
	<div class="header">
		<h1 class="title">添加歌曲到列表</h1>
		<div class="close" @click="hide()">
			<i class="iconfont icon-tianjia icon-close"></i>
		</div>
	</div>
	<div class="search-box-wrapper">
		<search-box ref="searchBox" placeholder="请输入歌曲" @queryChange="onQueryChange"></search-box>
	</div>
	<div class="shortcut" v-if="!query">
		<switches :switches="switches" :currentIndex="currentIndex" @switchItem="switchItem"></switches>
		<div class="list-wrapper">
			<scroll class="list-scroll"  v-if="currentIndex==0" :data="playHistory">
				<div class="list-inner">
					<song-list :songs="playHistory" @selectSong="selectSong"></song-list>
				</div>
			</scroll>
			<scroll class="list-scroll" v-else :data="searchHistory">
				<div class="list-inner">
					<search-list :searches="searchHistory" @deleteOne="deleteOneSearchHistory" @seletItem="onQueryChange"></search-list>
				</div>
			</scroll>
		</div>
	</div>
	<div class="search-result" v-else>
		<suggest :query="query" @beforeScrollStart='beforeScrollStart' @selectItem="fadeOutSearch"></suggest>
	</div>
	<top-tip ref="topTip">
		<p class="tip-title">
			<i class="icon-ok"></i>
			<span class="text">一首歌曲已经添加到播放列表</span>
		</p>
	</top-tip>
</div>
</transition>
</template>

<script type="text/ecmascript-6">
import Switches from "base/switches/switches";
import SearchBox from "base/search-box/search-box"
import Suggest from "components/suggest/suggest"
import SearchList from "base/search-list/search-list";
import SongList from "base/song-list/song-list";
import Scroll from "base/scroll/scroll";
import TopTip from "base/top-tip/top-tip";
import { searchMixin } from "common/js/mixin";
import { mapGetters, mapActions } from "vuex";
import { Song } from "common/js/song";
export default {
	mixins: [searchMixin],
	data() {
		return {
			flag: false,
			currentIndex: 0,
			switches: [{name: '最近播放'}, {name: '搜索历史'}],
			scrollToTop: true
		}
	},
	computed: {
		history() {
			return !this.currentIndex ? this.playHistory : this.searchHistory
			
		},
		...mapGetters([
			'playHistory'
		])
	},
	methods: {
		show() {
			this.flag=true;
		},
		hide() {
			this.flag=false;
		},
		switchItem(index) {
			this.currentIndex=index
		},
		selectSong(song, index) {
			if(!index) {
				return;
			}
			this.topTipShow()
			this.insertPlay(new Song(song))
		},
		
		...mapActions([
			'insertPlay'
		])
	},
	
	components: {
		Switches,
		SearchBox,
		Suggest,
		SearchList,
		SongList,
		Scroll,
		TopTip
	}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";
@import "~common/scss/mixin";

.add-song {
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	z-index: 200;
	background: $color-background;
	&.slide-enter-active, &.slide-leave-active{
	  transition: all 0.3s;
	}
	&.slide-enter, &.slide-leave-to{
	  transform: translate3d(100%, 0, 0);
	}
	.header {
		position: relative;
		height: 44px;
		text-align: center;
		.title {
			line-height: 44px;
			font-size: $font-size-large;
			color: $color-text;
		}
		.close {
			position: absolute;
			top: 0;
			right: 8px;
			transform: rotate(45deg);
			.icon-close {
				display: block;
				padding: 12px;
				font-size: 20px;
				color: $color-theme;
			}
		}
	}
	.search-box-wrapper {
		margin: 20px;
	}
	.shortcut {
		.list-wrapper {
			position: absolute;
			top: 165px;
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

	}
	.search-result {
		position: fixed;
		top: 124px;
		bottom: 0;
		width: 100%;
	}
	.tip-title {
		text-align: center;
		padding: 18px 0;
		font-size: 0;
		.icon-ok {
			font-size: $font-size-medium;
			color: $color-theme;
			margin-right: 4px;
		}
		.text {
			font-size: $font-size-medium;
			color: $color-text;
		}
	}
}
</style>