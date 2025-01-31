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

    <!-- 分类导航 -->
    <div class="content-container">
      <div class="main-layout">
        <!-- 左侧分类导航 -->
        <div class="category-nav">
          <div class="category-list">
            <!-- 一级分类 -->
            <div 
              v-for="category in categories" 
              :key="category.id"
              class="category-item"
              @mouseenter="handleMouseEnter(category)"
              @mouseleave="handleMouseLeave"
            >
              <div class="category-title">
                <el-icon><Folder /></el-icon>
                <span>{{ category.name }}</span>
                <el-icon class="arrow"><ArrowRight /></el-icon>
              </div>

              <!-- 二级和三级分类浮层 -->
              <div v-show="activeCategory === category.id" class="sub-categories">
                <div v-for="subCat in category.children" :key="subCat.id" class="sub-category">
                  <div class="sub-category-title">{{ subCat.name }}</div>
                  <div class="third-categories">
                    <router-link 
                      v-for="thirdCat in subCat.children" 
                      :key="thirdCat.id"
                      :to="`/products?categoryId=${thirdCat.id}`"
                      class="third-category"
                    >
                      {{ thirdCat.name }}
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 中间内容区域 -->
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
          <div class="hot-products">
            <div class="section-header">
              <h2 class="section-title">热门商品</h2>
              <router-link to="/products" class="view-more">
                更多商品
                <el-icon><ArrowRight /></el-icon>
              </router-link>
            </div>

            <div class="product-grid">
              <div 
                v-for="product in hotProducts" 
                :key="product.id" 
                class="product-card"
                @click="viewProduct(product.id)"
              >
                <div class="product-image">
                  <img :src="product.image" :alt="product.name">
                  <div class="product-tags">
                    <el-tag 
                      v-for="tag in product.tags" 
                      :key="tag"
                      :type="tag === '新品' ? 'success' : 'danger'"
                      size="small"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
                <div class="product-info">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <div class="product-price">
                    <span class="price">¥{{ product.price }}</span>
                    <span class="sales">月销 {{ product.sales }}+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
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

    <!-- 导航栏部分 -->
    <div class="nav-links">
      <router-link to="/" class="nav-link">
        <el-icon><HomeFilled /></el-icon>
        <span>首页</span>
      </router-link>
      <router-link to="/products" class="nav-link">
        <el-icon><Search /></el-icon>
        <span>搜索商品</span>
      </router-link>
      <router-link to="/store/search" class="nav-link">
        <el-icon><Shop /></el-icon>
        <span>搜索店铺</span>
      </router-link>
      <router-link v-if="userStore.hasStore" to="/seller" class="nav-link">
        <el-icon><Shop /></el-icon>
        <span>我的店铺</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ArrowRight, ShoppingBag, Ticket, Shop, Star, ShoppingCart, Timer, QuestionFilled, ChatDotRound, Location, Bell, Folder, HomeFilled, Search } from '@element-plus/icons-vue'

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

// 分类数据
const categories = ref([
  {
    id: 1,
    name: '数码办公',
    children: [
      {
        id: 11,
        name: '手机',
        children: [
          { id: 111, name: '华为' },
          { id: 112, name: '苹果' },
          { id: 113, name: '小米' },
          { id: 114, name: 'OPPO' },
          { id: 115, name: 'vivo' }
        ]
      },
      {
        id: 12,
        name: '电脑',
        children: [
          { id: 121, name: '笔记本' },
          { id: 122, name: '台式机' },
          { id: 123, name: '平板电脑' },
          { id: 124, name: '一体机' }
        ]
      },
      {
        id: 13,
        name: '办公设备',
        children: [
          { id: 131, name: '打印机' },
          { id: 132, name: '投影仪' },
          { id: 133, name: '扫描仪' },
          { id: 134, name: '复印机' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '家用电器',
    children: [
      {
        id: 21,
        name: '大家电',
        children: [
          { id: 211, name: '电视' },
          { id: 212, name: '空调' },
          { id: 213, name: '冰箱' },
          { id: 214, name: '洗衣机' }
        ]
      },
      {
        id: 22,
        name: '厨房电器',
        children: [
          { id: 221, name: '微波炉' },
          { id: 222, name: '电饭煲' },
          { id: 223, name: '电磁炉' },
          { id: 224, name: '烤箱' }
        ]
      },
      {
        id: 23,
        name: '生活电器',
        children: [
          { id: 231, name: '吸尘器' },
          { id: 232, name: '电风扇' },
          { id: 233, name: '加湿器' },
          { id: 234, name: '净化器' }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '服装鞋帽',
    children: [
      {
        id: 31,
        name: '女装',
        children: [
          { id: 311, name: '连衣裙' },
          { id: 312, name: 'T恤' },
          { id: 313, name: '衬衫' },
          { id: 314, name: '外套' }
        ]
      },
      {
        id: 32,
        name: '男装',
        children: [
          { id: 321, name: '夹克' },
          { id: 322, name: '西装' },
          { id: 323, name: '休闲裤' },
          { id: 324, name: '运动装' }
        ]
      },
      {
        id: 33,
        name: '鞋靴',
        children: [
          { id: 331, name: '运动鞋' },
          { id: 332, name: '皮鞋' },
          { id: 333, name: '靴子' },
          { id: 334, name: '凉鞋' }
        ]
      }
    ]
  },
  {
    id: 4,
    name: '美妆护肤',
    children: [
      {
        id: 41,
        name: '面部护理',
        children: [
          { id: 411, name: '面霜' },
          { id: 412, name: '精华' },
          { id: 413, name: '面膜' },
          { id: 414, name: '洁面' }
        ]
      },
      {
        id: 42,
        name: '彩妆',
        children: [
          { id: 421, name: '口红' },
          { id: 422, name: '粉底' },
          { id: 423, name: '眼影' },
          { id: 424, name: '腮红' }
        ]
      },
      {
        id: 43,
        name: '香水',
        children: [
          { id: 431, name: '女士香水' },
          { id: 432, name: '男士香水' },
          { id: 433, name: '中性香水' }
        ]
      }
    ]
  },
  {
    id: 5,
    name: '食品生鲜',
    children: [
      {
        id: 51,
        name: '生鲜',
        children: [
          { id: 511, name: '水果' },
          { id: 512, name: '蔬菜' },
          { id: 513, name: '肉类' },
          { id: 514, name: '海鲜' }
        ]
      },
      {
        id: 52,
        name: '零食',
        children: [
          { id: 521, name: '饼干' },
          { id: 522, name: '糖果' },
          { id: 523, name: '坚果' },
          { id: 524, name: '膨化食品' }
        ]
      },
      {
        id: 53,
        name: '饮料',
        children: [
          { id: 531, name: '茶饮料' },
          { id: 532, name: '碳酸饮料' },
          { id: 533, name: '果汁' },
          { id: 534, name: '咖啡' }
        ]
      }
    ]
  }
])

const activeCategory = ref(null)

const handleMouseEnter = (category) => {
  activeCategory.value = category.id
}

const handleMouseLeave = () => {
  activeCategory.value = null
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

.category-nav {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  height: fit-content;  /* 高度适应内容 */
}

.category-list {
  position: relative;
}

.category-item {
  position: relative;
  padding: 12px 20px;
  cursor: pointer;
}

.category-item:hover {
  background-color: #f5f7fa;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.arrow {
  margin-left: auto;
  font-size: 12px;
  color: #909399;
}

.sub-categories {
  position: absolute;
  left: 200px;
  top: 0;
  min-width: 400px;
  min-height: 100%;
  padding: 20px;
  background: #fff;
  box-shadow: 2px 0 12px 0 rgba(0,0,0,0.1);
  z-index: 10;
}

.sub-category {
  margin-bottom: 20px;
}

.sub-category:last-child {
  margin-bottom: 0;
}

.sub-category-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 12px;
}

.third-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.third-category {
  font-size: 13px;
  color: #606266;
  text-decoration: none;
}

.third-category:hover {
  color: var(--el-color-primary);
}

.main-layout {
  display: grid;
  grid-template-columns: 200px 1fr 250px;  /* 修改为三栏布局 */
  gap: 20px;
}

.main-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.promotion-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
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
    grid-template-columns: 200px 1fr;  /* 隐藏右侧边栏 */
  }
  
  .right-sidebar {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .main-layout {
    grid-template-columns: 1fr;  /* 在移动端变为单列 */
  }
  
  .category-nav {
    display: none;  /* 在移动端隐藏分类导航 */
  }
}

.hot-products {
  margin: 30px 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.1);
}

.product-image {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 1:1 宽高比 */
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
}

.product-info {
  padding: 12px;
}

.product-name {
  margin: 0 0 8px;
  font-size: 14px;
  color: #303133;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: 500;
}

.sales {
  color: #909399;
  font-size: 12px;
}

@media screen and (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .product-info {
    padding: 8px;
  }

  .product-name {
    font-size: 13px;
    height: 36px;
  }

  .price {
    font-size: 16px;
  }
}

/* 导航栏部分 */
.nav-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.nav-link {
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

.nav-link:hover {
  color: var(--el-color-primary);
  background: #f5f7fa;
}
</style> 