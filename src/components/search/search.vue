<template>
<div class="search">
	<div class="search-box-wrapper">
		<search-box @query="onQueryChange" ref="searchBox"></search-box>
	</div>
	<div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
		<scroll ref="shortcut" class="shortcut" :data="shortcut">
			<div>
				<div class="hot-key" v-show="hotkey.length">
					<h1 class="title">热门搜索</h1>
					<ul>
						<li class="item" v-for="(item, index) in hotkey" v-if="index < 10" @click.stop.prevent="setQuery(item.k)">
							<span>{{item.k}}</span>
						</li>
					</ul>
				</div>
				<div class="search-history" v-show="searchHistory.length">
					<h1 class="title">
						<span class="text">搜索历史</span>
						<span class="clear" @click="clear">
							<i class="iconfont icon-shanchu icon-clear"></i>
						</span>
					</h1>
					<search-list :searches="searchHistory" @deleteOne="deleteOneSearchHistory" @seletItem="onQueryChange"></search-list>
				</div>
			</div>
		</scroll>
	</div>
	<div class="search-result" v-show="query" ref="searchResult">
		<suggest ref="suggest" :query="query" @beforeScrollStart='beforeScrollStart' @selectItem="fadeOutSearch"></suggest>
	</div>
</div>
</template>

<script type="text/ecmascript-6">
import SearchBox from "base/search-box/search-box";
import Suggest from "components/suggest/suggest";
import SearchList from "base/search-list/search-list";
import Scroll from "base/scroll/scroll";
import { getHotKey } from "api/search";
import { ERR_OK } from "api/config";
import { playlistMixin } from "common/js/mixin";
import { mapGetters, mapActions } from "vuex";
import { deleteOneSearch } from "common/js/catch";
export default {
	mixins : [playlistMixin],
	data() {
		return {
			query: '',
			page: 1,
			hotkey: []
		}
	},
	created() {
		this._getHotKey()
	},
	computed: {
		shortcut() {
			return this.hotkey.concat(this.searchHistory)
			
		},
		...mapGetters([
			'searchHistory'
		])
	},
	methods: {
		onQueryChange(query){
			this.query=query
		},
		
		setQuery(item) {
			this.$refs.searchBox.setQuery(item)
		},
		beforeScrollStart() {
			this.$refs.searchBox.blur()
		}, 
		clear() {
			this.deleteAllSearchHistory()
		},
		fadeOutSearch() {
			this.savedSearchHistory(this.query)
		},
		handlePlayList(playList) {
			let bot=playList.length ? '60px' : 0;
			this.$refs.shortcutWrapper.style.bottom=bot;
			this.$refs.shortcut.refresh();
			this.$refs.searchResult.style.bottom=bot;
			this.$refs.suggest.refresh()
		},
		_getHotKey() {
			getHotKey().then(res => {
				if(res.code === ERR_OK){
					this.hotkey=res.data.hotkey
				}
			}).catch(err => {
				console.log(err)
			})
		},
		...mapActions([
			'savedSearchHistory',
			'deleteOneSearchHistory',
			'deleteAllSearchHistory'
		])
	},
	components: {
		SearchBox,
		Suggest,
		SearchList,
		Scroll
	}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";
@import "~common/scss/mixin";
.search {
	.search-box-wrapper{
		margin: 20px;
	}
	.shortcut-wrapper {
		position: fixed;
		top: 178px;
		bottom: 0;
		width: 100%;
		.shortcut {
			height: 100%;
			overflow: hidden;
			.hot-key {
				margin: 0 20px 20px 20px;

				.title {
					margin-bottom: 20px;
					font-size: $font-size-medium;
					color: $color-text-l;
				}
				.item {
					display: inline-block;
					padding: 5px 10px;
					margin: 0 20px 10px 0;
					border-radius: 6px;
					background: $color-highlight-background;
					font-size: $font-size-medium;
					color: $color-text-d;
				}
			}
		}
	}
	.search-history {
		position: relative;
		margin: 0 20px;
		.title {
			display: flex;
			align-items: center;
			height: 40px;
			font-size: $font-size-medium;
			color: $color-text-l;
		}
		.text {
		  	flex: 1;
		}
		.clear {
			@include extend-click();
			.icon-clear {
				font-size: $font-size-medium;
				color: $color-text-d;
			}
		}
	}
	.search-result {
		position: fixed;
		width: 100%;
		top: 178px;
		bottom: 0;
	}
}
</style>