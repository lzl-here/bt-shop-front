<template>
  <div class="product-detail">
    <div class="product-container">
      <!-- 商品图片和基本信息 -->
      <div class="product-main">
        <div class="product-gallery">
          <el-carousel trigger="click" height="400px" :autoplay="false">
            <el-carousel-item v-for="image in product.images" :key="image">
              <el-image :src="image" fit="contain"></el-image>
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <div class="price-section">
            <span class="price">¥{{ product.price }}</span>
            <span class="original-price">¥{{ product.originalPrice }}</span>
          </div>
          
          <div class="sales-info">
            <span>月销 {{ product.sales }}+</span>
            <span>累计评价 {{ product.reviews }}+</span>
          </div>

          <!-- 规格选择 -->
          <div class="specs-section">
            <div v-for="spec in product.specs" 
                 :key="spec.name" 
                 class="spec-group">
              <div class="spec-title">{{ spec.name }}</div>
              <div class="spec-options">
                <el-radio-group v-model="selectedSpecs[spec.name]">
                  <el-radio-button 
                    v-for="option in spec.options" 
                    :key="option.value"
                    :label="option.value"
                  >
                    {{ option.label }}
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </div>

          <!-- 数量选择 -->
          <div class="quantity-section">
            <span class="label">数量</span>
            <el-input-number 
              v-model="quantity" 
              :min="1" 
              :max="product.stock"
              size="large"
            ></el-input-number>
            <span class="stock">库存 {{ product.stock }} 件</span>
          </div>

          <!-- 按钮组 -->
          <div class="action-buttons">
            <el-button 
              type="primary" 
              size="large" 
              @click="addToCart"
              :loading="loading"
            >
              加入购物车
            </el-button>
            <el-button 
              type="danger" 
              size="large" 
              @click="buyNow"
              :loading="loading"
            >
              立即购买
            </el-button>
          </div>
        </div>
      </div>

      <!-- 商品详情和评价 -->
      <div class="product-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="商品详情" name="detail">
            <div class="detail-content" v-html="product.detail"></div>
          </el-tab-pane>
          
          <el-tab-pane label="商品评价" name="reviews">
            <div class="reviews-section">
              <div v-for="review in reviews" 
                   :key="review.id" 
                   class="review-item">
                <div class="review-header">
                  <el-avatar :src="review.userAvatar" size="small"></el-avatar>
                  <span class="username">{{ review.username }}</span>
                  <el-rate 
                    v-model="review.rating" 
                    disabled 
                    show-score
                  ></el-rate>
                </div>
                <div class="review-content">{{ review.content }}</div>
                <div class="review-images" v-if="review.images?.length">
                  <el-image 
                    v-for="image in review.images"
                    :key="image"
                    :src="image"
                    :preview-src-list="review.images"
                  ></el-image>
                </div>
                <div class="review-time">{{ review.createTime }}</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const loading = ref(false)
const activeTab = ref('detail')
const quantity = ref(1)
const selectedSpecs = reactive({})

// 模拟商品数据
const product = ref({
  id: 1,
  name: '示例商品',
  price: 1999,
  originalPrice: 2999,
  sales: 1000,
  reviews: 500,
  stock: 999,
  images: [
    '/images/product1.jpg',
    '/images/product2.jpg'
  ],
  specs: [
    {
      name: '颜色',
      options: [
        { label: '黑色', value: 'black' },
        { label: '白色', value: 'white' }
      ]
    },
    {
      name: '容量',
      options: [
        { label: '128GB', value: '128' },
        { label: '256GB', value: '256' }
      ]
    }
  ],
  detail: '<div>商品详细介绍...</div>'
})

// 模拟评价数据
const reviews = ref([
  {
    id: 1,
    username: '用户1',
    userAvatar: '/images/avatar1.jpg',
    rating: 5,
    content: '商品很好，很满意',
    images: ['/images/review1.jpg'],
    createTime: '2024-01-20 14:30:00'
  }
])

onMounted(async () => {
  const productId = route.params.id
  // 这里应该调用API获取商品详情
})

const addToCart = () => {
  if (!validateSpecs()) return
  
  loading.value = true
  try {
    const productToAdd = {
      ...product.value,
      quantity: quantity.value,
      selectedSpecs: { ...selectedSpecs }
    }
    cartStore.addItem(productToAdd)
    ElMessage.success('已添加到购物车')
  } catch (error) {
    ElMessage.error('添加失败')
  } finally {
    loading.value = false
  }
}

const buyNow = () => {
  if (!validateSpecs()) return
  
  addToCart()
  router.push('/cart')
}

const validateSpecs = () => {
  const unselectedSpec = product.value.specs.find(
    spec => !selectedSpecs[spec.name]
  )
  
  if (unselectedSpec) {
    ElMessage.warning(`请选择${unselectedSpec.name}`)
    return false
  }
  return true
}
</script>

<style scoped>
.product-detail {
  padding: 20px;
}

.product-container {
  max-width: 1200px;
  margin: 0 auto;
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.product-gallery {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.product-info {
  padding: 20px;
}

.product-info h1 {
  margin-bottom: 20px;
  font-size: 24px;
}

.price-section {
  margin-bottom: 20px;
}

.price {
  font-size: 28px;
  color: var(--el-color-danger);
  margin-right: 10px;
}

.original-price {
  color: #999;
  text-decoration: line-through;
}

.sales-info {
  color: #666;
  margin-bottom: 20px;
}

.sales-info span {
  margin-right: 20px;
}

.specs-section {
  margin-bottom: 20px;
}

.spec-group {
  margin-bottom: 15px;
}

.spec-title {
  margin-bottom: 10px;
  color: #666;
}

.spec-options {
  margin-bottom: 15px;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.stock {
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 20px;
}

.product-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.detail-content {
  padding: 20px 0;
}

.review-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.username {
  color: #666;
}

.review-content {
  margin: 10px 0;
}

.review-images {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.review-images .el-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.review-time {
  color: #999;
  font-size: 0.9rem;
}
</style> 