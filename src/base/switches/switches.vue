<template>
  <ul class="switches">
	<li class="switch-item" v-for="(item, index) in switches" @click.stop="selectItem(index)" :class=" {'active' : currentIndex===index} ">
	  	<span> {{item.name}} </span>
	</li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
	props: {
		currentIndex: {
			type: Number,
			default: 0
		},
		switches: {
			type: Array,
			default: []
		}
	},
	methods: {
		selectItem(index) {
			this.$emit('switchItem', index)
		}
	}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";
.switches {
	display: flex;
	align-items: center;
	width: 240px;
	margin: 0 auto;
	border: 1px solid $color-highlight-background;
	border-radius: 5px;
	.switch-item {
		flex: 1;
		padding: 8px;
		text-align: center;
		font-size: $font-size-medium;
		color: $color-text-d;
		&.active {
			background: $color-highlight-background;
			color: $color-text;
		}
	}
}
</style>