<template>
  <header class="header">
    <div class="header-content">
      <div class="left">
        <router-link to="/" class="logo">
          <img src="../assets/logo.png" alt="Logo">
        </router-link>
        <nav class="nav-links">
          <router-link to="/">首页</router-link>
          <router-link to="/products">全部商品</router-link>
          <router-link to="/categories">商品分类</router-link>
          <router-link to="/cart" class="nav-cart-link">
            <el-badge :value="cartStore.totalItems" :hidden="!cartStore.totalItems">
              购物车
            </el-badge>
          </router-link>
        </nav>
      </div>
      <div class="right">
        <template v-if="userStore.isLoggedIn">
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              <el-avatar 
                :size="32" 
                :src="userStore.userInfo?.avatar || '/default-avatar.png'"
              />
              <span class="username">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人资料
                </el-dropdown-item>
                <el-dropdown-item command="orders">
                  <el-icon><List /></el-icon>我的订单
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <router-link to="/cart" class="cart-link">
            <el-badge :value="cartStore.totalItems" :hidden="!cartStore.totalItems">
              <el-icon :size="24"><ShoppingCart /></el-icon>
            </el-badge>
          </router-link>
        </template>
        <template v-else>
          <router-link to="/login" class="login-btn">登录</router-link>
          <router-link to="/register" class="register-btn">注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'
import { User, List, SwitchButton, ShoppingCart, Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const searchKeyword = ref('')

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'orders':
      router.push('/user/orders')
      break
    case 'logout':
      userStore.logout()
      router.push('/login')
      break
  }
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/products',
      query: { keyword: searchKeyword.value }
    })
  }
}
</script>

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 50px;
  border-radius: 8px;
  object-fit: contain;
  padding: 5px;
  transition: transform 0.3s;
}

.logo img:hover {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  font-size: 16px;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--el-color-primary);
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-dropdown {
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
  color: #333;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.login-btn,
.register-btn {
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
}

.login-btn {
  color: var(--el-color-primary);
}

.register-btn {
  background: var(--el-color-primary);
  color: #fff;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-cart-link {
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav-cart-link :deep(.el-badge__content) {
  background-color: #f56c6c;
}

@media screen and (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .username {
    display: none;
  }
}
</style> 