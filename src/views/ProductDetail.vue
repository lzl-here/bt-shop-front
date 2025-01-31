<template>
  <div v-if="product" class="product-detail">
    <div class="product-container">
      <!-- 左侧商品图片 -->
      <div class="product-gallery">
        <el-image
          :src="product.image"
          fit="contain"
          class="main-image"
        />
        <div class="image-list">
          <el-image
            v-for="(img, index) in product.images"
            :key="index"
            :src="img"
            fit="cover"
            class="thumb-image"
            @click="selectImage(img)"
          />
        </div>
      </div>

      <!-- 右侧商品信息 -->
      <div class="product-info">
        <h1 class="product-name">{{ product.name }}</h1>
        <div class="product-desc">{{ product.description }}</div>
        
        <div class="product-meta">
          <div class="price-section">
            <span class="label">价格</span>
            <span class="price">¥{{ product.price }}</span>
          </div>
          <div class="sales-section">
            <span class="label">月销量</span>
            <span class="sales">{{ product.sales }}件</span>
          </div>
        </div>

        <div class="product-attrs">
          <div class="attr-item">
            <span class="label">品牌</span>
            <el-tag size="small">{{ product.brandName }}</el-tag>
          </div>
          <div class="attr-item">
            <span class="label">店铺</span>
            <el-tag size="small" type="success">{{ product.storeName }}</el-tag>
          </div>
        </div>

        <!-- 规格选择 -->
        <div class="specs-section">
          <!-- 颜色规格 -->
          <div class="spec-group">
            <div class="spec-title">颜色</div>
            <div class="spec-options">
              <div
                v-for="color in specs.colors"
                :key="color.value"
                :class="['spec-item', selectedSpecs.color === color.value ? 'active' : '']"
                @click="selectSpec('color', color.value)"
              >
                {{ color.label }}
              </div>
            </div>
          </div>

          <!-- 内存规格 -->
          <div class="spec-group">
            <div class="spec-title">内存</div>
            <div class="spec-options">
              <div
                v-for="memory in specs.memory"
                :key="memory.value"
                :class="['spec-item', selectedSpecs.memory === memory.value ? 'active' : '']"
                @click="selectSpec('memory', memory.value)"
              >
                {{ memory.label }}
              </div>
            </div>
          </div>

          <!-- 存储规格 -->
          <div class="spec-group">
            <div class="spec-title">存储容量</div>
            <div class="spec-options">
              <div
                v-for="storage in specs.storage"
                :key="storage.value"
                :class="['spec-item', selectedSpecs.storage === storage.value ? 'active' : '']"
                @click="selectSpec('storage', storage.value)"
              >
                {{ storage.label }}
              </div>
            </div>
          </div>
        </div>

        <div class="quantity-section">
          <span class="label">数量</span>
          <el-input-number
            v-model="quantity"
            :min="1"
            :max="99"
            size="large"
          />
        </div>

        <div class="action-buttons">
          <el-button 
            type="primary" 
            size="large"
            @click="addToCart"
          >
            加入购物车
          </el-button>
          <el-button 
            type="danger" 
            size="large"
            @click="buyNow"
          >
            立即购买
          </el-button>
        </div>
      </div>
    </div>

    <!-- 商品详情 -->
    <div class="detail-section">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="商品详情" name="detail">
          <div class="detail-content">
            <div v-for="(img, index) in product.detailImages" :key="index">
              <el-image :src="img" fit="contain" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="参数" name="specs">
          <el-descriptions :column="1" border>
            <el-descriptions-item 
              v-for="(spec, key) in product.specs" 
              :key="key" 
              :label="key"
            >
              {{ spec }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <div v-else class="loading-container">
    <el-empty description="商品信息加载中..." />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useProductStore } from '../stores/products'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const productStore = useProductStore()

// 商品信息
const product = ref(null)
const activeTab = ref('detail')

// 规格选项
const specs = {
  colors: [
    { label: '墨玉青', value: 'blue' },
    { label: '雅川青', value: 'green' },
    { label: '霜雪白', value: 'white' }
  ],
  memory: [
    { label: '8GB', value: '8' },
    { label: '12GB', value: '12' },
    { label: '16GB', value: '16' }
  ],
  storage: [
    { label: '256GB', value: '256' },
    { label: '512GB', value: '512' },
    { label: '1TB', value: '1024' }
  ]
}

// 选中的规格
const selectedSpecs = ref({
  color: '',
  memory: '',
  storage: ''
})

// 数量
const quantity = ref(1)

// 在组件挂载时获取商品详情
onMounted(async () => {
  try {
    const productId = route.params.id
    console.log('当前商品ID:', productId)
    
    // 重置规格选择状态
    selectedSpecs.value = {
      color: '',
      memory: '',
      storage: ''
    }
    // 重置数量
    quantity.value = 1
    
    // 从 store 获取商品详情
    product.value = productStore.getProductById(productId)
    console.log('获取到的商品信息:', product.value)
    
    if (!product.value) {
      throw new Error('商品不存在')
    }
  } catch (error) {
    ElMessage.error(error.message || '商品加载失败')
    router.push('/products')
  }
})

// 选择规格
const selectSpec = (type, value) => {
  selectedSpecs.value[type] = value
}

// 检查是否已选择所有规格
const checkSpecsSelected = () => {
  return selectedSpecs.value.color && 
         selectedSpecs.value.memory && 
         selectedSpecs.value.storage
}

// 添加到购物车
const addToCart = () => {
  if (!checkSpecsSelected()) {
    ElMessage.warning('请选择商品规格')
    return
  }

  const cartItem = {
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
    quantity: quantity.value,
    specs: {
      color: specs.colors.find(c => c.value === selectedSpecs.value.color)?.label,
      memory: specs.memory.find(m => m.value === selectedSpecs.value.memory)?.label,
      storage: specs.storage.find(s => s.value === selectedSpecs.value.storage)?.label
    },
    storeName: product.value.storeName
  }

  cartStore.addToCart(cartItem)
  ElMessage.success('已添加到购物车')
}

// 立即购买
const buyNow = () => {
  if (!checkSpecsSelected()) {
    ElMessage.warning('请选择商品规格')
    return
  }

  const orderItem = {
    ...product.value,
    quantity: quantity.value,
    specs: {
      color: specs.colors.find(c => c.value === selectedSpecs.value.color)?.label,
      memory: specs.memory.find(m => m.value === selectedSpecs.value.memory)?.label,
      storage: specs.storage.find(s => s.value === selectedSpecs.value.storage)?.label
    }
  }

  localStorage.setItem('tempOrder', JSON.stringify([orderItem]))
  router.push({
    path: '/checkout',
    query: { from: 'buyNow' }
  })
}
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.product-gallery {
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-image {
  width: 100%;
  max-width: 400px;
  height: 400px;
}

.image-list {
  display: flex;
  gap: 10px;
}

.thumb-image {
  width: 80px;
  height: 80px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
}

.thumb-image:hover {
  border-color: var(--el-color-primary);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-name {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.product-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.product-meta {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 4px;
}

.price-section,
.sales-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.price-section .price {
  color: #f56c6c;
  font-size: 28px;
  font-weight: bold;
}

.label {
  color: #666;
  width: 60px;
}

.product-attrs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attr-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-buttons {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.detail-section {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
}

.specs-section {
  margin-bottom: 30px;
}

.spec-group {
  margin-bottom: 20px;
}

.spec-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.spec-item {
  padding: 8px 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #606266;
}

.spec-item:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.spec-item.active {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

@media screen and (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
</style> 