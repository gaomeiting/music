import {getLyric} from "api/song";
import {ERR_OK} from "api/config";
import {Base64} from "js-base64";

export default class Song {
	constructor({id, mid, name, album, singer, url, image, duration}) {
		this.id=id;
		this.mid=mid;
		this.name=name;
		this.album=album;
		this.singer=singer;
		this.url=url;
		this.image=image;
		this.duration=duration;
	}
	getLyric() {
		return getLyric(this.mid).then(res => {
			if(this.lyric) {
				return 
			}
			if(res.code==ERR_OK) {
				this.lyric=res.lyric;
				return Promise.resolve(Base64.decode(this.lyric))
			}
		}).catch(err => {
			return Promise.reject(err)
		})
		/*return new Promise((resolve, reject) => {
			getLyric(this.mid).then(res => {
				this.lyric=res.lyric;
				resolve(Base64.decode(this.lyric))
			}).catch(err => {
				reject(err)
			})
		});*/
		
	}
}
export function CreateSong(musicData) {
	return new Song({
		id: musicData.songid, 
		mid: musicData.songmid, 
		name: musicData.songname, 
		album: musicData.albumname, 
		singer: filterSingers(musicData.singer), 
		image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    		url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`,
		duration: musicData.interval
	})
}

function filterSingers(list) {
	let ret=[];
	if(!list){
		return ' '
	}
	list.forEach((item) => {
		ret.push(item.name)
	})
	return ret.join("/")
}