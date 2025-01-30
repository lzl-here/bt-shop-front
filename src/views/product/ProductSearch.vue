<template>
  <div class="product-search">
    <!-- 左侧筛选区域 -->
    <div class="filter-sidebar">
      <div class="filter-group">
        <div class="filter-title">品牌：</div>
        <div class="filter-content">
          <div 
            v-for="brand in brands" 
            :key="brand.id"
            :class="['filter-item', searchForm.brandId === brand.id ? 'active' : '']"
            @click="searchForm.brandId = brand.id"
          >
            <img v-if="brand.logo" :src="brand.logo" class="brand-logo" />
            <span>{{ brand.name }}</span>
          </div>
          <div class="filter-more">
            <span>更多</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <div class="filter-group">
        <div class="filter-title">参数：</div>
        <div class="filter-content">
          <div class="filter-item">
            <span>分辨率：</span>
            <el-tag size="small">FHD+2772</el-tag>
          </div>
          <div class="filter-item">
            <span>刷新率：</span>
            <el-tag size="small">90HZ</el-tag>
          </div>
          <div class="filter-item">
            <span>屏幕尺寸：</span>
            <el-tag size="small">6.76英寸</el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 添加搜索框 -->
      <div class="search-container">
        <div class="search-box">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索商品"
            class="search-input"
            clearable
            @input="handleSearchInput"
            @focus="handleFocus"
            @blur="hideSuggestions"
          >
            <template #prefix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>

          <!-- 搜索建议下拉框 -->
          <div v-show="showSuggestions" class="search-suggestions">
            <!-- 热门搜索 -->
            <div v-if="!searchForm.keyword" class="suggestion-section">
              <div class="section-title">热门搜索</div>
              <div class="hot-searches">
                <span 
                  v-for="(item, index) in hotSearches" 
                  :key="index"
                  class="hot-search-item"
                  @mousedown="selectSuggestion(item)"
                >
                  {{ item.text }}
                </span>
              </div>
            </div>

            <!-- 搜索建议 -->
            <div v-else-if="searchSuggestions.length" class="suggestion-section">
              <div 
                v-for="(item, index) in searchSuggestions"
                :key="index"
                class="suggestion-item"
                @mousedown="selectSuggestion(item)"
              >
                <div class="suggestion-content">
                  <span class="suggestion-text">{{ item.text }}</span>
                  <span v-if="item.category" class="suggestion-category">{{ item.category }}</span>
                </div>
                <span class="suggestion-count">约{{ item.count }}个商品</span>
              </div>
            </div>

            <!-- 无搜索结果 -->
            <div v-else-if="searchForm.keyword" class="no-result">
              没有找到相关商品
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索结果提示 -->
      <div class="search-result-info">
        全部结果 > "{{ searchForm.keyword }}"
      </div>

      <!-- 排序工具栏 -->
      <div class="sort-toolbar">
        <div class="sort-items">
          <div 
            v-for="(item, index) in sortOptions" 
            :key="index"
            :class="['sort-item', currentSort === item.value ? 'active' : '']"
            @click="handleSort(item.value)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="product-grid">
        <el-card 
          v-for="product in currentPageProducts" 
          :key="product.id" 
          class="product-card"
          @click="viewDetail(product.id)"
        >
          <img :src="product.image" class="product-image">
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-price">¥{{ product.price }}</div>
            <div class="product-store">{{ product.storeName }}</div>
          </div>
        </el-card>

        <!-- 分页组件 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 36, 48]"
            :total="mockProducts.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, ArrowRight } from '@element-plus/icons-vue'
import { debounce } from 'lodash'

const route = useRoute()
const router = useRouter()

// 初始化数据
const currentPage = ref(1)
const pageSize = ref(12)
const currentSort = ref('comprehensive')
const searchForm = ref({
  keyword: '',
  brandId: '',
  storeId: ''
})

// 排序选项
const sortOptions = [
  { label: '综合', value: 'comprehensive' },
  { label: '销量', value: 'sales' },
  { label: '评论数', value: 'comments' },
  { label: '新品', value: 'new' },
  { label: '价格', value: 'price' }
]

// 品牌数据
const brands = ref([
  { id: 1, name: 'BT-SHOP', logo: 'https://via.placeholder.com/24x24' },
  { id: 2, name: '马蜂窝', logo: 'https://via.placeholder.com/24x24' },
  { id: 3, name: 'HUAWEI', logo: 'https://via.placeholder.com/24x24' },
  { id: 4, name: 'Apple', logo: 'https://via.placeholder.com/24x24' }
])

// 商品数据
const mockProducts = ref([
  {
    id: 1,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 2,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 3,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 4,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 5,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 6,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '苹果官方旗舰店'
  },
  {
    id: 7,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 8,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 9,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 10,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 11,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 12,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 13,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 14,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 15,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 16,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 17,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  {
    id: 18,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    image: 'https://via.placeholder.com/200x200',
    brandId: 3,
    brandName: 'HUAWEI',
    storeId: 1,
    storeName: '华为官方旗舰店'
  },
  // ... 其他商品数据保持不变
])

// 添加计算属性来获取当前页的商品
const currentPageProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return mockProducts.value.slice(startIndex, endIndex)
})

// 处理排序
const handleSort = (sortType) => {
  currentSort.value = sortType
}

// 处理分页
const handleCurrentChange = (val) => {
  currentPage.value = val
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

// 处理搜索
const handleSearch = () => {
  if (searchForm.value.keyword.trim()) {
    router.push({
      path: '/products',
      query: { 
        keyword: searchForm.value.keyword,
        brandId: searchForm.value.brandId,
        storeId: searchForm.value.storeId
      }
    })
  }
}

// 添加跳转方法
const viewDetail = (productId) => {
  router.push(`/products/${productId}`)
}

// 监听路由参数变化
onMounted(() => {
  if (route.query.keyword) {
    searchForm.value.keyword = route.query.keyword
  }
  if (route.query.brandId) {
    searchForm.value.brandId = Number(route.query.brandId)
  }
  if (route.query.storeId) {
    searchForm.value.storeId = Number(route.query.storeId)
  }
})

const showSuggestions = ref(false)
const searchSuggestions = ref([])

// 热门搜索数据
const hotSearches = [
  { text: '华为手机', category: '手机数码', count: 128 },
  { text: 'iPhone 15', category: '手机数码', count: 156 },
  { text: '小米手环', category: '智能穿戴', count: 89 },
  { text: '机械键盘', category: '电脑配件', count: 76 },
  { text: '游戏本', category: '电脑办公', count: 92 },
  { text: '蓝牙耳机', category: '耳机音响', count: 134 }
]

// 模拟搜索建议数据
const mockSuggestions = [
  { text: '华为手机', category: '手机数码', count: 128 },
  { text: '华为平板', category: '平板电脑', count: 56 },
  { text: '华为笔记本', category: '电脑办公', count: 42 },
  { text: '华为手表', category: '智能穿戴', count: 89 },
  { text: '华为耳机', category: '耳机音响', count: 67 },
  { text: '华为充电器', category: '手机配件', count: 95 },
  { text: '华为nova', category: '手机数码', count: 45 },
  { text: '华为mate', category: '手机数码', count: 78 },
  { text: '华为畅享', category: '手机数码', count: 34 },
  { text: '华为智选', category: '智能家居', count: 112 },
  { text: '华为路由器', category: '网络设备', count: 23 },
  { text: '华为电视', category: '大家电', count: 15 }
]

// 处理搜索输入
const handleSearchInput = debounce((val) => {
  if (!val.trim()) {
    searchSuggestions.value = []
    return
  }
  
  // 模拟搜索匹配
  searchSuggestions.value = mockSuggestions.filter(item => 
    item.text.toLowerCase().includes(val.toLowerCase())
  )
}, 300)

// 选择搜索建议
const selectSuggestion = (item) => {
  searchForm.value.keyword = item.text
  showSuggestions.value = false
  handleSearch()
}

// 隐藏搜索建议
const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// 处理搜索框获得焦点
const handleFocus = () => {
  showSuggestions.value = true
}
</script>

<style scoped>
.product-search {
  padding: 20px;
  display: flex;
  gap: 20px;
}

.main-content {
  flex: 1;
}

.filter-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-group {
  border-bottom: 1px solid #eee;
}

.filter-group:last-child {
  border-bottom: none;
}

.filter-title {
  padding: 15px;
  font-weight: bold;
  color: #333;
  background: #fff;
}

.filter-content {
  padding: 0 15px 15px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-item:hover {
  background: #f5f7fa;
}

.filter-item.active {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.brand-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.filter-more {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  color: #666;
  cursor: pointer;
}

.filter-more:hover {
  color: var(--el-color-primary);
}

.filter-item .el-tag {
  margin-left: auto;
}

.sort-toolbar {
  background: #f8f8f8;
  padding: 10px;
  margin-bottom: 20px;
}

.sort-items {
  display: flex;
  gap: 20px;
}

.sort-item {
  cursor: pointer;
}

.sort-item.active {
  color: #409EFF;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.product-card {
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.product-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.product-info {
  padding: 10px;
}

.product-name {
  font-size: 14px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.product-store {
  color: #999;
  font-size: 12px;
}

.pagination-container {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.search-container {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 800px;
  position: relative;  /* 添加相对定位 */
}

.search-input {
  flex: 1;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 40px;
  padding-left: 20px;
  background-color: #f5f7fa;
  box-shadow: none;
  border: 1px solid #e4e7ed;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
  border-color: var(--el-color-primary);
}

.search-input :deep(.el-input__inner) {
  height: 40px;
  font-size: 14px;
}

.search-input :deep(.el-input__prefix) {
  margin-right: 10px;
}

.search-icon {
  font-size: 18px;
  color: #909399;
}

.search-btn {
  height: 40px;
  border-radius: 40px;
  padding: 0 30px;
  font-size: 14px;
  background-color: #409EFF;
  border: none;
}

.search-btn:hover {
  background-color: #66b1ff;
}

/* 清除按钮样式优化 */
.search-input :deep(.el-input__suffix) {
  right: 10px;
}

.search-input :deep(.el-input__clear) {
  color: #909399;
  font-size: 14px;
}

/* 响应式调整 */
@media screen and (max-width: 992px) {
  .product-search {
    flex-direction: column;
  }

  .filter-sidebar {
    width: 100%;
    margin-bottom: 20px;
  }

  .filter-content {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .filter-item {
    flex: 0 0 auto;
  }
}

.search-result-info {
  margin: 15px 0;
  color: #666;
  font-size: 14px;
}

@media screen and (max-width: 1400px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .search-input {
    max-width: 100%;
  }
}

@media screen and (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.suggestion-item:hover {
  background-color: #f5f7fa;
}

.suggestion-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.suggestion-text {
  font-size: 14px;
}

.suggestion-category {
  font-size: 12px;
  color: #909399;
  background: #f0f2f5;
  padding: 2px 6px;
  border-radius: 2px;
}

.suggestion-count {
  font-size: 12px;
  color: #909399;
}

.suggestion-section {
  padding: 10px 0;
}

.section-title {
  padding: 0 15px;
  font-size: 12px;
  color: #909399;
  margin-bottom: 10px;
}

.hot-searches {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 15px;
}

.hot-search-item {
  padding: 4px 12px;
  background: #f5f7fa;
  border-radius: 20px;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
}

.hot-search-item:hover {
  background: #ecf5ff;
  color: var(--el-color-primary);
}

.no-result {
  padding: 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style> 