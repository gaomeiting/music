<template>
<div ref="wrapper">
	<slot></slot>
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
export default {
props: {
	probeType: {
		type: Number,
		default: 1	
	},
	click: {
		type: Boolean,
		default: true
	},
	data: {
		type: Array,
		default: null
	},
	refreshDelay: {
	        type: Number,
	        default: 20
	},
	listenScroll: {
		type: Boolean,
		default: false
	},
	pullUp: {
		type: Boolean,
		default: false
	}
	
},
mounted() {
	this.$nextTick(() => {
		this._initBScroll();
	})
},
methods: {
	_initBScroll() {
		if( !this.$refs.wrapper ) {
			return;
		}
		this.scroll=new BScroll(this.$refs.wrapper, {
			click: this.click,
			probeType: this.probeType
		})
		if(this.listenScroll) {
			this.scroll.on('scroll', (pos) => {
				this.$emit('scroll', pos)
			})
		}
		if(this.pullUp) {
			this.scroll.on('scrollEnd', () => {
				let scroll=this.scroll
				if(scroll.y <= scroll.maxScrollY+60) {
					this.$emit('scrollEnd')
				}
			})
			
		}
	},
	disable() {
		this.scroll && this.scroll.disable()
	},
	enable() {
		this.scroll && this.scroll.enable()
	},
	refresh() {
		this.scroll && this.scroll.refresh()
	},
	scrollToElement() {
		this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
	},
	scrollTo() {
		this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
	}
},
watch: {
	data() {
		this.$nextTick(() => {
			console.log(1234)
			this.refresh();
		})
	}
}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
</style>