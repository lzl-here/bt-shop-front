<template>
  <header class="nav-header">
    <div class="header-content">
      <!-- Logo和导航组合在一起 -->
      <div class="left-section">
        <router-link to="/" class="logo">
          <Logo />
        </router-link>

        <nav class="main-nav">
          <router-link to="/" class="nav-item">
            <el-icon><HomeFilled /></el-icon>
            首页
          </router-link>
          <router-link to="/products" class="nav-item">
            <el-icon><Goods /></el-icon>
            全部商品
          </router-link>
          <router-link to="/categories" class="nav-item">
            <el-icon><Menu /></el-icon>
            商品分类
          </router-link>
          <router-link v-if="userStore.isLoggedIn" to="/seller" class="nav-item">
            <el-icon><Shop /></el-icon>
            我的店铺
          </router-link>
        </nav>
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
              <el-dropdown-item command="orders">我的交易</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'
import { 
  ShoppingCart, 
  Shop, 
  HomeFilled, 
  Goods, 
  Menu 
} from '@element-plus/icons-vue'
import Logo from './Logo.vue'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'orders':
      router.push('/user/trades')
      break
    case 'logout':
      userStore.logout()
      router.push('/login')
      break
  }
}
</script>

<style scoped>
.nav-header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 40px;  /* Logo和导航之间的间距 */
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.main-nav {
  display: flex;
  gap: 30px;
}

.nav-item {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--el-color-primary);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.login-btn,
.register-btn {
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s;
}

.login-btn {
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

.cart-link {
  display: flex;
  align-items: center;
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.cart-link:hover {
  color: var(--el-color-primary);
}

@media screen and (max-width: 768px) {
  .main-nav {
    display: none;
  }
  
  .left-section {
    gap: 0;
  }
}
</style> 