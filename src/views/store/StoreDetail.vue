<template>
  <div class="store-detail">
    <!-- 店铺头部信息 -->
    <div class="store-header">
      <el-card>
        <div class="store-info">
          <el-avatar :size="80" :src="store.logo" />
          <div class="store-main-info">
            <h1 class="store-name">{{ store.name }}</h1>
            <div class="store-desc">{{ store.description }}</div>
            <div class="store-stats">
              <div class="stat-item">
                <div class="value">{{ store.productCount }}</div>
                <div class="label">全部商品</div>
              </div>
              <div class="stat-item">
                <div class="value">{{ store.salesCount }}</div>
                <div class="label">总销量</div>
              </div>
              <div class="stat-item">
                <div class="value">{{ store.rating }}%</div>
                <div class="label">好评率</div>
              </div>
            </div>
          </div>
          <div class="store-actions">
            <el-button type="primary" @click="followStore">
              {{ isFollowed ? '已关注' : '+ 关注店铺' }}
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 店铺内容区域 -->
    <div class="store-content">
      <!-- 左侧分类导航 -->
      <div class="store-nav">
        <div class="category-section">
          <div class="section-title">分类：</div>
          <div class="category-list">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-item"
              :class="{ active: currentCategory === category.id }"
              @click="selectCategory(category)"
              @mouseenter="handleMouseEnter(category)"
              @mouseleave="handleMouseLeave"
            >
              <div class="category-name">
                {{ category.name }}
                <el-icon v-if="category.children?.length"><ArrowRight /></el-icon>
              </div>
              <!-- 子分类弹出框 -->
              <div 
                v-if="category.children?.length && hoveredCategory === category.id" 
                class="subcategories-popup"
              >
                <div class="subcategories-content">
                  <div 
                    v-for="subCategory in category.children" 
                    :key="subCategory.id"
                    class="subcategory-group"
                  >
                    <div class="subcategory-title">{{ subCategory.name }}</div>
                    <div class="subcategory-items">
                      <div 
                        v-for="item in subCategory.children" 
                        :key="item.id"
                        class="subcategory-item"
                        @click.stop="selectSubCategory(item)"
                      >
                        {{ item.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 品牌部分 -->
        <div class="brand-section">
          <div class="section-title">品牌：</div>
          <div class="brand-list">
            <div
              v-for="brand in brands"
              :key="brand.id"
              class="brand-item"
              :class="{ active: currentBrand === brand.id }"
              @click="selectBrand(brand)"
            >
              <el-icon><Shop /></el-icon>
              {{ brand.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧商品展示 -->
      <div class="store-main">
        <!-- 搜索和筛选 -->
        <el-card class="filter-card">
          <div class="filter-section">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索店内商品"
              class="search-input"
              @keyup.enter="searchProducts"
            >
              <template #append>
                <el-button @click="searchProducts">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
            <div class="sort-options">
              <el-radio-group v-model="sortBy" @change="handleSortChange">
                <el-radio-button label="default">默认</el-radio-button>
                <el-radio-button label="sales">销量</el-radio-button>
                <el-radio-button label="price">价格</el-radio-button>
                <el-radio-button label="new">新品</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </el-card>

        <!-- 商品列表 -->
        <div class="product-list">
          <el-card v-for="product in products" :key="product.id" class="product-item">
            <router-link :to="`/products/${product.id}`">
              <img :src="product.image" :alt="product.name" class="product-image">
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
                <div class="product-sales">月销 {{ product.monthSales }}</div>
              </div>
            </router-link>
          </el-card>
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[20, 40, 60]"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search, ArrowRight, Shop } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const storeId = route.params.id

// 店铺基本信息
const store = ref({
  id: storeId,
  name: '华为官方旗舰店',
  logo: 'https://via.placeholder.com/80',
  description: '华为官方授权店铺，提供华为全系列产品',
  productCount: 386,
  salesCount: 15863,
  rating: 99
})

// 店铺分类
const categories = ref([
  {
    id: 1,
    name: '数码产品',
    children: [
      {
        id: 11,
        name: '电脑',
        children: [
          { id: 111, name: '台式' },
          { id: 112, name: '笔记本' }
        ]
      },
      {
        id: 12,
        name: '手机',
        children: [
          { id: 121, name: '旗舰机' },
          { id: 122, name: '性能机' }
        ]
      }
    ]
  }
  // ... 可以添加其他顶级分类
])

// 商品列表
const products = ref([
  {
    id: 1,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999.00,
    image: 'https://via.placeholder.com/200',
    monthSales: 1234
  }
  // ... 更多商品
])

const isFollowed = ref(false)
const currentCategory = ref(0)
const searchKeyword = ref('')
const sortBy = ref('default')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(386)
const hoveredCategory = ref(null)

// 品牌列表
const brands = ref([
  { id: 1, name: 'BT-SHOP' },
  { id: 2, name: '马蜂窝' },
  { id: 3, name: 'HUAWEI' },
  { id: 4, name: 'Apple' }
])

const currentBrand = ref(null)

// 关注店铺
const followStore = () => {
  isFollowed.value = !isFollowed.value
  ElMessage.success(isFollowed.value ? '已关注店铺' : '已取消关注')
}

// 选择分类
const selectCategory = (category) => {
  currentCategory.value = category.id
  fetchProducts()
}

// 搜索商品
const searchProducts = () => {
  currentPage.value = 1
  fetchProducts()
}

// 排序变化
const handleSortChange = () => {
  currentPage.value = 1
  fetchProducts()
}

// 获取商品列表
const fetchProducts = async () => {
  console.log('获取商品列表', {
    storeId,
    categoryId: currentCategory.value,
    brandId: currentBrand.value,
    keyword: searchKeyword.value,
    sortBy: sortBy.value,
    page: currentPage.value,
    pageSize: pageSize.value
  })
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchProducts()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchProducts()
}

const handleMouseEnter = (category) => {
  hoveredCategory.value = category.id
}

const handleMouseLeave = () => {
  hoveredCategory.value = null
}

const selectSubCategory = (subCategory) => {
  currentCategory.value = subCategory.id
  fetchProducts()
}

// 选择品牌
const selectBrand = (brand) => {
  currentBrand.value = brand.id
  fetchProducts()
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.store-detail {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.store-header {
  margin-bottom: 20px;
}

.store-info {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.store-main-info {
  flex: 1;
}

.store-name {
  font-size: 24px;
  margin-bottom: 8px;
}

.store-desc {
  color: #666;
  margin-bottom: 16px;
}

.store-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-item .value {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.stat-item .label {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.store-content {
  display: flex;
  gap: 20px;
}

.store-nav {
  width: 240px;
  flex-shrink: 0;
}

.category-section {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.section-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 16px;
}

.category-list {
  display: flex;
  flex-direction: column;
}

.category-item {
  position: relative;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #606266;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.category-item:last-child {
  border-bottom: none;
}

.category-name {
  display: flex;
  align-items: center;
  gap: 4px;
}

.category-item:hover {
  color: var(--el-color-primary);
  background-color: #f5f7fa;
}

.subcategories-popup {
  position: absolute;
  left: 100%;
  top: 0;
  min-width: 300px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  border-radius: 4px;
  z-index: 100;
  padding: 16px;
}

.subcategories-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.subcategory-group {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.subcategory-group:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.subcategory-title {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  margin-bottom: 12px;
}

.subcategory-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
}

.subcategory-item {
  padding: 6px 12px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
}

.subcategory-item:hover {
  color: var(--el-color-primary);
  background-color: #f5f7fa;
}

.store-main {
  flex: 1;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.search-input {
  width: 300px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.product-item {
  transition: all 0.3s;
}

.product-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 12px;
}

.product-name {
  font-size: 14px;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.product-sales {
  color: #999;
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.brand-section {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  margin-top: 20px;
}

.brand-list {
  display: flex;
  flex-direction: column;
}

.brand-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.brand-item:last-child {
  border-bottom: none;
}

.brand-item:hover {
  color: var(--el-color-primary);
  background-color: #f5f7fa;
}

.brand-item.active {
  color: var(--el-color-primary);
  background-color: #f5f7fa;
  font-weight: 500;
}

.brand-item .el-icon {
  font-size: 16px;
}
</style> 