<script setup>
import { HomeFilled, Goods, Shop, ShoppingCart } from '@element-plus/icons-vue'
import { useUserStore } from './stores/user'
import { useCartStore } from './stores/cart'
import FooterComponent from './components/FooterComponent.vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { computed, onMounted } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const route = useRoute()

// 判断当前是否为商品搜索页面
const isProductSearch = computed(() => {
  return route.path === '/search' && route.query.type === 'product'
})

// 判断当前是否为店铺搜索页面
const isStoreSearch = computed(() => {
  return route.path === '/search' && route.query.type === 'store'
})

// 处理下拉菜单命令
const handleCommand = async (command) => {
  console.log("Command triggered:", command)
  switch (command) {
    case 'profile':
      await router.push('/user/profile')
      break
    case 'trades':
      await router.push('/user/trades')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        userStore.logout()
        await router.push('/login')
      } catch (error) {
        // 用户取消操作
      }
      break
  }
}

onMounted(() => {
  // 从 localStorage 恢复用户信息
  const savedUserInfo = localStorage.getItem('userInfo')
  if (savedUserInfo) {
    try {
      const userInfo = JSON.parse(savedUserInfo)
      userStore.setUserInfo(userInfo)
    } catch (error) {
      console.error('Failed to parse user info:', error)
      localStorage.removeItem('userInfo')
    }
  }
})
</script>

<template>
  <div class="app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <nav class="nav">
        <router-link to="/" class="logo">
          <img src="../src/assets/logo.png" alt="bt-shop">
          bt-shop
        </router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-item" active-class="active">
            <el-icon><HomeFilled /></el-icon>
            首页
          </router-link>
          <router-link 
            to="/products" 
            class="nav-item"
            :class="{ active: isProductSearch }"
          >
            <el-icon><Goods /></el-icon>
            搜索商品
          </router-link>
          <router-link 
            to="/search?type=store" 
            class="nav-item"
            :class="{ active: isStoreSearch }"
          >
            <el-icon><Shop /></el-icon>
            搜索店铺
          </router-link>
          <router-link 
            v-if="userStore.isLoggedIn" 
            to="/seller" 
            class="nav-item"
            active-class="active"
          >
            <el-icon><Shop /></el-icon>
            我的店铺
          </router-link>
        </div>

        <div class="nav-right">
          <router-link to="/cart" class="cart-link">
            <el-badge :value="cartStore.totalCount" :hidden="!cartStore.totalCount">
              <el-icon><ShoppingCart /></el-icon>
            </el-badge>
          </router-link>

          <!-- 用户未登录时显示登录注册按钮 -->
          <template v-if="!userStore.userInfo">
            <router-link to="/login" class="login-btn">登录</router-link>
            <router-link to="/register" class="register-btn">注册</router-link>
          </template>

          <!-- 用户已登录时显示用户信息 -->
          <el-dropdown v-else @command="handleCommand">
            <div class="user-info">
              <img :src="userStore.userInfo.avatar_url" class="avatar" alt="avatar">
              <span class="username">{{ userStore.userInfo.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="trades">我的交易</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </nav>
    </header>

    <!-- 主要内容区域 -->
    <main class="main">
      <router-view></router-view>
    </main>

    <!-- 页脚 -->
    <FooterComponent />
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: bold;
  color: var(--el-color-primary);
}

.logo img {
  height: 32px;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  color: #333;
  transition: color 0.3s;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
}

.nav-item:hover {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.nav-item.active {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  color: #333;
  font-size: 14px;
}

.login-btn,
.register-btn {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s;
}

.login-btn {
  color: #1890ff;
  border: 1px solid #1890ff;
}

.login-btn:hover {
  background-color: #e6f7ff;
}

.register-btn {
  background-color: #1890ff;
  color: white;
}

.register-btn:hover {
  background-color: #40a9ff;
}

.cart-link {
  color: #666;
  font-size: 24px;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.cart-link:hover {
  color: #1890ff;
}

/* 让路由视图占据剩余空间 */
.router-view {
  flex: 1;
}

/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f7fa;
}

a {
  text-decoration: none;
  color: inherit;
}

.main-content {
  flex: 1;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px - 200px); /* 减去头部和底部的高度 */
}

/* 添加过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
