<template>
	<view class="container">
		<!-- 消息列表 -->
		<scroll-view class="chat-list" scroll-y :scroll-top="scrollTop" :scroll-into-view="lastMsgId"
			scroll-with-animation @scrolltoupper="loadMore">
			<!-- 加载更多提示 -->
			<view class="load-more" v-if="loadingMore">
				<text class="load-text">加载中...</text>
			</view>

			<view v-for="(msg, index) in messages" :key="index" :id="'msg-' + index" class="msg-item"
				:class="msg.isSelf ? 'sent' : 'received'">
				<image class="avatar" src="/static/logo.png"></image>
				<view class="msg-content">
					<!-- <view class="sender-name" v-if="!msg.isSelf">{{ msg.senderName }}</view> -->
					<view class="bubble" :class="msg.msgType === 1 ? 'image-bubble' : ''">
						<!-- 图片消息 -->
						<image v-if="msg.msgType === 1" class="msg-image" :src="msg.content" mode="aspectFit"
							@click="previewImage(msg.content)"></image>
						<!-- 文字消息 -->
						<text v-else>{{ msg.content }}</text>
					</view>
					<view class="msg-time">{{ msg.sendTime }}</view>
				</view>
			</view>
		</scroll-view>

		<!-- 输入框 -->
		<view class="input-bar">
			<input class="input" type="text" v-model="inputText" placeholder="输入消息..." @confirm="sendMsg" />
			<button class="send-btn" type="primary" size="mini" @click="sendMsg">发送</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

const peerId = ref('')
const orderId = ref('')
const currentUserId = ref('')
const inputText = ref('')
const lastMsgId = ref('')
const scrollTop = ref(0)
const loadingMore = ref(false)
const ws = ref(null)
const isConnected = ref(false)
const messages = ref([])

onLoad((options) => {
	if (options.id) peerId.value = options.id
	if (options.orderId) orderId.value = options.orderId
})

onMounted(async () => {
	const user = uni.getStorageSync('userInfo')
	if (user && user.id) {
		currentUserId.value = user.id
	}
	await loadHistory()
	connectWebSocket()
})

onUnmounted(() => {
	if (ws.value) {
		ws.value.close()
		ws.value = null
	}
})

// 判断消息是否为自己发送
const isSelfMsg = (msg) => {
	return String(msg.senderId) === String(currentUserId.value)
}

// 加载聊天历史
const loadHistory = async () => {
	if (!orderId.value) return
	uni.showLoading({ title: '加载中...' })
	try {
		const res = await uni.request({
			url: 'http://localhost:8081/api/chat/history',
			method: 'GET',
			data: { orderId: orderId.value, pageNum: 1, pageSize: 100 },
			header: {
				Authorization: uni.getStorageSync('token') ? `Bearer ${uni.getStorageSync('token')}` : ''
			}
		})
		const data = res.data
		if (data.code === 200 && data.data) {
			messages.value = (data.data.records || []).map(msg => ({
				...msg,
				isSelf: isSelfMsg(msg)
			}))
			// 标记已读
			if (peerId.value) {
				uni.request({
					url: 'http://localhost:8081/api/chat/read',
					method: 'PUT',
					data: { orderId: Number(orderId.value), userId: Number(peerId.value) },
					header: {
						Authorization: uni.getStorageSync('token') ? `Bearer ${uni.getStorageSync('token')}` : '',
						'Content-Type': 'application/json'
					}
				})
			}
			scrollToBottom()
		}
	} catch (e) {
		console.error('加载历史失败', e)
	} finally {
		uni.hideLoading()
		loadingMore.value = false
	}
}

const loadMore = () => {
	// 可以实现分页加载更多
}

// 滚动到底部
const scrollToBottom = () => {
	nextTick(() => {
		lastMsgId.value = 'msg-' + (messages.value.length - 1)
	})
}

// WebSocket连接
const connectWebSocket = () => {
	const token = uni.getStorageSync('token') || ''
	const wsUrl = `ws://localhost:8081/ws/chat?token=${encodeURIComponent(token)}&orderId=${orderId.value}&userId=${currentUserId.value}`
	ws.value = uni.connectSocket({
		url: wsUrl,
		success: () => {
			console.log('WebSocket 连接中...')
		},
		fail: (err) => {
			console.error('WebSocket 连接失败', err)
		}
	})

	uni.onSocketOpen(() => {
		console.log('WebSocket 已连接')
		isConnected.value = true
	})

	uni.onSocketMessage((res) => {
		try {
			const data = JSON.parse(res.data)
			if (data.type === 'chat') {
				const msg = {
					id: data.id,
					orderId: data.orderId,
					senderId: data.senderId,
					receiverId: data.receiverId,
					senderName: data.senderName || '',
					content: data.content,
					msgType: data.msgType || 0,
					sendTime: data.sendTime || '',
					isSelf: String(data.senderId) === String(currentUserId.value)
				}
				// 避免重复添加
				if (!messages.value.find(m => m.id === msg.id)) {
					messages.value.push(msg)
					scrollToBottom()
				}
			} else if (data.type === 'system') {
				console.log('系统消息:', data.message)
			}
		} catch (e) {
			console.error('解析消息失败', e)
		}
	})

	uni.onSocketError((err) => {
		console.error('WebSocket 错误', err)
		isConnected.value = false
	})

	uni.onSocketClose(() => {
		console.log('WebSocket 已关闭')
		isConnected.value = false
	})
}

// 发送消息
const sendMsg = async () => {
	const text = inputText.value.trim()
	if (!text || !orderId.value || !currentUserId.value || !peerId.value) return

	inputText.value = ''
	uni.showLoading({ title: '发送中...' })
	try {
		const res = await uni.request({
			url: 'http://localhost:8081/api/chat/send',
			method: 'POST',
			data: {
				orderId: Number(orderId.value),
				senderId: Number(currentUserId.value),
				receiverId: Number(peerId.value),
				content: text,
				msgType: 0
			},
			header: {
				Authorization: uni.getStorageSync('token') ? `Bearer ${uni.getStorageSync('token')}` : '',
				'Content-Type': 'application/json'
			}
		})
		const data = res.data
		if (data.code === 200) {
			// 消息通过WebSocket推送回来，这里直接本地添加一条确保显示
			const msg = {
				...data.data,
				isSelf: true
			}
			if (!messages.value.find(m => m.id === msg.id)) {
				messages.value.push(msg)
				scrollToBottom()
			}
		}
	} catch (e) {
		console.error('发送失败', e)
		uni.showToast({ title: '发送失败', icon: 'none' })
	} finally {
		uni.hideLoading()
	}
}

// 预览图片
const previewImage = (url) => {
	uni.previewImage({ urls: [url] })
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f1f1f1;
	/* padding: 20rpx 0; */
}

.chat-header {
	height: 88rpx;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	border-bottom: 1rpx solid #eee;
}

.header-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.chat-list {
	flex: 1;
	padding: 20rpx;
	box-sizing: border-box;
	height: 80vh;
}

.load-more {
	text-align: center;
	padding: 20rpx;
}

.load-text {
	font-size: 24rpx;
	color: #999;
}

.msg-item {
	display: flex;
	margin-bottom: 30rpx;
}

.msg-item.sent {
	flex-direction: row-reverse;
}

.avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 8rpx;
	background-color: #fff;
	flex-shrink: 0;
}

.msg-content {
	max-width: 70%;
	margin: 0 20rpx;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.msg-item.sent .msg-content {
	align-items: flex-end;
}

.bubble {
	padding: 20rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	position: relative;
	word-break: break-all;
	line-height: 1.5;
	width: fit-content;
}

.received .bubble {
	background-color: #fff;
}

.received .bubble::after {
	content: '';
	position: absolute;
	left: -25rpx;
	top: 20rpx;
	border: 14rpx solid transparent;
	border-right-color: #fff;
}

.sent .bubble {
	background-color: #95ec69;
}

.sent .bubble::after {
	content: '';
	position: absolute;
	right: -25rpx;
	top: 20rpx;
	border: 14rpx solid transparent;
	border-left-color: #95ec69;
}

.image-bubble {
	padding: 10rpx;
}

.msg-image {
	max-width: 300rpx;
	max-height: 300rpx;
	border-radius: 8rpx;
}

.msg-time {
	font-size: 20rpx;
	color: #bbb;
	margin-top: 6rpx;
}

.msg-item.sent .msg-time {
	text-align: right;
}

.input-bar {
	padding: 20rpx 15rpx;
	background-color: #f7f7f7;
	display: flex;
	align-items: center;
	border-top: 1rpx solid #ddd;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	z-index: 999;
}

.input {
	flex: 1;
	height: 70rpx;
	background-color: #fff;
	border-radius: 8rpx;
	padding: 0 20rpx;
	margin-right: 20rpx;
	font-size: 28rpx;
}

.send-btn {
	margin: 0;
	width: 140rpx;
}
</style>
