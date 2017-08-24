<template>
 <div class="player" v-show="playList.length > 0" @click.stop="hideList">
 <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
 	<div class="normal-player" v-show="fullScreen">
 		<div class="background">
 			<img width="100%" height="100%" :src="currentSong.image" alt="">
 		</div>
 		<div class="top">
 			<div class="back" @click.stop.prevent="back">
 				<i class="icon-back iconfont icon-chevron-thin-left"></i>
 			</div>
 			<h1 class="title" v-html="currentSong.name"></h1>
 			<h2 class="subtitle" v-html="currentSong.singer"></h2>
 		</div>
 		<div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
 			<div class="middle-l" ref="middleL">
 				<div class="cd-wrapper" ref="cdWrapper">
 					<div class="cd" :class="cdCls">
 						<img class="image" :src="currentSong.image">
 					</div>
 					<div class="playing-lyric-wrapper">
					              <div class="playing-lyric"><!-- {{playingLyric}} --></div>
					</div>
 				</div>
 				<div class="playing-lyric-wrapper">
			             		<div class="playing-lyric">{{playingLyric}}</div>
			            	</div>
 			</div>
 			<scroll class="middle-r" ref="lyricList" :data="lyric && lyric.lines">
			            <div class="lyric-wrapper">
            				             <div v-if="lyric">
            					                <p ref="lyricLine" class="text" :class="{'current' : currentLine==index}" v-for="(lyricLine,index) in lyric.lines"> {{lyricLine.txt}}</p>
            				             </div>
			            </div>
			</scroll>
 		</div>
 		<div class="bottom">
			<div class="dot-wrapper">
			    <span class="dot" :class="{active : currentShow=='cd'}"></span>
			    <span class="dot" :class="{active : currentShow=='lyric'}"></span>
			</div>
			<div class="progress-wrapper">
				<span class="time time-l">{{ currentTime }}</span>
				<div class="progress-bar-wrapper">
				  	<progress-bar :percent="percent" @triggerPercent="setSongProgress"></progress-bar>
				</div>
				<span class="time time-r">{{ format(currentSong.duration) }}</span>
			</div>
			<div class="operators">
				<div class="icon i-left" @click.stop.prevent="toggleMode">
					<i class="iconfont" :class="changIcon"></i>
				</div>
				<div class="icon i-left" :class="disableCls" @click.stop.prevent="prev">
					<i class="icon-prev iconfont icon-kuaitui"></i>
				</div>
				<div class="icon i-center" :class="disableCls" @click.stop.prevent="togglePlaying">
					<i class="iconfont" :class="playIcon"></i>
				</div>
				<div class="icon i-right" :class="disableCls" @click.stop.prevent="next">
					<i class="icon-next iconfont icon-kuaijin"></i>
				</div>
				<div class="icon i-right">
					<i class="icon iconfont icon-xiai"></i>
				</div>
			</div>
 		</div>
 	</div>
 </transition>
 <transition name="mini">
 	<div class="mini-player" @click.stop.prevent="open" v-show="!fullScreen">
 		<div class="icon">
		          <img width="40" height="40" :src="currentSong.image" :class="cdCls">
		</div>
		<div class="text">
			<h2 class="name" v-html="currentSong.name"></h2>
			<p class="desc" v-html="currentSong.singer"></p>
		</div>
        		<div class="control" @click.stop.prevent="togglePlaying">
			<progress-circle :radius="radius" :percent="percent">
		          		<i class="iconfont icon-mini" :class="playIcon"></i>
		          	</progress-circle>
		</div>
		<div class="control" @click.stop="showList">
		          <i class="iconfont icon-liebiao icon-playlist"></i>
		</div>
 	</div>
 </transition>
 <play-list ref="playList" :playList="playList" @currentSongChange="currentSongChange"></play-list>
 <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
 </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from "vuex";
import {prefixStyle} from 'common/js/dom';
import {playMode} from 'common/js/config';
import Scroll from 'base/scroll/scroll';
import PlayList from "components/play-list/play-list";
import ProgressBar from 'base/progress-bar/progress-bar';
import ProgressCircle from 'base/progress-circle/progress-circle';
import animations from 'create-keyframe-animation';
import Lyric from 'lyric-parser';
import { playerMixin } from "common/js/mixin";
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
	mixins: [playerMixin],
	data() {
		return {
			songReady: false,
			currentTime: '0:00',
			percent: 0,
			radius: 32,
			lyric: null,
			currentLine: 0,
			currentShow: 'cd',
			playingLyric: ''
		}
	},
	created() {
		this.touch={}
	},
	computed: {
		disableCls() {
			return this.songReady ? '' : 'disable'
		},
		cdCls() {
			return this.playing ? 'play' : 'play pause'
		},
		playIcon() {
			return this.playing ? 'icon-zanting' : 'icon-bofang'
		},
		
		...mapGetters([
			'fullScreen',
			'playList',
			'currentIndex',
			'playing'
		])
	},
	watch: {
		currentSong(newSong, oldSong) {
			if(!newSong.id) {
				return;
			}
			if(newSong.id === oldSong.id) {
				return;
			}
			if(this.lyric) {
				this.lyric.stop()
			}
			this.$nextTick(() => {
				const audio=this.$refs.audio;
				audio.play()
				this.setPlaying(true)
				this.getLyric(newSong)
				this.savedPlayHistory(newSong)
			})
			
		},
		playing(newPlaying) {
			this.$nextTick(()=> {
				const audio=this.$refs.audio;
				newPlaying ? audio.play() : audio.pause()
			})
		}
	},
	methods: {
		back() {
			this.setFullScreen(false)
		},
		open() {
			this.setFullScreen(true)
		},
		enter(el, done) {
			const { x, y, scale }=this._getPosAndScale();
			let animation = {
				0:  { 
					transform: `translate3d(-${x}px, ${y}px, 0) scale(${scale})`
				 },
				60: {
					transform: `translate3d(0, 0, 0) scale(1.1)`
				},
				100:  { 
					transform: `translate3d(0, 0, 0) scale(1)`
				}
			}
			animations.registerAnimation({
				name: 'move',
				animation,
				presets: {
					duration: 400,
					easing: 'linear'
				}
			})
			animations.runAnimation(this.$refs.cdWrapper,'move' ,done)
		},
		afterEnter() {
			animations.unregisterAnimation('move')
			this.$refs.cdWrapper.style.animation="";
		},
		leave(el, done) {
			const { x, y, scale }=this._getPosAndScale();
			this.$refs.cdWrapper.style.transition='0.4s all linear'
			this.$refs.cdWrapper.style[transform] = `translate3d(-${x}px, ${y}px, 0) scale(${scale})`
			this.$refs.cdWrapper.addEventListener('transitionend',done,false)
		},
		afterLeave() {
			this.$refs.cdWrapper.style.transition=''
			this.$refs.cdWrapper.style[transform] =''
		},
		togglePlaying() {
			this.setPlaying(!this.playing);
			if(this.lyric) {
				this.lyric.togglePlay()
			}

		},
		prev() {
			if(!this.songReady) return;
			let index = this.currentIndex-1;
			let playListLen= this.playList.length;
			if(index<0) {
				index=playListLen-1;
			}
			this.setCurrentIndex(index)
			this.songReady=false;
		},
		next() {
			if(!this.songReady) return;
			let index = this.currentIndex+1;
			let playListLen= this.playList.length;
			if(index==playListLen) {
				index=0;
			}

			this.setCurrentIndex(index)
			this.songReady=false;
		},
		ready() {
			this.songReady= true;
		},
		error() {
			this.songReady= true;
		},
		updateTime(e) {
			let currentTime=e.target.currentTime | 0;
			let totalTime=this.currentSong.duration;
			this.currentTime= this.format(currentTime);
			this.percent= currentTime / totalTime ;
		},
		end() {
			if(this.mode==playMode.loop || this.playList.length===1) {
				this._loop()
				return;
			}
			let index= this.currentIndex+1;
			let culIndex=Math.min(this.playList.length,index)
			this.setCurrentIndex(culIndex);
		},
		format(n) {
			let m=0;
			let s=0;
			m= n / 60 | 0;
			s= n % 60;
			let padS=this._pad(s)
			return `${m}:${padS}`
		},
		setSongProgress(percent, flag) {
			if(percent==1){
				this.end();
				return;
			}
			if(this.$refs.audio.currentTime==percent*this.currentSong.duration){
				return;
			}
			this.$refs.audio.currentTime=percent*this.currentSong.duration
			this.lyric.seek(percent*this.currentSong.duration*1000)
			if(!flag) {
				this.setPlaying(flag)
			}
			else{
				if(!this.playing) {
					this.togglePlaying()
				}
			}
			
		},
		getLyric(currentSong) {
			currentSong.getLyric().then(res=>{
				this.lyric= new Lyric(res, this.lyricHandler);
				if(this.playing) {
					this.lyric.play()
				}
				
			}).catch(err => {
				this.lyric=null;
				this.currentShow='cd'
				this.playingLyric=''
				this.currentLine=0
			})
		},
		lyricHandler({lineNum,txt}) {
			this.currentLine=lineNum;
			this.playingLyric=txt
			if(lineNum>5) {
				this.$refs.lyricList.scrollToElement(this.$refs.lyricLine[lineNum-5],1000)
			}
			else {
				this.$refs.lyricList.scrollTo(0,0,0)
			}
		},
		middleTouchStart(e) {

			const touch=e.touches[0]
			this.initiated=true;
			this.touch={}
			this.startX=touch.pageX;
			this.startY=touch.pageY;
		},
		middleTouchMove(e) {
			if(!this.initiated) {
				return
			}
			const touch=e.touches[0]
			this.deltaX=touch.pageX-this.startX;
			this.deltaY=touch.pageY-this.startY;
			if(Math.abs(this.deltaX)<=Math.abs(this.deltaY)) return;
			let initX=this.currentShow=='cd' ? 0 : -window.innerWidth
			
			let offsetLeft=initX+this.deltaX
			let left=Math.min(Math.max(offsetLeft,-window.innerWidth),0)
			this.touch.percent=Math.abs(left/window.innerWidth)
			this.$refs.middleL.style.opacity=1-this.touch.percent;
			this.$refs.lyricList.$el.style[transform]=`translate3d(${left}px,0,0)`;
			this.$refs.lyricList.$el.style[transitionDuration]='0'

		},
		middleTouchEnd() {
			this.initiated=false;
			if(this.currentShow=='cd') {
				if(this.touch.percent>0.1) {
					this.$refs.lyricList.$el.style[transform]=`translate3d(${-window.innerWidth}px,0,0)`;
					this.$refs.middleL.style.opacity=0
					this.currentShow='lyric'
				}
			}
			else {
				if(this.touch.percent<0.9) {
					this.$refs.lyricList.$el.style[transform]=`translate3d(0,0,0)`;
					this.$refs.middleL.style.opacity=1
					this.currentShow='cd'
				}
			}
			this.$refs.lyricList.$el.style[transitionDuration]='0.3s'

		},
		showList() {
			this.$refs.playList.show()
		},
		hideList() {
			this.$refs.playList.hide()
		},
		currentSongChange(item) {
			let index=this.playList.findIndex((song) => {
				return song.id===item.id
			})
			this.setCurrentIndex(index);
			this.open();
			this.$refs.playList.hide()
		},
		
		_loop() {
			this.$refs.audio.currentTime=0;
			if(this.lyric) {
				this.lyric.seek(0)
			}
			this.$refs.audio.play();
		},
		_pad(num,n=2){
			let len=num.toString().length
			while(len<n) {
				num='0' +num
				len++
			}
			return num
		}, 
		_getPosAndScale() {
			let x=0;
			let y=0;
			let scale=1;
			const paddingLeft=40;
			const width=window.innerWidth / 2 ;
			const targetWidth= parseInt(this.$refs.cdWrapper.offsetHeight)
			const paddingTop=targetWidth / 2 + 80 ;

			x= width-paddingLeft;
			y= window.innerHeight - paddingTop - paddingLeft;
			scale = paddingLeft / targetWidth
			return {
				x: x,
				y: y,
				scale: scale
			}
		},
		...mapMutations({
			setFullScreen: 'SET_FULLSCREEN',
			setPlaying: 'SET_PLAYING'
			
		}),
		...mapActions([
			'savedPlayHistory'
		])
	},
	components: {
		ProgressBar,
		ProgressCircle,
		Scroll,
		PlayList
	}
	
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";
.player {
.normal-player {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 150;
	background: $color-background;
	.background {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		opacity: 0.6;
		filter: blur(20px);	
	}
	.top {
		position: relative;
		margin-bottom: 25px;
		.back{
			position : absolute;
			top: 0;
			left: 6px;
			z-index: 50;	
		}
		.icon-back {
			display: block;
			padding: 9px;
			font-size: $font-size-large-x;
			color: $color-theme;
			transform: rotate(-90deg);
		}
		.title {
			width: 70%;
			margin: 0 auto;
			line-height: 40px;
			text-align: center;
			@include no-wrap();
			font-size: $font-size-large;
			color: $color-text;
		}
		.subtitle {
			line-height: 20px;
			text-align: center;
			font-size: $font-size-medium;
			color: $color-text;
		}		
	}
	.middle{
	    position: fixed;
	    width: 100%;
	    top: 80px;
	    bottom: 170px;
	    white-space: nowrap;
	    font-size: 0;
		.middle-l {
			display: inline-block;
			vertical-align: top;
			position: relative;
			width: 100%;
			height: 0;
			padding-top: 80%;
			.cd-wrapper {
				position: absolute;
				left: 10%;
				top: 0;
				width: 80%;
				height: 100%;
				.cd {
					width: 100%;
					height: 100%;
					box-sizing: border-box;
					border: 10px solid rgba(255, 255, 255, 0.1);
					border-radius: 50%;
					&.play {
					animation: rotate 20s linear infinite;
					}
					&.pause {
					animation-play-state: paused;
					}
					.image {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					border-radius: 50%;
					}
				}
			}
			.playing-lyric-wrapper {
				width: 80%;
				margin: 30px auto 0 auto;
				overflow: hidden;
				text-align: center;
				.playing-lyric {
				  height: 20px;
				  line-height: 20px;
				  font-size: $font-size-medium;
				  color: $color-text-l;
				}
			}
		}
		.middle-r {
			display: inline-block;
			vertical-align: top;
			width: 100%;
			height: 100%;
			overflow: hidden;
			.lyric-wrapper {
				width: 80%;
				margin: 0 auto;
				overflow: hidden;
				text-align: center;
				.text {
					line-height: 32px;
					color: $color-text-l;
					font-size: $font-size-medium;
					&.current {
					color: $color-text;
					}
				}
			}
		}
	}
	.bottom {
		position: absolute;
		bottom: 50px;
		width: 100%;
		.dot-wrapper {
		  text-align: center;
		  font-size: 0;
			.dot {
				display: inline-block;
				vertical-align: middle;
				margin: 0 4px;
				width: 8px;
				height: 8px;
				border-radius: 50%;
				background: $color-text-l;
				&.active {
					width: 20px;
					border-radius: 5px;
					background: $color-text-ll;
				}
			}
		}
		.progress-wrapper {
			display: flex;
			align-items: center;
			width: 80%;
			margin: 0px auto;
			padding: 10px 0;
			.time {
				color: $color-text;
				font-size: $font-size-small;
				flex: 0 0 30px;
				line-height: 30px;
				width: 30px;
				&.time-l {
				  text-align: left;
				}
				&.time-r {
				  text-align: right;
				}
			}
			.progress-bar-wrapper {
				flex: 1;
			}
		}
		.operators {
			display: flex;
			align-items: center;
			.icon {
				flex: 1;
				color: $color-theme;
				&.disable {
				  color: $color-theme-d;
				}
				i {
				  font-size: 30px;
				}
			}
			.i-left {
			text-align: right;
			}
			.i-center {
				padding: 0 20px;
				text-align: center;
				i {
				  font-size: 40px;
				}
			}
			.i-right {
				text-align: left;
			}
			.icon-favorite {
				color: $color-sub-theme;
			}
		}
	}
}
.mini-player {
	display: flex;
	align-items: center;
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 180;
	width: 100%;
	height: 60px;
	background: $color-highlight-background;
	
	.icon {
		flex: 0 0 40px;
		width: 40px;
		padding: 0 10px 0 20px;
		img {
			border-radius: 50%;
			&.play {
				animation: rotate 10s linear infinite;
			}
			&.pause {
				animation-play-state: paused;
			}
		}
	}
	.text {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		line-height: 20px;
		overflow: hidden;
		.name {
			margin-bottom: 2px;
			@include no-wrap();
			font-size: $font-size-medium;
			color: $color-text;
		}
		.desc {
			@include no-wrap();
			font-size: $font-size-small;
			color: $color-text-d;
		}
	}
	.control {
		flex: 0 0 30px;
		width: 30px;
		padding: 0 10px;
		.iconfont,.icon-play-mini, .icon-pause-mini, .icon-playlist {
			font-size: 30px;
			color: $color-theme-d;
		}
		.icon-mini {
			font-size: 32px;
			position: absolute;
			left: 0;
			top: 0;
		}
	}
}
@keyframes rotate {
	0% {
	  transform: rotate(0)
	}
	100%{
	  transform: rotate(360deg)
	}
}
  
.normal-enter-active, .normal-leave-active {
	transition: all 0.4s;
	.top, .bottom {
		transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
	}
}

.normal-enter, .normal-leave-to {
	opacity: 0;
	 .top {
		transform: translate3d(0, -100px, 0);	
	}

	.bottom {
		transform: translate3d(0, 100px, 0);
	}
}
.mini-enter-active, .mini-leave-active {
	transition: all 0.4s;
}
.mini-enter, .mini-leave-to {
	opacity: 0;
}
	
}
  
</style>