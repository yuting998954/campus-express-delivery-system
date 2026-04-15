<script setup>
import { getToken, setUserInfo } from '@/utils/storage.js'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
    console.log('App Launch')
})

onShow(() => {
    console.log('App Show')
    // 每次进入小程序时，刷新用户信息（防止管理员审核后状态未更新）
    refreshUserInfo()
})

onHide(() => {
    console.log('App Hide')
})

// 刷新用户信息
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
</script>

<style>
page {
    background-color: #f5f5f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
        'Segoe UI', Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
        sans-serif;
}
</style>
