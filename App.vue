<script>
	import { isLoggedIn } from '@/utils/storage.js'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 检查登录状态
			this.checkLoginStatus()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			checkLoginStatus() {
				// 如果未登录，可以在这里做一些处理
				// 注意：不要在onLaunch中直接跳转，因为此时页面可能还没准备好
				// 可以在需要登录的页面的onLoad中检查
			}
		}
	}
</script>

<style>
	/* 每个页面公共css */
	page {
		background-color: #f5f5f5;
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
			Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
			sans-serif;
	}
</style>
