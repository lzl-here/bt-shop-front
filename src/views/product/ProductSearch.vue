<template>
  <div class="product-search">
    <div class="search-container">
      <!-- 左侧筛选区域 -->
      <div class="filter-section">
        <!-- 分类筛选 -->
        <div class="category-nav">
          <div class="category-title">分类：</div>
          <div class="category-list">
            <!-- 一级分类 -->
            <div 
              v-for="category in categories" 
              :key="category.category_id"
              class="category-item"
              @mouseenter="handleCategoryHover(category)"
              @mouseleave="handleCategoryLeave"
            >
              <div class="category-item-content">
                <el-icon><Folder /></el-icon>
                {{ category.category_name }}
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </div>

              <!-- 子分类弹出层 -->
              <div 
                v-if="hoveredCategory === category.category_id" 
                class="subcategory-panel"
              >
                <div 
                  v-for="subCategory in category.children" 
                  :key="subCategory.category_id"
                  class="subcategory-group"
                >
                  <div class="subcategory-title">{{ subCategory.category_name }}</div>
                  <div class="subcategory-list">
                    <div 
                      v-for="item in subCategory.children" 
                      :key="item.category_id"
                      class="subcategory-item"
                      :class="{ active: selectedCategory === item.category_id }"
                      @click="selectCategory(item.category_id)"
                    >
                      {{ item.category_name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 品牌筛选 -->
        <div class="filter-group">
          <div class="filter-title">品牌：</div>
          <div class="brand-list">
            <div 
              v-for="brand in brands" 
              :key="brand.brand_id"
              class="brand-item"
              :class="{ active: selectedBrand === brand.brand_id }"
              @click="selectBrand(brand.brand_id)"
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
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧商品列表区域 -->
      <div class="product-section">
        <!-- 搜索框 -->
        <div class="search-box">
          <el-autocomplete
            v-model="searchQuery"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="true"
            placeholder="搜索商品"
            clearable
            @select="handleSelect"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #default="{ item }">
              <div class="suggestion-item">
                {{ item.value }}
              </div>
            </template>
            <template #append>
              <el-button @click="handleSearch">
                搜索
              </el-button>
            </template>
          </el-autocomplete>
        </div>

        <!-- 排序工具栏 -->
        <div class="sort-toolbar">
          <el-radio-group v-model="sortBy" @change="handleSort">
            <el-radio-button label="new">新品</el-radio-button>
            <el-radio-button label="sales">销量</el-radio-button>
            <el-radio-button label="comments">评论数</el-radio-button>
            <el-radio-button label="price">价格</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 商品列表 -->
        <div class="product-list">
          <!-- 商品列表内容 -->
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[12, 24, 36, 48]"
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
import { ref, onMounted } from 'vue'
import { getCategoryList, getBrandList, getKeywordDownList } from '../../api/goodsApi'
import { Search, Folder, Picture, ArrowRight } from '@element-plus/icons-vue'

// 数据
const categories = ref([])
const brands = ref([])
const selectedCategory = ref(null)
const selectedBrand = ref(null)
const searchQuery = ref('')
const sortBy = ref('new')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const hoveredCategory = ref(null)

// 获取分类和品牌数据
const fetchData = async () => {
  try {
    // 获取分类列表
    const categoryResponse = await getCategoryList()
    if (categoryResponse.code === 1) {
      categories.value = categoryResponse.data.category_list || []
    }

    // 获取品牌列表
    const brandResponse = await getBrandList()
    if (brandResponse.code === 1) {
      brands.value = brandResponse.data.brand_list || []
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

// 选择分类
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  handleSearch()
}

// 选择品牌
const selectBrand = (brandId) => {
  selectedBrand.value = brandId
  handleSearch()
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchProducts()
}

// 排序处理
const handleSort = () => {
  fetchProducts()
}

// 页码改变
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchProducts()
}

// 每页数量改变
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchProducts()
}

// 获取商品列表
const fetchProducts = async () => {
  // TODO: 实现商品搜索逻辑
}

const handleCategoryHover = (category) => {
  hoveredCategory.value = category.category_id
}

const handleCategoryLeave = () => {
  hoveredCategory.value = null
}

// 搜索建议
const querySearch = async (queryString, cb) => {
  if (!queryString) {
    cb([])
    return
  }
  
  try {
    const response = await getKeywordDownList(queryString)
    if (response.code === 1) {
      const suggestions = response.data.keyword_list.map(item => ({
        value: item.value,
        id: item.id
      }))
      cb(suggestions)
    } else {
      cb([])
    }
  } catch (error) {
    console.error('Failed to fetch suggestions:', error)
    cb([])
  }
}

// 选择搜索建议
const handleSelect = (item) => {
  searchQuery.value = item.value
  handleSearch()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.product-search {
  padding: 20px;
}

.search-container {
  display: flex;
  gap: 20px;
}

.filter-section {
  width: 240px;
  flex-shrink: 0;
}

.filter-group {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.filter-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.filter-item:hover {
  background-color: #f5f7fa;
}

.filter-item.active {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.brand-icon {
  width: 20px;
  height: 20px;
}

.image-slot {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.product-section {
  flex: 1;
}

.search-box {
  margin-bottom: 16px;
}

.search-box :deep(.el-input-group__prepend) {
  background-color: #fff;
}

.search-box :deep(.el-input__wrapper) {
  padding-left: 8px;
}

.suggestion-item {
  padding: 4px 8px;
  font-size: 14px;
  color: #606266;
}

.sort-toolbar {
  margin-bottom: 16px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.category-nav {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.category-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
}

.category-list {
  position: relative;
}

.category-item {
  position: relative;
}

.category-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item-content:hover {
  background-color: #f5f7fa;
  color: var(--el-color-primary);
}

.arrow-icon {
  margin-left: auto;
  font-size: 12px;
}

.subcategory-panel {
  position: absolute;
  left: 100%;
  top: 0;
  min-width: 400px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  border-radius: 4px;
  padding: 16px;
  z-index: 10;
}

.subcategory-group {
  margin-bottom: 16px;
}

.subcategory-group:last-child {
  margin-bottom: 0;
}

.subcategory-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.subcategory-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.subcategory-item {
  padding: 4px 12px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s;
}

.subcategory-item:hover {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.subcategory-item.active {
  color: #fff;
  background-color: var(--el-color-primary);
}

/* 品牌列表样式调整 */
.brand-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.brand-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.brand-item:hover {
  background-color: #f5f7fa;
}

.brand-item.active {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.brand-name {
  font-size: 13px;
  color: #606266;
}
</style> 