<template>
  <div class="home">
    <!-- 轮播图部分使用全宽容器 -->
    <div class="banner-container">
      <div class="banner-section">
        <el-carousel height="400px" :interval="4000" arrow="hover">
          <el-carousel-item v-for="item in banners" :key="item.id">
            <div class="banner-content">
              <img :src="item.image" :alt="item.title" class="banner-image">
              <div class="banner-info">
                <h2>{{ item.title }}</h2>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <!-- 三栏布局容器 -->
    <div class="content-container">
      <div class="main-layout">
        <!-- 左侧商品分类 -->
        <div class="left-sidebar">
          <h2 class="sidebar-title">商品分类</h2>
          <div class="category-list">
            <div class="category-item">
              <router-link to="/products?category=digital">
                数码办公 / 手机通讯 / 摄影摄像
              </router-link>
            </div>
            <div class="category-item">
              <router-link to="/products?category=appliance">
                家用电器 / 大家电 / 生活电器
              </router-link>
            </div>
            <div class="category-item">
              <router-link to="/products?category=clothing">
                服装鞋帽 / 女装 / 男装
              </router-link>
            </div>
            <div class="category-item">
              <router-link to="/products?category=food">
                食品饮料 / 进口食品 / 地方特产
              </router-link>
            </div>
            <div class="category-item">
              <router-link to="/products?category=bags">
                礼品箱包 / 潮流女包 / 时尚男包
              </router-link>
            </div>
            <div class="category-item">
              <router-link to="/products?category=beauty">
                个护化妆 / 面部护理 / 身体护理
              </router-link>
            </div>
            <div class="category-item">
              <router-link to="/products?category=kitchen">
                厨房餐饮 / 烹饪锅具 / 刀剪菜板
              </router-link>
            </div>
            <div class="category-item">
              <router-link to="/products?category=furniture">
                家居家装 / 家纺 / 灯具
              </router-link>
            </div>
            <div class="category-item">
              <router-link to="/products?category=auto">
                汽车用品 / 电子电器 / 系统养护
              </router-link>
            </div>
            <div class="category-item">
              <router-link to="/products?category=toys">
                玩具乐器 / 适用年龄 / 遥控/电动
              </router-link>
            </div>
          </div>
        </div>

        <!-- 中间营销信息 -->
        <div class="main-content">
          <!-- 营销活动入口 -->
          <div class="promotion-links">
            <div class="promotion-item">
              <router-link to="/group-buy">
                <el-icon><ShoppingBag /></el-icon>
                <span>团购</span>
              </router-link>
            </div>
            <div class="promotion-item">
              <router-link to="/coupons">
                <el-icon><Ticket /></el-icon>
                <span>优惠券</span>
              </router-link>
            </div>
            <div class="promotion-item">
              <router-link to="/seller">
                <el-icon><Shop /></el-icon>
                <span>商家中心</span>
              </router-link>
            </div>
          </div>

          <!-- 热门商品部分 -->
          <div class="section hot-products-section">
            <div class="section-header">
              <h2 class="section-title">热门商品</h2>
              <router-link to="/products" class="view-more">
                更多商品 <el-icon><ArrowRight /></el-icon>
              </router-link>
            </div>
            <div class="product-grid">
              <el-card 
                v-for="product in hotProducts" 
                :key="product.id"
                class="product-card"
                :body-style="{ padding: '0px' }"
                shadow="hover"
                @click="viewProduct(product.id)"
              >
                <div class="product-image-wrapper">
                  <img :src="product.image" :alt="product.name" class="product-image">
                  <div class="product-tags" v-if="product.tags">
                    <el-tag v-for="tag in product.tags" :key="tag" size="small" effect="dark">
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
                <div class="product-info">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-meta">
                    <div class="product-price">¥{{ product.price }}</div>
                    <div class="product-sales">月销 {{ product.sales }}+</div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>

        <!-- 右侧个人信息 -->
        <div class="right-sidebar">
          <!-- 用户信息 -->
          <div class="user-panel">
            <template v-if="userStore.isLoggedIn">
              <div class="user-info">
                <el-avatar :size="60" :src="userStore.userInfo?.avatar || '/default-avatar.png'" />
                <div class="welcome-text">
                  Hi，{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}
                </div>
              </div>
            </template>
            <template v-else>
              <div class="login-panel">
                <p>Hi, 欢迎来到bt-shop</p>
                <div class="auth-buttons">
                  <router-link to="/login" class="login-btn">登录</router-link>
                  <router-link to="/register" class="register-btn">注册</router-link>
                </div>
              </div>
            </template>
          </div>

          <!-- 快捷功能入口 -->
          <div class="quick-links">
            <div class="quick-link-row">
              <router-link to="/user/favorites">
                <el-icon><Star /></el-icon>
                <span>宝贝收藏</span>
              </router-link>
              <router-link to="/user/store">
                <el-icon><Shop /></el-icon>
                <span>收藏店铺</span>
              </router-link>
            </div>
            <div class="quick-link-row">
              <router-link to="/cart">
                <el-icon><ShoppingCart /></el-icon>
                <span>购物车</span>
              </router-link>
              <router-link to="/user/history">
                <el-icon><Timer /></el-icon>
                <span>我的足迹</span>
              </router-link>
            </div>
            <div class="quick-link-row">
              <router-link to="/help">
                <el-icon><QuestionFilled /></el-icon>
                <span>帮助中心</span>
              </router-link>
              <router-link to="/feedback">
                <el-icon><ChatDotRound /></el-icon>
                <span>我的评论</span>
              </router-link>
            </div>
            <div class="quick-link-row">
              <router-link to="/address">
                <el-icon><Location /></el-icon>
                <span>收货地址</span>
              </router-link>
              <router-link to="/messages">
                <el-icon><Bell /></el-icon>
                <span>我的消息</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ArrowRight, ShoppingBag, Ticket, Shop, Star, ShoppingCart, Timer, QuestionFilled, ChatDotRound, Location, Bell } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 模拟数据
const banners = ref([
  {
    id: 1,
    image: 'https://via.placeholder.com/1200x400',
    title: '华为 Mate 60 Pro',
    description: '突破性的技术创新，卓越的影像体验',
    productId: 1
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/1200x400',
    title: '限时特惠',
    description: '精选商品低至5折',
    productId: 2
  }
])

const hotProducts = ref([
  {
    id: 1,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    sales: 1000,
    tags: ['新品', '热销']
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    price: 7999,
    image: 'https://via.placeholder.com/200x200',
    sales: 800,
    tags: ['新品']
  },
  {
    id: 3,
    name: '小米14 Pro',
    price: 4999,
    image: 'https://via.placeholder.com/200x200',
    sales: 1200,
    tags: ['热销']
  }
])

const viewProduct = (productId) => {
  router.push(`/products/${productId}`)
}
</script>

<style scoped>
.home {
  width: 100%;
  margin: 0;
  padding: 0;
}

/* 轮播图容器样式 */
.banner-container {
  width: 100%;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.banner-section {
  width: 88%;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
}

/* 内容区域容器 */
.content-container {
  max-width: 88%;
  margin: 0 auto;
  padding: 0 20px;
}

.banner-content {
  position: relative;
  height: 100%;
  width: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-info {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  max-width: 50%;  /* 限制文字宽度 */
}

.banner-info h2 {
  font-size: 36px;
  margin-bottom: 15px;
}

.banner-info p {
  font-size: 18px;
  opacity: 0.9;
}

.section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.view-more {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  text-decoration: none;
  transition: color 0.3s;
}

.view-more:hover {
  color: var(--el-color-primary);
}

.category-list {
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.category-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.category-item:last-child {
  border-bottom: none;
}

.category-item a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-item a:hover {
  color: var(--el-color-primary);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image-wrapper {
  position: relative;
  padding-top: 100%;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 14px;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 42px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}

.product-sales {
  font-size: 12px;
  color: #909399;
}

.main-layout {
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  gap: 20px;
  margin-top: -20px;
}

.left-sidebar {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  padding: 15px 20px;
  margin: 0;
  font-size: 18px;
  border-bottom: 1px solid #f0f0f0;
}

.promotion-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}

.promotion-item a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #333;
  text-decoration: none;
  padding: 15px;
  border-radius: 4px;
  transition: all 0.3s;
}

.promotion-item a:hover {
  color: var(--el-color-primary);
  background: #f5f7fa;
}

.right-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-panel {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.welcome-text {
  font-size: 16px;
  color: #333;
}

.login-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.auth-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.quick-links {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
}

.quick-link-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
}

.quick-link-row:last-child {
  margin-bottom: 0;
}

.quick-link-row a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
}

.quick-link-row a:hover {
  color: var(--el-color-primary);
  background: #f5f7fa;
}

@media screen and (max-width: 1200px) {
  .main-layout {
    grid-template-columns: 200px 1fr;
  }
  
  .right-sidebar {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  
  .left-sidebar {
    display: none;
  }
}
</style> 