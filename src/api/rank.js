import { jsonp } from "common/js/jsonp";
import { commonParams, options } from "api/config";
import axios from 'axios';
export function getRank() {
	let url='https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
	let data=Object.assign({}, commonParams, {
		notice: 0,
		platform: 'h5',
		needNewCode: 1
	})
	return jsonp(url, data, options)
}
export function getTopList(topid) {
	let url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
	let data=Object.assign({}, commonParams, {
		notice: 0,
		platform: 'h5',
		needNewCode: 1,
		tpl: 3,
		page: 'detail',
		type: 'top',
		topid
	})
	return jsonp(url, data, options)
}