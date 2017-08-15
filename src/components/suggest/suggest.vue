<template>
<scroll :data="searchResult" :pullUp="pullUp" @scrollEnd="searchMore(query,page,zhida)" class="suggest" ref="suggest">
	<ul class="suggest-list">
		<li class="suggest-item" v-for="item in searchResult">
			<div class="icon">
			  	<i class="iconfont" :class="{ 'icon-geshou': item.singername }"></i>
			</div>
			<div class="name">
			  	<p class="text" v-html="getDisplayName(item)"></p>
			</div>
		</li>
		<loading v-if="hasMore"></loading>
	</ul>
	<div class="no-result-wrapper" v-if="!hasMore && !searchResult.length">
		<no-result></no-result>
	</div>
</scroll>
</template>

<script type="text/ecmascript-6">
import { searchFor } from "api/search";
import { ERR_OK } from "api/config";
import { CreateSong } from "common/js/song";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import NoResult from "base/no-result/no-result";
const TYPE_SINGER='singer'
export default {
props: {
	query: {
		type: String,
		default: ''
	},
	zhida: {
		type: Number,
		default: 1
	}
},
data() {
	return {
		searchResult: [],
		page: 1,
		pullUp: true,
		hasMore: true
	}
},
watch: {
	query(newVal, oldVal) {
		this.page=1;
		this._searchFor(newVal, this.page, this.zhida)
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
	searchMore(query,page,zhida) {
		if(!this.hasMore) {
			return;
		}
		searchFor(query, page, zhida).then(res => {
			if(res.code===ERR_OK) {
				let list=res.data.song.list
				this.searchResult=this.searchResult.concat(this._normalizeList(list))
				this._checkHasMore(res.data)
			}else{
				console.log(res.code)
			}
		}).catch(err => {
			console.log(err)
		})
	},
	_checkHasMore(data) {
		let song=data.song
		if(song.curnum+song.curpage * 20 >= song.totalnum) {
			this.hasMore=false;
		}
		else {
			this.page++;
		}
	},
	_searchFor(query,page,zhida) {
		this.hasMore=true;
		this.$refs.suggest.scrollTo(0,0,0)
		searchFor(query, page, zhida).then(res => {
			if(res.code===ERR_OK) {
				this.searchResult=this._getResult(res.data)
				this._checkHasMore(res.data)
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
},
components: {
	Scroll,
	Loading,
	NoResult
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