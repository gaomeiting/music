<template>
  <div class="singer">
      我是歌手页面
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import  Singer from"common/js/singer";
const HOT_NAME="热门"
const HOT_NAME_LEN=10
  export default {
  	data() {
  		return {
  			singers: []
  		}
  	},
  	created() {
  		this._getSingerList()
  	},
  	methods: {
  		_getSingerList() {
  			getSingerList().then(res => {
				if( res.code === ERR_OK ) {
					this.singers=this._normalizeSinger(res.data.list)
					console.log(this.singers)
				}
				else {
					console.log(res)
				}
			  }).catch(err => {
					console.log(err)
			  })
  			
  		},
  		_normalizeSinger(singers){
  			let result=[];
  			let retArr = [];
  			let hotArr=[];
  			let map= {
  				hot: {
  					title: HOT_NAME,
  					items: []
  				}
  			}
  			singers.forEach((singer, index) => {
  				if( index<HOT_NAME_LEN) {
  					map.hot.items.push(new Singer({id: singer.Fsinger_mid, name: singer.Fsinger_name} ))
  				}
  				for(let k in singer) {
  					let key=singer.Findex;
  					if(!map[key]) {
  						map[key]={
  							title: key,
  							items: []
  						}
  					}
  					map[key].items.push(new Singer({id: singer.Fsinger_mid, name: singer.Fsinger_name} ))
  				}
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
  		}
  	
  	}

  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.singer {
	position: fixed;
    	top: 88px;
    	bottom: 0;
    	width: 100%;
}
</style>