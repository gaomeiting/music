<template>
<scroll :data="searchResult" :pullUp="pullUp" @scrollEnd="searchMore(query,page,zhida)" class="suggest" ref="suggest" :beforeScroll="beforeScroll" @beforeScrollStart="beforeScrollStart">
	<ul class="suggest-list">
		<li class="suggest-item" v-for="item in searchResult" @click.stop.prevent="selectItem(item)">
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
		<no-result title="抱歉,没有找到搜索结果"></no-result>
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
import Singer from "common/js/singer";
import { mapMutations, mapActions } from "vuex";
import { playlistMixin } from "common/js/mixin";
const TYPE_SINGER='singer'
export default {
mixins : [playlistMixin],
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
		hasMore: true,
		beforeScroll: true
	}
},
watch: {
	query(newVal, oldVal) {
		if(newVal) {
			this._searchFor(newVal, this.zhida)
		}
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
	beforeScrollStart() {
		this.$emit('beforeScrollStart')
	},
	selectItem(item) {
		if(item.type===TYPE_SINGER) {
			let singer=new Singer({id: item.singermid , name: item.singername})
			this.setSinger(singer)
			this.$router.push(`/singer/${singer.id}`)
		}
		else {
			this.insertPlay(item)
		}
	},
	handlePlayList(playList) {
		let bot=playList ? "60px" : 0;
		this.$refs.suggest.$el.style.bottom=bot;
		this.$refs.suggest.refresh()	
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
	_searchFor(query,zhida) {
		this.page=1;
		this.hasMore=true;
		this.$refs.suggest.scrollTo(0,0,0)
		console.log(query, this.page, zhida)
		searchFor(query, this.page, zhida).then(res => {
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
	},
	...mapMutations({
		'setSinger' : 'SET_SINGER'
	}),
	...mapActions([
		'insertPlay'
	])
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