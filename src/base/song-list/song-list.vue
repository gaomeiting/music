<template>
<div class="song-list">
	<ul>
		<li class="item" v-for="(song, index) in songs" @click.stop.prevent="select(song, index)">
			<div class="rank" v-show="topList">
			          <span :class="index > 2 ? 'text' : `icon icon${index}`">{{ topListTxt(index) }}</span>
			</div>
			<div class="content">
				<h3 class="name">{{song.name}}</h3>
				<p class="desc">{{songDesc(song)}}</p>
			</div>
		</li>
	</ul>
</div>
</template>

<script type="text/ecmascript-6">

export default {
	props: {
		songs: {
			type: Array,
			default: []
		},
		topList: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		songDesc(song) {
			return `${song.singer}-${song.album}`
		},
		select(song, index) {
			this.$emit('selectSong', song, index)
		},
		topListTxt(index) {
			if(index>2) {
				return index+1
			}
		}
	}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";
@import "~common/scss/mixin";

.song-list {
	.item {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		height: 64px;
		font-size: $font-size-medium;
		.rank {
			flex: 0 0 25px;
			width: 25px;
			margin-right: 30px;
			text-align: center;
			.icon {
				display: inline-block;
				width: 25px;
				height: 24px;
				background-size: 25px 24px;
				&.icon0 {
					@include bg-image('first');
				}
				&.icon1 {
					@include bg-image('second');
				}
				&.icon2 {
					@include bg-image('third');
				}
			}
		  	.text {
				color: $color-theme;
			  	font-size: $font-size-large;
			}
		  
		}

		.content {
			flex: 1;
			line-height: 20px;
			overflow: hidden;
			.name {
				@include no-wrap();
			  	color: $color-text;
			}
			  
			.desc {
				@include no-wrap();
			  	margin-top: 4px;
			  	color: $color-text-d;
			}
		}	
	}
}
    
</style>