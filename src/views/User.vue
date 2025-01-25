<template>
  <div class="user-container">
    <div class="user-sidebar">
      <div class="user-info">
        <div class="avatar">
          <img :src="userStore.avatar || '/images/default-avatar.png'" alt="用户头像">
        </div>
        <div class="username">{{ userStore.username }}</div>
      </div>
      <nav class="sidebar-nav">
        <router-link 
          to="/user/profile" 
          class="nav-item"
          active-class="active"
        >
          <i class="fas fa-user"></i>
          个人资料
        </router-link>
        <router-link 
          to="/user/orders" 
          class="nav-item"
          active-class="active"
        >
          <i class="fas fa-shopping-bag"></i>
          我的订单
        </router-link>
        <a @click="handleLogout" class="nav-item logout">
          <i class="fas fa-sign-out-alt"></i>
          退出登录
        </a>
      </nav>
    </div>
    <div class="user-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

export default {
  name: 'User',
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    const handleLogout = async () => {
      try {
        await userStore.logout()
        router.push('/login')
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    }

    return {
      userStore,
      handleLogout
    }
  }
}
</script>

<style scoped>
.user-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  display: flex;
  gap: 20px;
  min-height: calc(100vh - 200px);
}

.user-sidebar {
  width: 240px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px 0;
}

.user-info {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 10px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-size: 16px;
  color: #333;
  margin-top: 10px;
}

.sidebar-nav {
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.nav-item i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.nav-item:hover {
  color: var(--primary-color);
  background-color: #f5f5f5;
}

.nav-item.active {
  color: var(--primary-color);
  background-color: #f0f7ff;
  border-right: 3px solid var(--primary-color);
}

.logout {
  color: #ff4d4f;
}

.logout:hover {
  color: #ff4d4f;
  background-color: #fff1f0;
}

.user-content {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

@media (max-width: 768px) {
  .user-container {
    flex-direction: column;
  }

  .user-sidebar {
    width: 100%;
  }
}
</style> 