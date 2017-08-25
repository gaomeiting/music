<template>
 <scroll class="listview" :data="data" :probe-type="probeType" :listenScroll="listenScroll" @scroll="scroll" ref="listview">
 	<ul>
 		<li class="list-group" v-for="(group, index) in data" ref="group">
 			<h2 class="list-group-title"> {{ group.title }} </h2>
 			<ul>
 				<li class="list-group-item" v-for="item in group.items" :key="item.id" @click.stop.prevent = "selectItem(item)">
 					<img v-lazy="item.avatar" class="avatar">
 					<span class="name"> {{ item.name }} </span>
 				</li>
 			</ul>
 		</li>
 	</ul>
 	<div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart"  @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop>
 		<ul>
 			<li class="item" :class="{ 'current' : currentIndex === index}" v-for="(item, index) in shortcutList" :data-index="index"> {{ item }} </li>
 		</ul>
 	</div>
 	<div class="list-fixed" v-if="fixedTitle" ref="fixed">
 		<div class="fixed-title"> {{ fixedTitle }} </div>
 	</div>
 	<div class="loading-container" v-if="!data.length">
 		<loading></loading>
 	</div>
 </scroll>
</template>
<script type="text/ecmascript-6">
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18;
  export default {
  	props: {
  		data: {
  			type: Array,
  			default: []
  		}
  	},
  	data() {
  		return {
  			scrollY: -1,
			currentIndex: 0,
			diff: -1
  		}
  	},
  	created() {
  		this.touch= {}
  		this.probeType = 3
  		this.listHeight = []
  		this.listenScroll=true
  	},
  	computed: {
  		shortcutList() {
  			return this.data.map((item) => {
  				return	item.title.substr(0,1);
  			})
  		},
  		fixedTitle() {
  			if(this.scrollY > 0 ) {
				return ''
  			}
  			return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
  		}

  	},
  	methods: {
  		selectItem(item) {
  			this.$emit('select', item)
  			//console.log(item)
  		},
  		onShortcutTouchStart(e) {
  			let index= e.target.dataset.index;
  			let el=this.$refs.group[index];
  			this._scrollTo(index);
  			let firstTouch= e.touches[0];
  			this.touch.y1=firstTouch.pageY;
  			this.touch.anchorIndex=index;
  		},
  		onShortcutTouchMove(e) {
  			let firstTouch= e.touches[0];
  			this.touch.y2=firstTouch.pageY;
  			this.delta=this.touch.y2-this.touch.y1;
  			let index= (this.delta / ANCHOR_HEIGHT | 0) + parseInt(this.touch.anchorIndex);
  			let el=this.$refs.group[index];
  			this._scrollTo(index);
  		},
  		scroll(pos) {
  			this.scrollY=pos.y
  		},
  		refresh() {
		        this.$refs.listview.refresh()
		},
  		_scrollTo(index) {
  			if (!index && index !== 0) {
				return
			}
			if (index < 0) {
				index = 0
			}
			else if (index > this.listHeight.length - 2) {
				index = this.listHeight.length - 2
			}
			this.scrollY = -this.listHeight[index]
  			this.$refs.listview.scrollToElement(this.$refs.group[index], 0);
		},
		_calculateHeight() {
			this.listHeight = [];
			const groups= this.$refs.group;
			let sumH=0
			this.listHeight.push(sumH)
			for( let i=0; i < groups.length ; i++) {
				sumH += groups[i].offsetHeight;
				this.listHeight.push(sumH)
			}
		}
  	},
  	watch: {
  		data () {
  			this.$nextTick(() => {
	  			this._calculateHeight()
	  		})
  		},
  		scrollY(newY) {
  			//滚动到顶；
  			if(newY>0) {
  				this.currentIndex = 0;
  				return;
  			}
  			//滚动到中间；
  			for(let i= 0; i<this.listHeight.length-1; i++) {
  				let Height1=this.listHeight[i];
  				let Height2=this.listHeight[i+1];
  				if( -newY >= Height1 && -newY < Height2 ) {
  					this.diff = Height2 + newY
  					this.currentIndex = i;
  					return;
  				}
  			}
  			//滚动到底部；
  			this.currentIndex=this.listHeight.length-2
  		},
  		diff(newVal) {
		        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
		        if (this.fixedTop === fixedTop) {
		          return
		        }
		        this.fixedTop = fixedTop
		        if(this.$refs.fixed) {
		        	this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
		        }
		}
  	},
  	
  	components: {
  		Scroll,
  		Loading
  	}
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";
.listview {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: $color-background;
	.list-group {
		padding-bottom: 30px;
		.list-group-title {
			height: 30px;
			line-height: 30px;
			padding-left: 20px;
			font-size: $font-size-small;
			color: $color-text-l;
			background: $color-highlight-background;	
		}
	    
		.list-group-item {
			display: flex;
			align-items: center;
			padding: 20px 0 0 30px;
			.avatar {
				width: 50px;
			  	height: 50px;
			  	border-radius: 50%;	
			}
			 .name {
			 	margin-left: 20px;
			  	color: $color-text-l;
			  	font-size: $font-size-medium;
			 }
		  	
		}
	    	
	}
  
.list-shortcut {
	position: absolute;
	z-index: 30;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 20px;
	padding: 20px 0;
	border-radius: 10px;
	text-align: center;
	background: $color-background-d;
	font-family: Helvetica;
	.item {
		padding: 3px;
	    	line-height: 1;
	    	color: $color-text-l;
	    	font-size: $font-size-small;
		&.current {
			color: $color-theme;	  	
		}
	 }
	    
}
  
.list-fixed {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	.fixed-title {
		height: 30px;
		line-height: 30px;
		padding-left: 20px;
		font-size: $font-size-small;
		color: $color-text-l;
		background: $color-highlight-background;	
	}
}
.loading-container {
	position: absolute;
	width: 100%;
	top: 50%;
	transform: translateY(-50%);
}	
}

    
</style>
