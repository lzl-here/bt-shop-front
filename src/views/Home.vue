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
              :key="category.category_id"
              class="category-item"
              @mouseenter="handleMouseEnter(category)"
              @mouseleave="handleMouseLeave"
            >
              <div class="category-title">
                <el-icon><Folder /></el-icon>
                <span>{{ category.category_name }}</span>
                <el-icon class="arrow"><ArrowRight /></el-icon>
              </div>

              <!-- 二级和三级分类浮层 -->
              <div v-show="activeCategory === category.category_id" class="sub-categories">
                <div v-for="subCat in category.children" :key="subCat.category_id" class="sub-category">
                  <div class="sub-category-title">{{ subCat.category_name }}</div>
                  <div class="third-categories">
                    <router-link 
                      v-for="thirdCat in subCat.children" 
                      :key="thirdCat.category_id"
                      :to="`/products?categoryId=${thirdCat.category_id}`"
                      class="third-category"
                    >
                      {{ thirdCat.category_name }}
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 品牌列表 -->
          <div class="brand-section">
            <div class="section-title">品牌</div>
            <div class="brand-list">
              <router-link 
                v-for="brand in brands" 
                :key="brand.brand_id"
                :to="`/products?brand=${brand.brand_id}`"
                class="brand-item"
              >
                <el-image 
                  :src="brand.icon_url" 
                  class="brand-icon"
                  fit="contain"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <span class="brand-name">{{ brand.brand_name }}</span>
              </router-link>
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
                    <span class="sales">月销 {{ product.sales }}</span>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { getCategoryList, getBrandList } from '../api/goodsApi'
import { 
  ArrowRight, 
  ShoppingBag, 
  Ticket, 
  Shop, 
  Folder,
  Picture
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const categories = ref([])
const brands = ref([])
const activeCategory = ref(null)
const banners = ref([
  {
    id: 1,
    title: '新品上市',
    description: '限时特惠，抢先体验',
    image: 'https://via.placeholder.com/1200x400'
  }
])

const hotProducts = ref([
  {
    id: 1,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    sales: 1000,
    image: 'https://via.placeholder.com/200',
    tags: ['新品', '热销']
  }
])

// 获取分类和品牌数据
const fetchData = async () => {
  try {
    // 获取分类列表
    const categoryResponse = await getCategoryList()
    console.log('Category response:', categoryResponse)
    if (categoryResponse.code === 1) {
      categories.value = categoryResponse.data.category_list || []
    }

    // 获取品牌列表
    const brandResponse = await getBrandList()
    console.log('Brand response:', brandResponse)
    if (brandResponse.code === 1) {
      brands.value = brandResponse.data.brand_list || []
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

onMounted(() => {
  fetchData()
})

const handleMouseEnter = (category) => {
  activeCategory.value = category.category_id
}

const handleMouseLeave = () => {
  activeCategory.value = null
}

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

.brand-section {
  padding: 20px;
  border-top: 1px solid #ebeef5;
  margin-top: 100px;  /* 增加上方间距到 100px */
  padding-top: 40px;  /* 增加内部上方间距到 40px */
}

.section-title {
  font-size: 16px;
  color: #606266;
  margin-bottom: 20px;
}

.brand-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.brand-item {
  padding: 8px 12px;
  color: #606266;
  font-size: 14px;
  transition: all 0.3s;
}

.brand-item:hover {
  color: var(--el-color-primary);
  background-color: #f5f7fa;
}

.brand-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.image-slot {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-name {
  font-size: 14px;
  color: #606266;
}
</style> 