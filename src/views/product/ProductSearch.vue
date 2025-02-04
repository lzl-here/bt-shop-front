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
        <!-- 搜索框和按钮 -->
        <div class="search-header">
          <div class="search-box">
            <el-autocomplete
              v-model="searchQuery"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="true"
              placeholder="搜索商品"
              clearable
              @select="handleSelect"
              @keyup.enter="handleSearch"
              class="search-input"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
              <template #default="{ item }">
                <div class="suggestion-item">
                  {{ item.value }}
                </div>
              </template>
            </el-autocomplete>
            <el-button type="primary" @click="handleSearch" class="search-button">
              搜索
            </el-button>
          </div>

          <!-- 已选择的筛选条件 -->
          <div v-if="selectedCategory || selectedBrand" class="selected-filters">
            <div class="filter-tags">
              <el-tag 
                v-if="selectedCategory" 
                closable
                @close="clearCategory"
                class="filter-tag"
              >
                分类：{{ getSelectedCategoryName() }}
              </el-tag>
              <el-tag 
                v-if="selectedBrand" 
                closable
                @close="clearBrand"
                class="filter-tag"
              >
                品牌：{{ getSelectedBrandName() }}
              </el-tag>
            </div>
            <el-button 
              type="text" 
              @click="clearAllFilters"
              class="clear-all"
            >
              清除全部
            </el-button>
          </div>
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
          <div v-if="products.length > 0" class="product-grid">
            <router-link 
              v-for="product in products" 
              :key="product.id" 
              :to="`/product/${product.id}`"
              class="product-card"
            >
              <div class="product-image">
                <el-image 
                  :src="product.spu_img_url" 
                  fit="cover"
                  class="product-image"
                >
                  <template #error>
                    <div class="image-error">
                      <el-icon><Picture /></el-icon>
                      <div class="text">图片加载失败</div>
                    </div>
                  </template>
                </el-image>
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.spu_name }}</h3>
                <p class="product-desc">{{ product.spu_desc }}</p>
                <div class="product-price">¥{{ product.spu_price }}</div>
              </div>
            </router-link>
          </div>
          <el-empty v-else description="暂无商品" />
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
import { getCategoryList, getBrandList, searchSpuList, getKeywordDownList } from '../../api/goodsApi'
import { Search, Folder, Picture, ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()

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
const products = ref([])

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

// 获取商品列表
const fetchProducts = async () => {
  try {
    const params = {
      pageSize: pageSize.value,
      pageNo: currentPage.value,
      keyword: searchQuery.value,
      categoryIds: selectedCategory.value ? [selectedCategory.value] : [],
      brandIds: selectedBrand.value ? [selectedBrand.value] : [],
      orderBy: sortBy.value
    }

    const response = await searchSpuList(params)
    if (response.code === 1) {
      products.value = response.data.spu_list || []
      total.value = response.data.count || 0
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchProducts()
}

// 处理排序
const handleSort = () => {
  currentPage.value = 1
  fetchProducts()
}

// 选择分类
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
  fetchProducts()
}

// 选择品牌
const selectBrand = (brandId) => {
  selectedBrand.value = brandId
  currentPage.value = 1
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

// 获取选中的分类名称
const getSelectedCategoryName = () => {
  if (!selectedCategory.value) return ''
  
  // 遍历所有分类查找匹配的名称
  for (const category of categories.value) {
    // 检查一级分类
    if (category.category_id === selectedCategory.value) {
      return category.category_name
    }
    // 检查二级分类
    if (category.children) {
      for (const subCategory of category.children) {
        if (subCategory.category_id === selectedCategory.value) {
          return subCategory.category_name
        }
        // 检查三级分类
        if (subCategory.children) {
          for (const thirdCategory of subCategory.children) {
            if (thirdCategory.category_id === selectedCategory.value) {
              return thirdCategory.category_name
            }
          }
        }
      }
    }
  }
  return ''
}

// 获取选中的品牌名称
const getSelectedBrandName = () => {
  if (!selectedBrand.value) return ''
  const brand = brands.value.find(b => b.brand_id === selectedBrand.value)
  return brand ? brand.brand_name : ''
}

// 清除分类筛选
const clearCategory = () => {
  selectedCategory.value = null
  fetchProducts()
}

// 清除品牌筛选
const clearBrand = () => {
  selectedBrand.value = null
  fetchProducts()
}

// 清除所有筛选
const clearAllFilters = () => {
  selectedCategory.value = null
  selectedBrand.value = null
  fetchProducts()
}

onMounted(() => {
  fetchData()
  fetchProducts()

  // 如果有搜索参数，执行搜索
  if (route.query.keyword) {
    handleSearch()
  }
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

.search-header {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
}

.search-box {
  display: flex;
  gap: 12px;
  max-width: 600px; /* 限制搜索框最大宽度 */
}

.search-input {
  width: 400px; /* 固定搜索框宽度 */
}

.search-box :deep(.el-input__wrapper) {
  border-radius: 20px; /* 圆角输入框 */
  padding-left: 16px;
}

.search-button {
  border-radius: 20px; /* 圆角按钮 */
  padding: 0 24px;
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

:deep(.el-autocomplete-suggestion__wrap) {
  padding: 4px 0;
}

:deep(.el-autocomplete-suggestion__list) {
  margin: 0;
  padding: 0;
}

:deep(.el-autocomplete-suggestion__list li) {
  padding: 0;
  line-height: 32px;
}

:deep(.el-autocomplete-suggestion__list li:hover) {
  background-color: #f5f7fa;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 20px;
  padding: 20px;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.image-error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #909399;
  background: #f8f9fa;
}

.image-error .el-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.image-error .text {
  font-size: 14px;
}

.product-info {
  padding: 0 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-desc {
  font-size: 12px;
  color: #999;
  margin: 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 500;
  margin-top: auto;
}

.selected-filters {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tag {
  font-size: 13px;
}

.filter-tag :deep(.el-tag__close) {
  color: #909399;
}

.clear-all {
  font-size: 13px;
  color: #909399;
}

.clear-all:hover {
  color: var(--el-color-primary);
}
</style> 