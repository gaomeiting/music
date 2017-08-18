<template>
<div class="search-list" v-if="searches.length">
	<transition-group name="list" tag="ul">
		<li class="search-item" :key="item" v-for="item in searches" @click="seletItem">
			<span class="text">{{item}}</span>
			<span class="icon" @click.stop="deleteOne(item)">
				<i class="iconfont icon-tianjia icon-delete"></i>
			</span>
		</li>
	</transition-group>
</div>
</template>

<script type="text/ecmascript-6">
export default {
props: {
	searches: {
		type: Array,
		default: []
	}
},
methods: {
	seletItem(item) {
		this.$emit('seletItem', item)
	},
	deleteOne(item) {
		this.$emit('deleteOne', item)
	}
}	
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";
@import "~common/scss/mixin";
.search-list {
	.search-item {
		display: flex;
		align-items: center;
		height: 40px;
		overflow: hidden;
		&.list-enter-active, &.list-leave-active{
			transition: all 0.1s;
		}
		&.list-enter, &.list-leave-to {
			height: 0;
		}
		.text {
			flex: 1;
			color: $color-text-l;
		}
		.icon {
			@include extend-click();
			transform: rotate(45deg);
			.icon-delete {
				font-size: $font-size-small;
				color: $color-text-d; 
			}
		}
	} 

}
</style>