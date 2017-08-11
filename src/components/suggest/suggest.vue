<template>
<div class="suggest">
	<ul class="suggest-list">
		<li class="suggest-item" v-for="item in searchResult">
			<div class="icon">
			  	<i class="iconfont" :class="{ 'icon-geshou': item.singername }"></i>
			</div>
			<div class="name">
			  	<p class="text" v-html="getDisplayName(item)"></p>
			</div>
		</li>
	</ul>
</div>
</template>

<script type="text/ecmascript-6">
import { searchFor } from "api/search";
import { ERR_OK } from "api/config";
import { CreateSong } from "common/js/song";
const TYPE_SINGER='singer'
export default {
props: {
	query: {
		type: String,
		default: ''
	},
	page: {
		type: Number,
		default: 1
	}
},
data() {
	return {
		searchResult: []
	}
},
watch: {
	query(newVal, oldVal) {
		this._searchFor(newVal, this.page)
	}
},
methods: {
	getDisplayName(item) {
		if(item.singername) {
			return item.singername
		}else{
			return `${item.name}-${item.singer}`
		}
		
	},
	_searchFor(query,page) {
		searchFor(query, page).then(res => {
			if(res.code===ERR_OK) {
				this.searchResult=this._getResult(res.data)
			}else{
				console.log(res.code)
			}
		}).catch(err => {
			console.log(err)
		})
	},
	_getResult(data) {
		let ret=[]
		let list=data.song.list
		if(data.zhida && data.zhida.singerid) {
			ret.push({...data.zhida, ...{ type: TYPE_SINGER }})
		}
		ret = ret.concat(this._normalizeList(list))
		
		return ret
	},
	_normalizeList(list) {
		let ret=[]
		list.forEach((item) => {
			if(item.albummid && item.songid) {
				ret.push(CreateSong(item))
			}
		})
		return ret
	}
}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";
@import "~common/scss/mixin";
  .suggest {
	height: 100%;
	overflow: hidden;
	.suggest-list {
		padding: 0 30px;
		.suggest-item {
			display: flex;
			align-items: center;
			padding-bottom: 20px;
			.icon {
				flex: 0 0 30px;
				width: 30px;
				[class^="icon-"] {
					font-size: 14px;
					color: $color-text-d;
				}
			}
			.name {
				flex: 1;
				font-size: $font-size-medium;
				color: $color-text-d;
				overflow: hidden;
				.text {
				  	@include no-wrap();
				}
			}
		}
	}
	.no-result-wrapper {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>