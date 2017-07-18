<template>
<div class="slider" ref="slider">
	<div class="slider-group" ref="sliderGroup">
		<slot> </slot>
	</div>
	<div class="dots">
		<span class="dot" v-for="(item, index) in dots" :class = "{ active : currentPageIndex === index }" ></span>
	</div>
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
export default {
props: {
	loop : {
		type: Boolean,
		default: true
	},
	autoPlay : {
		type: Boolean,
		default: true
	},
	interval : {
		type: Number,
		default: 4000
	}
},
data() {
	return {
		dots: [],
		currentPageIndex: 0
	}
},
mounted() {
	this.$nextTick(() => {
		this._setSliderWidth();
		this._initSlider();
		this._initDots();
		if(this.autoPlay) {
			this._play()
		}
	})
	window.addEventListener("resize",()=> {
		this._setSliderWidth(true)
	})
},
destory() {
	clearTimeout(timer);
},
methods: {
	_setSliderWidth(isResize) {
		let sliders= this.$refs.sliderGroup.children;
		this.sliders=sliders;
		let perWidth= this.$refs.slider.clientWidth;
		for(let i=0; i<sliders.length; i++) {
			let slider = sliders[i]
			slider.style.width= perWidth + "px";
			if(!slider.classList.contains("slider-item")) {
				slider.classList.add("slider-item")
			}
		}
		let totalW=0;
		totalW=this.loop && !isResize ? perWidth * ( sliders.length + 2) : perWidth * sliders.length;
		this.$refs.sliderGroup.style.width= totalW + "px";
	},
	_initSlider() {
		this.sliderScroll= new BScroll( this.$refs.slider, {
			scrollX: true,
			scrollY: false,
			momentum: false,
			snap: true,
			snapLoop: this.loop,
			snapThreshold: 0.1,
			snapSpeed: 400,
			click: true
		})
		this.sliderScroll.on("scrollEnd", () => {
			let pageIndex= this.sliderScroll.getCurrentPage().pageX
			this.currentPageIndex= this.loop ? pageIndex-1 : pageIndex;
			if(this.autoPlay) {
				this._play()
			}
		})
	},
	_initDots() {
		let len=this.loop ? this.sliders.length-2 : this.sliders.length
		this.dots=new Array(len);
	},
	_play() {
		clearInterval(this.timer)
		this.timer=setTimeout(() => {
			let pageIndex= this.sliderScroll.getCurrentPage().pageX+1
			this.sliderScroll.goToPage(pageIndex, 0,400)
		},this.interval)
	}
}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";
.slider {
min-height: 1px;
.slider-group {
	position: relative;
	overflow: hidden;
	white-space: nowrap;
	.slider-item {
		float: left;
		box-sizing: border-box;
		overflow: hidden;
		text-align: center;
	}
	a{
		display: block;
	  	width: 100%;
		overflow: hidden;
		text-decoration: none;
	}
	img {
		display: block;
	  	width: 100%;
	}
}
.dots {
	position: absolute;
	right: 0;
	left: 0;
	bottom: 12px;
	text-align: center;
	font-size: 0;
	.dot{
	display: inline-block;
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
      
}

</style>