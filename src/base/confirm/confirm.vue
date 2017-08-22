<template>
<transition name="confirm-fade">
<div class="confirm" v-show="flag">
	<div class="confirm-wrapper">
		<div class="confirm-content">
			<p class="text">{{text}}</p>
			<div class="operate">
				<div class="operate-btn left" @click.stop="cancle">{{cancleBtnText}}</div>
				<div class="operate-btn" @click.stop="confirm">{{confirmBtnText}}</div>
			</div>
		</div>
	</div>
</div>
</transition>
</template>

<script type="text/ecmascript-6">
export default {
props: {
	text : {
		type: String,
		default: ''
	},
	confirmBtnText: {
		type: String,
		default: '确认'
	},
	cancleBtnText: {
		type: String,
		default: '取消'
	}
},
data() {
	return {
		flag: false
	}
},
methods: {
	show() {
		this.flag=true;
	},
	hide() {
		this.flag=false;
	},
	cancle() {
		this.$emit('cancle');
		this.hide()
	},
	confirm() {
		this.$emit('confirm');
		this.hide()
	}
}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "~common/scss/variable";

.confirm {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 998;
	background-color: $color-background-d;
	&.confirm-fade-enter-active {
		animation: confirm-fadein 0.3s;
		.confirm-content {
			animation: confirm-zoom 0.3s;
		}
	}
	&.confirm-fade-leave-active {
		animation: confirm-fadeout 0.4s;
	}
	.confirm-wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 999;
		.confirm-content {
			width: 270px;
			border-radius: 13px;
			background: $color-highlight-background;
			.text {
				padding: 19px 15px;
				line-height: 22px;
				text-align: center;
				font-size: $font-size-large;
				color: $color-text-l;
			}
			.operate {
				display: flex;
				align-items: center;
				text-align: center;
				font-size: $font-size-large;
				.operate-btn {
					flex: 1;
					line-height: 22px;
					padding: 10px 0;
					border-top: 1px solid $color-background-d;
					color: $color-text-d;
					&.left {
						border-right: 1px solid $color-background-d;
					}
				}
			}
		}
	}
}
@keyframes confirm-fadein {
	0% {
	  opacity: 0;
	}
	100% {
	  opacity: 1;
	}
}

@keyframes confirm-zoom {
	0% {
	  transform: scale(0);
	}
	50% {
	  transform: scale(1.1);
	}
	100% {
	  transform: scale(1);
	}
}
@keyframes confirm-zoomout {
	0% {
	  transform: scale(1);
	}
	100% {
	  transform: scale(0);
	}
}
@keyframes confirm-fadeout {
	0% {
	  opacity: 1;
	}
	100% {
	  opacity: 0;
	}
}
</style>