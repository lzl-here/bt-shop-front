<template>
  <div class="user-container">
    <!-- 侧边栏导航 -->
    <div class="sidebar">
      <div class="menu-group">
        <div class="menu-title">个人中心</div>
        <router-link 
          to="/user/profile" 
          class="menu-item"
          active-class="active"
        >
          <el-icon><UserFilled /></el-icon>
          个人资料
        </router-link>
        <router-link 
          to="/user/orders" 
          class="menu-item"
          active-class="active"
        >
          <el-icon><Document /></el-icon>
          我的订单
        </router-link>
        <router-link 
          to="/user/address" 
          class="menu-item"
          active-class="active"
        >
          <el-icon><Location /></el-icon>
          收货地址
        </router-link>
      </div>

      <div class="menu-group">
        <div class="menu-title">账户设置</div>
        <router-link 
          to="/user/security" 
          class="menu-item"
          active-class="active"
        >
          <el-icon><Lock /></el-icon>
          账户安全
        </router-link>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { UserFilled, Document, Location, Lock } from '@element-plus/icons-vue'
</script>

<style scoped>
.user-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  display: flex;
  gap: 20px;
}

.sidebar {
  width: 240px;
  background: #fff;
  border-radius: 8px;
  padding: 20px 0;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  position: sticky;
  top: 80px;
  height: fit-content;
}

.menu-group {
  padding: 0 16px;
  margin-bottom: 24px;
}

.menu-group:last-child {
  margin-bottom: 0;
}

.menu-title {
  color: #909399;
  font-size: 13px;
  padding: 0 12px;
  margin-bottom: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  color: #606266;
  border-radius: 6px;
  transition: all 0.3s;
  margin-bottom: 4px;
  text-decoration: none;
  font-size: 14px;
}

.menu-item:hover {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.menu-item.active {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
  font-weight: 500;
}

.menu-item :deep(.el-icon) {
  font-size: 18px;
}

.main-content {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  min-height: calc(100vh - 140px);
}

@media screen and (max-width: 768px) {
  .user-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    position: static;
  }

  .main-content {
    min-height: auto;
  }
}
</style> 