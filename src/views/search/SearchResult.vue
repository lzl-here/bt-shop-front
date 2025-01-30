<template>
  <div class="search-result">
    <!-- 搜索框 -->
    <div class="search-box">
      <el-input
        v-model="searchText"
        placeholder="搜索店铺"
        class="search-input"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <div class="search-prefix">店铺</div>
        </template>
        <template #append>
          <el-button @click="handleSearch">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>

    <!-- 搜索结果标题 -->
    <div class="result-header">
      <h2>店铺搜索结果</h2>
      <div class="search-info">
        关键词：<span class="keyword">{{ keyword }}</span>
        <span class="count">共找到 {{ total }} 个店铺</span>
      </div>
    </div>

    <!-- 店铺搜索结果 -->
    <div class="store-list" v-if="stores.length">
      <el-card 
        v-for="store in stores" 
        :key="store.id" 
        class="store-item"
        @click="viewStore(store)"
      >
        <div class="store-header">
          <el-avatar :size="60" :src="store.logo" />
          <div class="store-info">
            <div class="store-name">{{ store.name }}</div>
            <div class="store-desc">{{ store.description }}</div>
          </div>
        </div>
        <div class="store-stats">
          <div class="stat-item">
            <div class="label">商品数</div>
            <div class="value">{{ store.productCount }}</div>
          </div>
          <div class="stat-item">
            <div class="label">销量</div>
            <div class="value">{{ store.salesCount }}</div>
          </div>
          <div class="stat-item">
            <div class="label">好评率</div>
            <div class="value">{{ store.rating }}%</div>
          </div>
        </div>
      </el-card>
    </div>
    <el-empty v-else description="暂无相关店铺" />

    <!-- 分页 -->
    <div class="pagination" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[12, 24, 36]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const searchText = ref('')
const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

// 模拟店铺数据
const stores = ref([
  {
    id: 1,
    name: '华为官方旗舰店',
    logo: 'https://via.placeholder.com/60',
    description: '华为官方授权店铺，提供华为全系列产品',
    productCount: 386,
    salesCount: 15863,
    rating: 99
  }
])

// 获取搜索结果
const fetchSearchResult = async () => {
  // TODO: 实现搜索接口调用
  console.log('搜索店铺', {
    keyword: keyword.value,
    page: currentPage.value,
    pageSize: pageSize.value
  })
  
  total.value = stores.value.length
}

// 处理搜索
const handleSearch = () => {
  if (!searchText.value.trim()) return
  
  router.push({
    path: '/search',
    query: {
      keyword: searchText.value
    }
  })
}

// 监听路由参数变化
watch(
  () => route.query,
  (query) => {
    keyword.value = query.keyword || ''
    searchText.value = keyword.value
    fetchSearchResult()
  },
  { immediate: true }
)

// 查看店铺详情
const viewStore = (store) => {
  router.push(`/store/${store.id}`)
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchSearchResult()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchSearchResult()
}

onMounted(() => {
  fetchSearchResult()
})
</script>

<style scoped>
.search-result {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.result-header {
  margin-bottom: 20px;
}

.search-info {
  margin-top: 10px;
  color: #909399;
}

.keyword {
  color: var(--el-color-primary);
  margin-right: 20px;
}

.store-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.store-item {
  transition: all 0.3s;
  cursor: pointer;
}

.store-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.store-header {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.store-info {
  flex: 1;
}

.store-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.store-desc {
  color: #909399;
  font-size: 13px;
}

.store-stats {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  padding: 15px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-item .label {
  color: #909399;
  font-size: 13px;
  margin-bottom: 4px;
}

.stat-item .value {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.search-box {
  max-width: 800px;
  margin: 0 auto 30px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.search-input {
  width: 100%;
}

.search-prefix {
  padding: 0 16px;
  color: #606266;
  font-size: 14px;
  border-right: 1px solid #dcdfe6;
}

.search-input :deep(.el-input-group__prepend) {
  padding: 0;
  background-color: #fff;
}

.search-input :deep(.el-input__wrapper) {
  padding-left: 0;
}
</style> 