<template>
  <div class="user-home">
    <div class="welcome-section">
      <h2>个人中心</h2>
      <p>欢迎回来，{{ userStore.userInfo?.username }}</p>
    </div>

    <div class="info-section">
      <h3 class="section-title">账号信息</h3>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-header">
            <el-icon><User /></el-icon>
            <span>基本信息</span>
          </div>
          <div class="info-content">
            <div class="info-item">
              <span class="label">用户名</span>
              <span class="value">{{ userStore.userInfo?.username }}</span>
            </div>
            <div class="info-item">
              <span class="label">用户ID</span>
              <span class="value">{{ userStore.userInfo?.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">注册方式</span>
              <span class="value">{{ userStore.userInfo?.register_type === 'normal' ? '普通注册' : '微信注册' }}</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-header">
            <el-icon><Avatar /></el-icon>
            <span>头像信息</span>
          </div>
          <div class="info-content avatar-content">
            <img :src="userStore.userInfo?.avatar_url" alt="avatar" class="avatar-large">
            <el-button type="primary" size="small">修改头像</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h3 class="section-title">快捷操作</h3>
      <div class="action-grid">
        <div class="action-card" @click="$router.push('/user/trades')">
          <el-icon><List /></el-icon>
          <span>我的订单</span>
        </div>
        <div class="action-card" @click="$router.push('/user/address')">
          <el-icon><Location /></el-icon>
          <span>收货地址</span>
        </div>
        <div class="action-card" @click="$router.push('/user/security')">
          <el-icon><Lock /></el-icon>
          <span>账号安全</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../../stores/user'
import { User, Avatar, List, Location, Lock } from '@element-plus/icons-vue'

const userStore = useUserStore()
</script>

<style scoped>
.user-home {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.welcome-section {
  margin-bottom: 24px;
}

.welcome-section h2 {
  font-size: 24px;
  color: #333;
  margin: 0 0 8px 0;
}

.welcome-section p {
  color: #666;
  font-size: 14px;
}

.section-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.info-header .el-icon {
  font-size: 20px;
  color: #1890ff;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item .label {
  color: #909399;
  font-size: 14px;
}

.info-item .value {
  color: #333;
  font-size: 14px;
}

.avatar-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e8e8e8;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-card:hover {
  background: #e6f4ff;
  transform: translateY(-2px);
}

.action-card .el-icon {
  font-size: 24px;
  color: #1890ff;
}

.action-card span {
  font-size: 14px;
  color: #333;
}
</style> 