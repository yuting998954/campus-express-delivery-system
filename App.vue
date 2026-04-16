<script setup>
import { ref } from 'vue'
import { getToken, setUserInfo, getUserInfo } from '@/utils/storage.js'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

let socketTask = null
let isConnecting = false

onLaunch(() => {
    console.log('App Launch')
})

onShow(() => {
    console.log('App Show')
    refreshUserInfo()
    connectWebSocket()
})

onHide(() => {
    closeWebSocket()
})

const refreshUserInfo = async () => {
    const token = getToken()
    if (!token) return

    try {
        const res = await uni.request({
            url: 'http://localhost:8081/api/user/info',
            method: 'GET',
            header: {
                Authorization: `Bearer ${token}`
            }
        })
        if (res.data && res.data.code === 200 && res.data.data) {
            setUserInfo(res.data.data)
            console.log('用户信息已刷新:', res.data.data)
        }
    } catch (e) {
        console.error('刷新用户信息失败', e)
    }
}

// 建立 WebSocket 连接
const connectWebSocket = () => {
    const token = getToken()
    const user = getUserInfo()
    if (!token || !user || !user.id) return
    if (isConnecting || (socketTask && socketTask.readyState === 0)) return

    isConnecting = true
    const wsUrl = `ws://localhost:8081/ws/chat?token=${token}&orderId=0&userId=${user.id}`

    socketTask = uni.connectSocket({
        url: wsUrl,
        success: () => {
            console.log('WebSocket 连接中...')
        }
    })

    socketTask.onOpen(() => {
        console.log('WebSocket 连接成功')
        isConnecting = false
    })

    socketTask.onMessage((res) => {
        try {
            const data = JSON.parse(res.data)
            handleSocketMessage(data)
        } catch (e) {
            console.error('解析 WebSocket 消息失败', e)
        }
    })

    socketTask.onError(() => {
        console.log('WebSocket 连接错误')
        isConnecting = false
    })

    socketTask.onClose(() => {
        console.log('WebSocket 连接关闭')
        socketTask = null
        isConnecting = false
    })
}

const closeWebSocket = () => {
    if (socketTask) {
        socketTask.close()
        socketTask = null
    }
}

// 处理 WebSocket 消息
const handleSocketMessage = (data) => {
    if (data.type === 'dispute_result') {
        // 纠纷仲裁结果通知
        uni.showModal({
            title: data.title || '纠纷仲裁结果',
            content: data.message,
            showCancel: false,
            success: () => {
                // 刷新消息列表
                uni.$emit('refreshMessages')
                // 如果当前在订单详情页，刷新订单状态
                uni.$emit('refreshOrderDetail')
            }
        })
    } else if (data.type === 'order') {
        // 订单状态变更通知
        uni.$emit('refreshOrderDetail')
    } else if (data.type === 'auth_approve') {
        // 认证通过通知
        refreshUserInfo()
        uni.showToast({ title: data.message, icon: 'none' })
    } else if (data.type === 'auth_reject') {
        // 认证驳回通知
        refreshUserInfo()
        uni.showToast({ title: data.message, icon: 'none' })
    }
}
</script>

<style>
page {
    background-color: #f5f5f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
        'Segoe UI', Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
        sans-serif;
}
</style>
