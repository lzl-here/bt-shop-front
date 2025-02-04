<template>
  <div v-if="product" class="product-detail">
    <!-- 商品分类导航 -->
    <div class="category-nav">
      商品分类层级
    </div>

    <!-- 商品主要信息区域 -->
    <el-card class="product-main">
      <div class="product-container">
        <!-- 左侧商品图片 -->
        <div class="product-gallery">
          <el-image 
            :src="product.image" 
            fit="contain"
            :preview-src-list="[product.image]"
          />
        </div>

        <!-- 右侧商品信息 -->
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <div class="product-desc">{{ product.description }}</div>
          
          <div class="info-item">
            <div class="label">价格</div>
            <div class="price">¥{{ product.price }}</div>
          </div>

          <div class="info-item">
            <div class="label">月销量</div>
            <div class="value">{{ product.sales }} 件</div>
          </div>

          <div class="info-item">
            <div class="label">品牌</div>
            <el-tag size="small" type="info">{{ product.brandName }}</el-tag>
          </div>

          <div class="info-item">
            <div class="label">店铺</div>
            <el-tag size="small" type="success">{{ product.storeName }}</el-tag>
          </div>

          <!-- 规格选择 -->
          <div class="specs-section">
            <div class="spec-item">
              <div class="label">颜色</div>
              <div class="spec-options">
                <el-radio-group v-model="selectedSpecs.color">
                  <el-radio-button v-for="color in specs.colors" 
                    :key="color.value" 
                    :label="color.value"
                  >
                    {{ color.label }}
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>

            <div class="spec-item">
              <div class="label">内存</div>
              <div class="spec-options">
                <el-radio-group v-model="selectedSpecs.memory">
                  <el-radio-button v-for="memory in specs.memory" 
                    :key="memory.value" 
                    :label="memory.value"
                  >
                    {{ memory.label }}
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>

            <div class="spec-item">
              <div class="label">存储容量</div>
              <div class="spec-options">
                <el-radio-group v-model="selectedSpecs.storage">
                  <el-radio-button v-for="storage in specs.storage" 
                    :key="storage.value" 
                    :label="storage.value"
                  >
                    {{ storage.label }}
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </div>

          <!-- 购买按钮 -->
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="addToCart">加入购物车</el-button>
            <el-button type="danger" size="large" @click="buyNow">立即购买</el-button>
          </div>
        </div>
      </div>
    </el-card>

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
  margin: 0 auto;
  padding: 20px;
}

.category-nav {
  margin-bottom: 20px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #606266;
}

.product-main {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.product-container {
  display: flex;
  gap: 40px;
}

.product-gallery {
  width: 400px;
  height: 400px;
}

.product-gallery :deep(.el-image) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 24px;
  font-weight: 500;
  margin: 0 0 12px;
  color: #303133;
}

.product-desc {
  color: #909399;
  font-size: 14px;
  margin-bottom: 24px;
  line-height: 1.6;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.label {
  width: 80px;
  color: #909399;
  font-size: 14px;
}

.price {
  font-size: 28px;
  color: #f56c6c;
  font-weight: 500;
}

.value {
  color: #606266;
}

.specs-section {
  margin: 24px 0;
  padding: 24px 0;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

.spec-item {
  margin-bottom: 20px;
}

.spec-item:last-child {
  margin-bottom: 0;
}

.spec-options {
  margin-top: 8px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.action-buttons .el-button {
  flex: 1;
  height: 48px;
  font-size: 16px;
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

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
</style> 