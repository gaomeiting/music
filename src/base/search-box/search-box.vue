<template>
<div class="search-box">
	<i class="iconfont icon-sousuo icon-search"></i>
	<input ref="query" class="box" v-model="query" :placeholder="placeholder"/>
	<i v-show="query" @click.stop.prevet="clear" class="iconfont icon-tianjia icon-dismiss"></i>	
</div>
</template>

<script type="text/ecmascript-6">
import { debounce } from "common/js/until";
export default {
	props: {
		placeholder: {
			type: String,
			default: '搜索歌曲、歌手'
		}
	},
	data() {
		return {
			query: ''
		}
	},
	created() {
		this.$watch('query', debounce((newVal) =>{
			this.$emit('query', newVal)
		},200))
	},
	methods: {
		clear() {
			this.query=''
		},
		setQuery(query) {
			this.query=query
		}
	}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";
.search-box {
	display: flex;
	align-items: center;
	box-sizing: border-box;
	width: 100%;
	padding: 0 6px;
	height: 40px;
	background: $color-highlight-background;
	border-radius: 6px;
	.icon-search {
		font-size: 16px;
		color: $color-text-d;
	}
	.box {
		flex: 1;
		margin: 0 5px;
		line-height: 18px;
		background: $color-highlight-background;
		color: $color-text;
		font-size: $font-size-medium;
		&::placeholder {
			color: $color-text-d;
		}
	}
	.icon-dismiss {
		font-size: 16px;
		transform: rotate(45deg);
		color: $color-text-d;
	}
}   
</style>