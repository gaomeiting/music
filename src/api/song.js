import { commonParams } from "api/config";
import axios from "axios";
export function getLyric(mid) {
	let url = "api/lyric"
	let data = Object.assign(commonParams, {
		pcachetime : +new Date(),
		songmid :  mid,
		loginUin : 0,
		hostUin : 0,
		format : 'json',
		platform : 'yqq',
		needNewCode : 0,
	})
	return axios.get(url,{
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(err => {
		return Promise.reject(err)
	})
}
