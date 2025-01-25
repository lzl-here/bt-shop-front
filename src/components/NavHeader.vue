<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <router-link to="/">商城名称</router-link>
      </div>
      <nav class="nav-menu">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/products" class="nav-item">全部商品</router-link>
        <router-link to="/categories" class="nav-item">商品分类</router-link>
        <router-link to="/cart" class="nav-item">
          <el-badge :value="cartCount" class="cart-badge">
            <el-icon><ShoppingCart /></el-icon>
            购物车
          </el-badge>
        </router-link>
      </nav>
      <div class="user-area">
        <template v-if="isLoggedIn">
          <el-dropdown>
            <span class="user-info">
              {{ userInfo.username }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/user/orders')">
                  我的订单
                </el-dropdown-item>
                <el-dropdown-item @click="$router.push('/user/profile')">
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button text @click="$router.push('/login')">登录</el-button>
          <el-button type="primary" @click="$router.push('/register')">
            注册
          </el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'
import { ShoppingCart, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo)
const cartCount = computed(() => cartStore.totalCount)

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
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
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-item {
  color: #666;
  text-decoration: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item:hover {
  color: var(--el-color-primary);
}

.user-area {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.cart-badge :deep(.el-badge__content) {
  background-color: var(--el-color-danger);
}
</style> 