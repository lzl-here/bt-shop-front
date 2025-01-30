<script setup>
import { HomeFilled, Goods, Shop, ShoppingCart } from '@element-plus/icons-vue'
import { useUserStore } from './stores/user'
import { useCartStore } from './stores/cart'
import FooterComponent from './components/FooterComponent.vue'

const userStore = useUserStore()
const cartStore = useCartStore()
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
          <router-link to="/" class="nav-item">
            <el-icon><HomeFilled /></el-icon>
            首页
          </router-link>
          <router-link to="/products" class="nav-item">
            <el-icon><Goods /></el-icon>
            全部商品
          </router-link>
          <router-link v-if="userStore.isLoggedIn" to="/seller" class="nav-item">
            <el-icon><Shop /></el-icon>
            我的店铺
          </router-link>
        </div>

        <!-- 用户操作区 -->
        <div class="user-actions">
          <!-- 购物车图标 -->
          <router-link to="/cart" class="cart-link">
            <el-badge :value="cartStore.totalItems" :hidden="!cartStore.totalItems">
              <el-icon :size="24"><ShoppingCart /></el-icon>
            </el-badge>
          </router-link>

          <!-- 用户登录状态 -->
          <router-link v-if="!userStore.isLoggedIn" to="/login" class="login-btn">
            登录
          </router-link>
          <router-link v-if="!userStore.isLoggedIn" to="/register" class="register-btn">
            注册
          </router-link>
          <el-dropdown v-else @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="userStore.userInfo?.avatar || '/default-avatar.png'" />
              <span class="username">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </nav>
    </header>

    <router-view></router-view>
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
}

.nav-item:hover {
  color: var(--el-color-primary);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.cart-link {
  color: #333;
  transition: color 0.3s;
}

.cart-link:hover {
  color: var(--el-color-primary);
}

.login-btn,
.register-btn {
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s;
}

.login-btn {
  border: 1px solid var(--el-color-primary);
  color: var(--el-color-primary);
}

.register-btn {
  background-color: var(--el-color-primary);
  color: #fff;
}

.login-btn:hover {
  background-color: var(--el-color-primary-light-9);
}

.register-btn:hover {
  background-color: var(--el-color-primary-light-3);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #333;
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
</style>
