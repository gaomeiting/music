<template>
<div>
<transition name="list-fade">
<div class="playlist" v-if="flag">
	<div class="list-wrapper" @click.stop>
		<div class="list-header">
			<h1 class="title">
				<i class="iconfont icon" :class="changIcon" @click.stop="toggleModeChange"></i>
				<span class="text">{{ currentPlayMode }}</span>
				<span class="clear" @click.stop="clear"><i class="iconfont icon-shanchu icon-clear"></i></span>
			</h1>
		</div>
		<scroll :data="playList" ref="listContent" class="list-content">
			<transition-group ref="list" name="list" tag="ul">
				<li class="item" :key="item.id" v-for="(item, index) in playList" ref="songItem" @click.stop="currentSongChange(item)">
					  <i class="iconfont current" :class="{ 'icon-bofang' : currentSong.id===item.id }"></i>
					  <span class="text">{{item.name}}</span>
					  <span class="like" @click.stop="toggleFavorite(item)">
						<i :class="hasFavorite(item)"></i>
					  </span>
					  <span class="delete" @click.stop="deleteSong(item)">
						<i class="iconfont icon-tianjia icon-delete"></i>
					  </span>
				</li>
			</transition-group>
		</scroll>
		<div class="list-operate">
			<div class="add" @click.stop="showAddSong">
				<i class="icon-add"></i>
				<span class="text">添加歌曲到队列</span>
			</div>
		</div>
		<div class="list-close" @click.stop="hide()">
			<span>关闭</span>
		</div>
	</div>
	<confirm ref="confirm" text="是否清空播放列表" confirmBtnText="清空" @confirm="confirmClear"></confirm>
</div>
</transition>
<add-song ref="addSong"></add-song>
</div>

</template>

<script type="text/ecmascript-6">
import Scroll from "base/scroll/scroll";
import Confirm from "base/confirm/confirm";
import AddSong from "components/add-song/add-song";
import { mapGetters, mapActions } from "vuex";
import { playerMixin, favoriteMixin } from "common/js/mixin";
import {playMode} from 'common/js/config';
export default {
mixins: [playerMixin, favoriteMixin],

data() {
	return {
		flag: false
	}
},
computed: {
	currentPlayMode() {
		return this.mode=== playMode.sequence ? '顺序播放' :  this.mode===playMode.loop ? '单曲循环' : '随机播放'
	},
	...mapGetters([
		'currentSong'
	])
},

methods: {
	show() {
		this.flag=true;
		this.$nextTick(() => {
			this.refresh();
			this.scrollToElement()
		})
	},
	hide() {
		this.flag=false;
	},
	refresh() {
		this.$refs.listContent.refresh()
	},
	scrollToElement() {
		let list=this.mode===playMode.random ? this.sequenceList : this.playList
		let index=list.findIndex((item) => {
			return item.id==this.currentSong.id
		})
		this.$nextTick(()=> {
			this.$refs.listContent.scrollToElement(this.$refs.songItem[index],0)
		})
		
	},
	deleteSong(item) {
		if(this.playList.length==1) {
			this.hide()
		}
		this.deleteOneSong(item)
	},
	clear() {
		this.$refs.confirm.show()
	},
	confirmClear() {
		this.deleteAllSongs();
		this.hide();
	},
	currentSongChange(item) {
		this.$emit('currentSongChange', item)
	},
	toggleModeChange() {
		this.toggleMode();
		this.scrollToElement();
	},
	showAddSong() {
		this.$refs.addSong.show()
		this.hide()
	},
	...mapActions([
		'deleteOneSong',
		'deleteAllSongs'
	])
},
components: {
	Scroll,
	Confirm,
	AddSong
}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";
@import "~common/scss/mixin";

.playlist {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 200;
	background-color: $color-background-d;
	&.list-fade-enter-active, &.list-fade-leave-active {
		transition: opacity 0.3s;
		.list-wrapper {
			transition: all 0.3s;
		}
	}
	&.list-fade-enter, &.list-fade-leave-to {
		opacity: 0;
		.list-wrapper {
			transform: translate3d(0, 100%, 0);
		}
	}
	.list-wrapper {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: $color-highlight-background;
		.list-header {
			position: relative;
			padding: 20px 30px 10px 20px;
			.title {
				display: flex;
				align-items: center;
				.icon {
					margin-right: 10px;
					font-size: 30px;
					color: $color-theme-d;
				}
				.text {
					flex: 1;
					font-size: $font-size-medium;
					color: $color-text-l;
				}
				.clear {
					@include extend-click();
					.icon-clear {
						font-size: $font-size-medium;
						color: $color-text-d;
					}
				}
			}
		}
		.list-content {
		    max-height: 240px;
		    overflow: hidden;
			.item {
				display: flex;
				align-items: center;
				height: 40px;
				padding: 0 30px 0 20px;
				overflow: hidden;
				&.list-enter-active, &.list-leave-active {
					transition: all 0.1s;
				}
				&.list-enter, &.list-leave-to {
					height: 0;
				}
				.current {
					flex: 0 0 20px;
					width: 20px;
					font-size: $font-size-small;
					color: $color-theme-d;
				}
				.text {
					flex: 1;
					@include no-wrap();
					font-size: $font-size-medium;
					color: $color-text-d;
				}
				.like {
				@include extend-click();
				margin-right: 15px;
				font-size: $font-size-small;
				color: $color-theme;
					.icon-favorite {
						color: $color-sub-theme;
					}
				}
				.delete {
				@include extend-click();
				font-size: $font-size-small;
				color: $color-theme;
				transform: rotate(45deg);
				}
			}
	             }
		.list-operate {
			width: 140px;
			margin: 20px auto 30px auto;
			.add {
				display: flex;
				align-items: center;
				padding: 8px 16px;
				border: 1px solid $color-text-l;
				border-radius: 100px;
				color: $color-text-l;
				.icon-add {
					margin-right: 5px;
					font-size: $font-size-small-s;
				}
				.text {
					font-size: $font-size-small;
				}
			}
		}
		.list-close {
			text-align: center;
			line-height: 50px;
			background: $color-background;
			font-size: $font-size-medium-x;
			color: $color-text-l;
		}
             }
	
}
</style>