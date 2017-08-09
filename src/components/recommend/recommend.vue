<template>
  <div class="recommend" ref="recommend">

	<scroll :data="discLists" class="recommend-content" ref="scroll">
		<div>
			<div v-if="slider.length" class="slider-wrapper">
				<slider>
					<div v-for="(item, index) in slider" :key="item.id">
						<a :href="item.linkUrl">
							<img :src="item.picUrl" @load="imgLoad">
						</a>
					</div>
				</slider>
			</div>
			<div class="recommend-list">
				<h1 class="list-title">热门歌单推荐</h1>
				<ul>
				            <li class="item" v-for="(discList, index) in discLists" :key="discList.dissid" @click.stop.prevent=selectDisc(discList)>
					             <div class="icon">
					             		<img width="60" height="60" v-lazy="discList.imgurl">
					              </div>
					             <div class="text">
					                	<h2 class="name" v-html="discList.creator.name"></h2>
					                	<p class="desc" v-html="discList.dissname"></p>
					             </div>
				            </li>
				</ul>
			</div>
		</div>
		<div v-if="!discLists.length" class="loading-container">
			<loading></loading>
		</div>
	</scroll>
	<router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getRecommend, getDiscList } from "api/recommend";
import { ERR_OK } from "api/config";
import { mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin";
  export default {
  	mixins: [playlistMixin],
	data() {
		return {
			slider: [],
			discLists: []
		}
	},
	created() {
		 this._getRecommend();
		 this._getDiscList();
		
		 
	},
	methods: {
		selectDisc(item) {
			this.$router.push({
  				path: `/recommend/${ item.dissid }`
  			})
			this.setDisc(item);
		},
		handlePlayList(playList) {
			const bot=playList.length  ? '60px' : 0;
			this.$refs.recommend.style.bottom=bot;
			this.$refs.scroll.refresh()
		},
		_getRecommend() {
			getRecommend().then(res => {
				if( res.code === ERR_OK ) {
					this.slider=res.data.slider;
				}
				else {
					console.log(res)
				}
			  }).catch(err => {
				console.log(err)
			  })
		},
		_getDiscList() {
			getDiscList().then(res => {
				if( res.code === ERR_OK ) {
					this.discLists=res.data.list;
				}
				else {
					console.log(res)
				}
			  }).catch(err => {
					console.log(err)
			  })
		},
		imgLoad() {
			if(!this.imgChecked) {
				this.$refs.scroll.refresh()
				this.imgChecked=true;
			}
		},
		...mapMutations({
			setDisc: 'SET_DISC'
		})
	},
	components: {
		Slider,
		Scroll,
		Loading
	}
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";
@import "~common/scss/mixin";

.recommend {
position: fixed;
width: 100%;
top: 88px;
bottom: 0;
.recommend-content {
	height: 100%;
	overflow: hidden;
	.slider-wrapper {
		position: relative;
		width: 100%;
		overflow: hidden;	
	}
	.recommend-list {
		.list-title {
			height: 65px;
			line-height: 65px;
			text-align: center;
			 font-size: $font-size-medium;
			color: $color-theme;	
		}
		.item {
			display: flex;
			box-sizing: border-box;
			align-items: center;
			padding: 0 20px 20px 20px;
			  .icon {
				flex: 0 0 60px;
					width: 60px;
					padding-right: 20px;	
			  }
			  .text {
				display: flex;
					flex-direction: column;
					justify-content: center;
					flex: 1;
					line-height: 20px;
					overflow: hidden;
					font-size: $font-size-medium;
					.name {
				margin-bottom: 10px;
						color: $color-text;
					}
			.desc{
				color: $color-text-d;
			} 
			  }
					
		}
				
	}
	.loading-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);	
	}	
}

		
}

</style>