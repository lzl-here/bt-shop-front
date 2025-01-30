<template>
  <div class="product-detail">
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
        <el-tab-pane label="规格参数" name="specs">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const quantity = ref(1)
const activeTab = ref('detail')

// 模拟商品数据
const product = ref({
  id: Number(route.params.id),
  name: 'HUAWEI Mate 60 Pro',
  price: 6999,
  description: '华为年度旗舰手机，搭载麒麟芯片，超长续航',
  image: 'https://via.placeholder.com/400x400',
  images: [
    'https://via.placeholder.com/100x100',
    'https://via.placeholder.com/100x100',
    'https://via.placeholder.com/100x100'
  ],
  detailImages: [
    'https://via.placeholder.com/800x600',
    'https://via.placeholder.com/800x600'
  ],
  sales: 1000,
  brandName: 'HUAWEI',
  storeName: '华为官方旗舰店',
  specs: {
    '屏幕尺寸': '6.76英寸',
    '分辨率': 'FHD+ 2772',
    '刷新率': '90Hz',
    '处理器': '麒麟芯片',
    '电池容量': '5000mAh'
  }
})

// 选择图片
const selectImage = (img) => {
  product.value.image = img
}

// 加入购物车
const addToCart = () => {
  const productToAdd = {
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    description: product.value.description,
    image: product.value.image,
    brandName: product.value.brandName,
    storeName: product.value.storeName,
    quantity: quantity.value,
    selected: true
  }
  
  cartStore.addToCart(productToAdd)
  ElMessage({
    type: 'success',
    message: '成功加入购物车',
    duration: 2000
  })
}

// 立即购买
const buyNow = () => {
  const orderItem = {
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    description: product.value.description,
    image: product.value.image,
    brandName: product.value.brandName,
    storeName: product.value.storeName,
    quantity: quantity.value,
    selected: true
  }

  localStorage.setItem('tempOrder', JSON.stringify([orderItem]))
  
  router.push({
    path: '/checkout',
    query: { from: 'buyNow' }
  })
}

// 在组件挂载时获取商品详情
onMounted(async () => {
  // TODO: 这里应该从后端获取商品详情
  // 目前使用模拟数据
  const productId = Number(route.params.id)
  product.value = {
    id: productId,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    description: '华为年度旗舰手机，搭载麒麟芯片，超长续航',
    image: 'https://via.placeholder.com/400x400',
    brandName: 'HUAWEI',
    storeName: '华为官方旗舰店',
    sales: 1000,
    specs: {
      '屏幕尺寸': '6.76英寸',
      '分辨率': 'FHD+ 2772',
      '刷新率': '90Hz',
      '处理器': '麒麟芯片',
      '电池容量': '5000mAh'
    }
  }
})
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

@media screen and (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style> 