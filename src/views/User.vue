<template>
  <div class="user-layout">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="user-card">
        <div class="avatar">
          <img :src="userStore.userInfo?.avatar_url" alt="avatar">
        </div>
        <div class="user-info">
          <h3>{{ userStore.userInfo?.username }}</h3>
          <el-tag size="small" :type="userStore.userInfo?.register_type === 'normal' ? 'primary' : 'success'">
            {{ userStore.userInfo?.register_type === 'normal' ? '普通用户' : '微信用户' }}
          </el-tag>
        </div>
        <div class="user-details">
          <div class="detail-item">
            <span class="label">用户ID:</span>
            <span class="value">{{ userStore.userInfo?.id }}</span>
          </div>
          <div class="detail-item">
            <span class="label">注册方式:</span>
            <span class="value">{{ userStore.userInfo?.register_type === 'normal' ? '普通注册' : '微信注册' }}</span>
          </div>
        </div>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="menu"
        router
      >
        <el-menu-item index="/user">
          <el-icon><User /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
        <el-menu-item index="/user/trades">
          <el-icon><List /></el-icon>
          <span>我的交易</span>
        </el-menu-item>
        <el-menu-item index="/user/address">
          <el-icon><Location /></el-icon>
          <span>收货地址</span>
        </el-menu-item>
        <el-menu-item index="/user/security">
          <el-icon><Lock /></el-icon>
          <span>账号安全</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { User, List, Location, Lock } from '@element-plus/icons-vue'

const route = useRoute()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)
</script>

<style scoped>
.user-layout {
  display: flex;
  min-height: calc(100vh - 60px);
  background: #f5f7fa;
  padding: 20px;
  gap: 20px;
}

.sidebar {
  width: 280px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.user-card {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e8e8e8;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info h3 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #333;
}

.user-details {
  margin-top: 16px;
  text-align: left;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-item .label {
  color: #909399;
}

.detail-item .value {
  color: #606266;
}

.menu {
  border-right: none;
  margin-top: 12px;
}

.main-content {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  min-width: 0; /* 防止内容溢出 */
}

:deep(.el-menu-item) {
  border-radius: 4px;
  margin: 4px 8px;
  height: 44px;
}

:deep(.el-menu-item.is-active) {
  background-color: #e6f4ff;
  color: #1890ff;
}

:deep(.el-menu-item:hover) {
  background-color: #f5f5f5;
}

:deep(.el-menu-item .el-icon) {
  margin-right: 10px;
}

:deep(.el-tag) {
  margin-bottom: 16px;
}
</style> 