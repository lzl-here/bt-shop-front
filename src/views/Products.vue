<template>
  <div class="products-page">
    <div class="filter-section">
      <el-card>
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索商品"
            prefix-icon="Search"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
        
        <div class="filter-options">
          <el-select v-model="filters.category" placeholder="商品分类" clearable>
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            ></el-option>
          </el-select>
          
          <el-select v-model="filters.sort" placeholder="排序方式">
            <el-option label="默认排序" value=""></el-option>
            <el-option label="价格从低到高" value="price-asc"></el-option>
            <el-option label="价格从高到低" value="price-desc"></el-option>
            <el-option label="销量优先" value="sales-desc"></el-option>
          </el-select>
          
          <div class="price-range">
            <el-input-number 
              v-model="filters.minPrice" 
              :min="0" 
              placeholder="最低价"
            ></el-input-number>
            <span class="separator">-</span>
            <el-input-number 
              v-model="filters.maxPrice" 
              :min="0" 
              placeholder="最高价"
            ></el-input-number>
          </div>
        </div>
      </el-card>
    </div>

    <div class="products-grid">
      <el-card 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="product-card"
        @click="viewDetail(product.id)"
      >
        <el-image :src="product.image" fit="cover"></el-image>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="description">{{ product.description }}</p>
          <div class="price-row">
            <span class="price">¥{{ product.price }}</span>
            <span class="sales">月销 {{ product.sales }}</span>
          </div>
          <div class="actions">
            <el-button 
              type="primary" 
              size="small"
              @click.stop="addToCart(product)"
            >
              加入购物车
            </el-button>
            <el-button 
              type="danger" 
              size="small"
              plain
              @click.stop="toggleFavorite(product)"
            >
              <el-icon>
                <Star :filled="product.isFavorite" />
              </el-icon>
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

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
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { ElMessage } from 'element-plus'
import { Star } from '@element-plus/icons-vue'

const router = useRouter()
const cartStore = useCartStore()

// 搜索和筛选
const searchQuery = ref('')
const filters = reactive({
  category: '',
  sort: '',
  minPrice: null,
  maxPrice: null
})

// 分页
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(100)

// 模拟数据
const categories = ref([
  { id: 1, name: '手机数码' },
  { id: 2, name: '电脑办公' },
  { id: 3, name: '家用电器' }
])

const products = ref([
  {
    id: 1,
    name: '商品1',
    price: 1999,
    image: '/images/product1.jpg',
    description: '商品描述...',
    sales: 100,
    isFavorite: false
  },
  // ... 更多商品
])

// 计算属性和方法
const filteredProducts = computed(() => {
  let result = [...products.value]
  
  // 实现筛选逻辑
  if (searchQuery.value) {
    result = result.filter(p => 
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (filters.category) {
    result = result.filter(p => p.categoryId === filters.category)
  }
  
  if (filters.minPrice !== null) {
    result = result.filter(p => p.price >= filters.minPrice)
  }
  
  if (filters.maxPrice !== null) {
    result = result.filter(p => p.price <= filters.maxPrice)
  }
  
  // 排序
  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'sales-desc':
      result.sort((a, b) => b.sales - a.sales)
      break
  }
  
  return result
})

const handleSearch = () => {
  currentPage.value = 1
  // 实现搜索逻辑
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  // 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // 重新加载数据
}

const viewDetail = (productId) => {
  router.push(`/products/${productId}`)
}

const addToCart = (product) => {
  cartStore.addItem(product)
  ElMessage.success('已添加到购物车')
}

const toggleFavorite = (product) => {
  product.isFavorite = !product.isFavorite
  ElMessage.success(product.isFavorite ? '已收藏' : '已取消收藏')
}
</script>

<style scoped>
.products-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.filter-options {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.separator {
  color: #999;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-card .el-image {
  width: 100%;
  height: 200px;
}

.product-info {
  padding: 15px;
}

.description {
  color: #666;
  margin: 10px 0;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.price {
  color: var(--el-color-danger);
  font-size: 1.2rem;
  font-weight: bold;
}

.sales {
  color: #999;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style> 