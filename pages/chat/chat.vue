<template>
	<view class="container">
		<scroll-view class="chat-list" scroll-y :scroll-into-view="lastMsgId" scroll-with-animation>
			<view v-for="(msg, index) in messages" :key="index" :id="'msg-' + index"
				class="msg-item" :class="msg.type">
				<image class="avatar" src="/static/logo.png"></image>
				<view class="msg-content">
					<view class="bubble">{{msg.text}}</view>
				</view>
			</view>
		</scroll-view>

		<view class="input-bar">
			<input class="input" type="text" v-model="inputText" placeholder="输入消息..." @confirm="sendMsg" />
			<button class="send-btn" type="primary" size="mini" @click="sendMsg">发送</button>
		</view>
	</view>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const inputText = ref('')
const lastMsgId = ref('')
const messages = ref([
    { type: 'received', text: '您好，我已经接单了，正在取件中。' },
    { type: 'sent', text: '好的，麻烦轻拿轻放，谢谢！' },
    { type: 'received', text: '没问题，我会注意的。' }
])

const sendMsg = () => {
    if (!inputText.value.trim()) return;

    messages.value.push({
        type: 'sent',
        text: inputText.value
    });
    inputText.value = '';
    scrollToBottom();

    setTimeout(() => {
        messages.value.push({
            type: 'received',
            text: '收到。'
        });
        scrollToBottom();
    }, 1000);
}

const scrollToBottom = () => {
    nextTick(() => {
        lastMsgId.value = 'msg-' + (messages.value.length - 1);
    });
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f1f1f1;
}
.chat-list {
	flex: 1;
	padding: 20rpx;
	box-sizing: border-box;
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
}
.msg-content {
	max-width: 70%;
	margin: 0 20rpx;
}
.bubble {
	padding: 20rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	position: relative;
	word-break: break-all;
}
.received .bubble {
	background-color: #fff;
}
.received .bubble::after {
	content: '';
	position: absolute;
	left: -10rpx;
	top: 20rpx;
	border: 10rpx solid transparent;
	border-right-color: #fff;
}
.sent .bubble {
	background-color: #95ec69;
}
.sent .bubble::after {
	content: '';
	position: absolute;
	right: -10rpx;
	top: 20rpx;
	border: 10rpx solid transparent;
	border-left-color: #95ec69;
}
.input-bar {
	padding: 20rpx 15rpx;
	background-color: #f7f7f7;
	display: flex;
	align-items: center;
	border-top: 1rpx solid #ddd;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
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
