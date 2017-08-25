<template>
<div class="rank" ref="rank">
<scroll :data="topList" class="toplist" ref="toplist">
	<ul>
		<li class="item" v-for="item in topList" @click.stop.prevent="selectRankItem(item)">
			<div class="icon">
				<img width="100" height="100" v-lazy="item.picUrl"/>
			</div>
			<ul class="songlist">
				<li class="song" v-for="(song,index) in item.songList">
					<span>{{index+1}}</span>
					<span>{{song.songname}}-{{song.singername}}</span>
				</li>
			</ul>
		</li>
	</ul>
</scroll>
<div class="loading-container" v-show="!topList.length">
	<loading></loading>
</div>
<router-view></router-view>
</div>
</template>

<script type="text/ecmascript-6">
import { getRank } from "api/rank";
import { ERR_OK } from "api/config";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import {mapMutations} from "vuex";
import {playlistMixin} from "common/js/mixin";
  export default {
  	mixins:[playlistMixin],
  	data() {
  		return {
  			topList: []
  		}
  	},
  	created() {
  		this._getRank()
  		
  	},
  	methods: {
  		_getRank() {
  			getRank().then(res => {
  				if(res.code===ERR_OK) {
  					this.topList=res.data.topList
  				}
  				else {
  					console.log(res.message)
  				}
  			}).catch(err =>{
  				console.log(err)
  			})
  		},
  		selectRankItem(item){
  			this.$router.push(`/rank/${item.id}`)
  			this.setRank(item)
  		},
  		handlePlayList(playList) {
  			let bot=playList.length ? '60px' : 0;
  			this.$refs.rank.style.bottom=bot;
  			this.$refs.toplist.refresh()

  		},
  		...mapMutations({
  			setRank: 'SET_RANK'
  		})
  	},
  	components: {
  		Scroll,
  		Loading
  	}
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";
@import "~common/scss/mixin";
.rank {
	position: fixed;
	width: 100%;
	top: 44px;
	bottom: 0;
	.toplist {
		height: 100%;
		overflow: hidden;
		.item {
			display: flex;
			margin: 0 20px;
			padding-top: 20px;
			height: 100px;
			&:last-child {
				padding-bottom: 20px;
			}
			.icon {
				flex: 0 0 100px;
				width: 100px;
				height: 100px;
			}
			.songlist {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 0 20px;
				height: 100px;
				overflow: hidden;
				background: $color-highlight-background;
				color: $color-text-d;
				font-size: $font-size-small;
				.song {
					@include no-wrap();
					line-height: 26px;
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
</style>