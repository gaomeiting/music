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
	}
	
},
mounted() {
	this.$nextTick(() => {
		this._initBScroll();
	})
},
methods: {
	_initBScroll() {
		this.scroll=new BScroll(this.$refs.wrapper, {
			click: this.click,
			probeType: this.probeType
		})
	},
	disable() {
		this.scroll && this.scroll.disable()
	},
	enable() {
		this.scroll && this.scroll.enable()
	},
	refresh() {
		this.scroll && this.scroll.refresh()
	}
},
watch: {
	data() {
		this.$nextTick(() => {
			this.refresh();
		})
	}
}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
</style>