<template>
<transition name="drop">
<div class="top-tip" v-if="flag">
	<slot></slot>
</div>
</transition>
</template>

<script type="text/ecmascript-6">
export default {
props: {
	delay: {
		type: Number,
		default: 2000
	}
},
data() {
	return {
		flag: false
	}
},
methods: {
	show() {
		this.flag=true;
		clearTimeout(this.timer)
		this.timer=setTimeout(()=>{
			this.flag=false
		}, this.delay)
	},
	hide() {
		this.flag=false;
	}
}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";

.top-tip {
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 500;
	background: $color-dialog-background;
	&.drop-enter-active, &.drop-leave-active {
	  transition: all 0.3s;
	}
	&.drop-enter, &.drop-leave-to {
	  transform: translate3d(0, -100%, 0);
	}
}
</style>