<template>
  <div class="singer" ref="singer">
	<list-view :data="data" @select="selectSinger" ref="list"></list-view>
	<router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import  Singer from"common/js/singer";
import  ListView from"base/listview/listview";
import  { mapMutations } from"vuex";
import  { playlistMixin } from"common/js/mixin";
const HOT_NAME="热门"
const HOT_NAME_LEN=10
  export default {
    	mixins: [playlistMixin],
  	data() {
  		return {
  			data: []
  		}
  	},
  	created() {
  		this._getSingerList()
  	},
  	methods: {
  		selectSinger(item) {
  			this.$router.push({
  				path: `/singer/${ item.id }`
  			})
  			this.setSinger(item)
  		},
	             handlePlayList(playList) {
			const bot=playList.length ? '60px' : 0;
			this.$refs.singer.style.bottom=bot;
			this.$refs.list.refresh()
	             },
  		_getSingerList() {
  			getSingerList().then(res => {
				if( res.code === ERR_OK ) {
					this.data=this._normalizeSinger(res.data.list)
				}
				else {
					console.log(res)
				}
			  }).catch(err => {
					console.log(err)
			  })
  			
  		},
  		_normalizeSinger(data){
  			let result=[];
  			let retArr = [];
  			let hotArr=[];
  			let map= {
  				hot: {
  					title: HOT_NAME,
  					items: []
  				}
  			}
  			data.forEach((singer, index) => {
  				if( index<HOT_NAME_LEN) {
  					map.hot.items.push(new Singer({id: singer.Fsinger_mid, name: singer.Fsinger_name} ))
  				}
  				let key=singer.Findex;
				if(!map[key]) {
					map[key]={
						title: key,
						items: []
					}
				}
				map[key].items.push(new Singer({id: singer.Fsinger_mid, name: singer.Fsinger_name} ))
  			})
  			for(let key in map) {
  				let val=map[key];
  				
  				if(val.title.match(/[a-zA-Z]/)){
  					retArr.push(val)
  				}
  				else if(val.title==="热门") {
  					hotArr.push(val)
  				}
  			}
  			retArr.sort((a, b) => {
  				return a.title.charCodeAt(0) - b.title.charCodeAt(0)
  			})
  			result= hotArr.concat(retArr)
  			return result;
  		},
  		...mapMutations({
  			setSinger : 'SET_SINGER'
  		})
  	
  	},
  	components: {
  		ListView
  	}

  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.singer {
	position: fixed;
    	top: 44px;
    	bottom: 0;
    	width: 100%;
}
</style>