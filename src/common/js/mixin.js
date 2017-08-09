import { mapGetters } from "vuex";
export const playlistMixin= {
	computed: {
		...mapGetters([
			'playList'
		])
	},
	mounted() {
		//console.log("mounted")
		this.handlePlayList(this.playList);
	},
	activated() {
		//console.log("activated")
		this.handlePlayList(this.playList);
	},
	
	watch: {
		playList(newVal) {
			//console.log("watch")
			this.handlePlayList(newVal);
		}
	},
	methods: {
		handlePlayList() {
			throw new Error('component must inplement handlePlayList')
		}
	}
}
