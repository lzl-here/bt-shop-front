<template>
  <div class="store-search">
    <div class="search-header">
      <h2>店铺搜索</h2>
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="请输入店铺名称"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <div class="store-list" v-if="stores.length">
      <el-card v-for="store in stores" :key="store.id" class="store-item">
        <div class="store-info">
          <el-avatar :size="60" :src="store.avatar" />
          <div class="store-detail">
            <h3 class="store-name">{{ store.name }}</h3>
            <div class="store-meta">
              <span>商品数: {{ store.productCount }}</span>
              <span>关注数: {{ store.followCount }}</span>
            </div>
          </div>
          <el-button type="primary" @click="visitStore(store.id)">
            进入店铺
          </el-button>
        </div>
      </el-card>
    </div>

    <el-empty v-else description="暂无店铺" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')
const stores = ref([])

const handleSearch = () => {
  // TODO: 调用搜索API
  stores.value = [
    {
      id: 1,
      name: '华为官方旗舰店',
      avatar: 'https://via.placeholder.com/60',
      productCount: 100,
      followCount: 1000
    },
    // ... 更多店铺数据
  ]
}

const visitStore = (storeId) => {
  router.push(`/store/${storeId}`)
}
</script>

<style scoped>
.store-search {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.search-header {
  margin-bottom: 30px;
}

.search-header h2 {
  margin-bottom: 20px;
}

.search-bar {
  max-width: 600px;
}

.store-list {
  display: grid;
  gap: 20px;
}

.store-item {
  cursor: pointer;
  transition: all 0.3s;
}

.store-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.store-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.store-detail {
  flex: 1;
}

.store-name {
  margin: 0 0 8px;
  font-size: 16px;
}

.store-meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}
</style> 