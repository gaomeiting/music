import { commonParams, options } from "api/config";
import{ jsonp} from 'common/js/jsonp'
import axios from "axios";

export function getHotKey() {
	const url='https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
	const data= Object.assign({}, commonParams, {
		uin: 0,
		notice: 0,
		platform: 'h5',
		needNewCode: 1
	})
	return jsonp( url, data, options )
}
export function searchFor(w, p, zhida) {
	const url='https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
	const data=Object.assign({},commonParams, {
		w,
		p,
		uin: 0,
		notice: 0,
		platform: 'h5',
		needNewCode: 1,
		zhidaqu: 1,
		catZhida: zhida ? 1 : 0,
		t: 0,
		flag: 1,
		ie: 'utf-8',
		sem: 1,
		aggr: 0,
		perpage: 20,
		n: 20,
		remoteplace: 'txt.mqq.all',
	})
	return jsonp(url, data, options)
}

