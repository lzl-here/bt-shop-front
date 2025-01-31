<template>
  <header class="nav-header">
    <div class="header-content">
      <!-- Logo和导航组合在一起 -->
      <div class="left-section">
        <router-link to="/" class="logo">
          <img src="../assets/logo.png" alt="bt-shop">
          <span class="logo-text">bt-shop</span>
        </router-link>

        <nav class="main-nav">
          <router-link to="/" class="nav-item">
            <el-icon><HomeFilled /></el-icon>
            首页
          </router-link>
          <router-link 
            to="/productes" 
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
          <router-link v-if="userStore.isLoggedIn" to="/seller" class="nav-item">
            <el-icon><Shop /></el-icon>
            我的店铺
          </router-link>
        </nav>
      </div>

      <!-- 搜索框 -->
      <div class="search-section">
        <el-input
          v-model="searchText"
          placeholder="搜索店铺"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-select 
              v-model="searchType" 
              class="search-type-select"
              popper-class="search-type-popper"
            >
              <el-option label="商品" value="product" />
              <el-option label="店铺" value="store" />
            </el-select>
          </template>
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
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
        <el-dropdown v-else trigger="click">
          <span class="user-info">
            <el-avatar :size="32" :src="userStore.userInfo?.avatar || '/default-avatar.png'" />
            <span class="username">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleMenuClick('profile')">个人中心</el-dropdown-item>
              <el-dropdown-item @click="handleMenuClick('trades')">我的交易</el-dropdown-item>
              <el-dropdown-item divided @click="handleMenuClick('logout')">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'
import { 
  ShoppingCart, 
  Shop, 
  HomeFilled, 
  Goods, 
  Menu,
  Search 
} from '@element-plus/icons-vue'
import logoUrl from '../assets/logo.png'  // 导入logo

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const cartStore = useCartStore()

const searchText = ref('')
const searchType = ref('product')

// 判断当前是否为商品搜索页面
const isProductSearch = computed(() => {
  return route.path === '/search' && route.query.type === 'product'
})

// 判断当前是否为店铺搜索页面
const isStoreSearch = computed(() => {
  return route.path === '/search' && route.query.type === 'store'
})

const handleSearch = () => {
  if (!searchText.value.trim()) return
  
  const query = {
    keyword: searchText.value,
    type: searchType.value
  }
  
  router.push({
    path: '/search',
    query
  })
}

// 处理菜单点击
const handleMenuClick = (command) => {
  console.log("Menu clicked:", command)
  switch (command) {
    case 'profile':
      console.log("Navigating to profile")
      router.push('/user/profile')
      break
    case 'trades':
      console.log("Navigating to trades")
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
  gap: 8px;
  text-decoration: none;
}

.logo img {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
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

.search-section {
  flex: 1;
  max-width: 500px;
  margin: 0 40px;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input-group__prepend) {
  padding: 0;
  border-right: none;
  background-color: #fff;
}

.search-type-select {
  width: 80px;
  border: none;
}

.search-type-select :deep(.el-input__wrapper) {
  box-shadow: none !important;
  padding: 0 8px;
}

.search-type-select :deep(.el-input__inner) {
  text-align: center;
  cursor: pointer;
}

:deep(.search-type-popper) {
  min-width: 80px !important;
}

:deep(.el-select-dropdown__item) {
  padding: 0 12px;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .main-nav {
    display: none;
  }
  
  .left-section {
    gap: 0;
  }
}

.nav-item.active {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}
</style> 