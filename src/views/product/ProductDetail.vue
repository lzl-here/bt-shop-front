<template>
  <div class="product-detail">
    <!-- 错误提示 -->
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      :closable="true"
      @close="error = ''"
      show-icon
      center
      class="error-alert"
    />

    <!-- 商品信息 -->
    <div v-if="product" class="product-container">
      <!-- 左侧商品图片 -->
      <div class="product-gallery">
        <el-image 
          :src="product.spu.spu.spu_img_url" 
          fit="contain"
          :preview-src-list="[product.spu.spu.spu_img_url]"
          :initial-index="0"
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

      <!-- 右侧商品信息 -->
      <div class="product-content">
        <!-- 商品标题和描述 -->
        <div class="product-header">
          <h1 class="product-name">{{ product.spu.spu.spu_name }}</h1>
          <p class="product-desc">{{ product.spu.spu.spu_desc }}</p>
        </div>

        <!-- 商品分类和品牌 -->
        <div class="product-meta">
          <div class="meta-item">
            分类：{{ product.spu.spu.category_name }}
          </div>
          <div class="meta-item">
            品牌：{{ product.spu.spu.brand_name }}
          </div>
        </div>

        <!-- 规格选择 -->
        <div v-if="product.spu.spec_list && product.spu.spec_list.length > 0" class="product-specs">
          <div v-for="spec in product.spu.spec_list" :key="spec.id" class="spec-group">
            <div class="spec-name">{{ spec.spec_name }}</div>
            <div class="spec-values">
              <el-radio-group v-model="selectedSpecs[spec.id]">
                <el-radio-button 
                  v-for="value in getSpecValues(spec.id)" 
                  :key="value.id" 
                  :label="value.id"
                >
                  {{ value.spec_value }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <!-- 库存信息 -->
          <div class="stock-info">
            <div class="stock-label">库存：</div>
            <div class="stock-value" :class="{ 'low-stock': isLowStock }">
              {{ currentSku ? currentSku.sku.stock_num : '请选择规格' }}
            </div>
          </div>
        </div>

        <!-- 价格和购买区域 -->
        <div class="product-purchase">
          <div class="price">
            ¥{{ currentSku ? currentSku.sku.sku_price : product.spu.spu.spu_price }}
          </div>
          
          <!-- 数量选择 -->
          <div class="quantity">
            <span class="label">数量：</span>
            <el-input-number 
              v-model="quantity" 
              :min="1" 
              :max="currentSku ? currentSku.sku.stock_num : 99"
              :disabled="!currentSku"
            />
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="addToCart">
              加入购物车
            </el-button>
            <el-button type="danger" size="large" @click="buyNow">
              去结算
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else-if="loading" class="loading">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 错误状态 -->
    <el-empty 
      v-else
      description="商品不存在或已下架"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/products')">
          继续购物
        </el-button>
      </template>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGoodsDetail } from '../../api/goodsApi'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
// 导入图片

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')
const product = ref(null)
const quantity = ref(1)
const selectedSpecs = ref({})

// 获取商品详情
const fetchProductDetail = async () => {
  try {
    error.value = ''
    loading.value = true
    
    const spuId = parseInt(route.params.id, 10)
    if (isNaN(spuId)) {
      error.value = '无效的商品ID'
      product.value = null
      return
    }

    const response = await getGoodsDetail(spuId)
    console.log('Product detail response:', response)
    
    if (response.code === 1 && response.data && response.data.spu) {
      product.value = response.data
      // 初始化规格选择
      initializeSpecs()
    } else {
      product.value = null
      error.value = response.msg || '获取商品详情失败'
    }
  } catch (error) {
    console.error('Failed to fetch product detail:', error)
    product.value = null
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 初始化规格选择
const initializeSpecs = () => {
  if (!product.value?.spu.spec_list) return
  
  // 清空之前的选择
  selectedSpecs.value = {}
  
  // 为每个规格选择第一个可用值
  product.value.spu.spec_list.forEach(spec => {
    const values = getSpecValues(spec.id)
    if (values.length > 0) {
      selectedSpecs.value[spec.spec_id] = values[0].id
    }
  })
}

// 获取规格对应的可选值
const getSpecValues = (specId) => {
  if (!product.value || !product.value.spu.sku_list) return []
  
  // 从所有 SKU 中收集指定规格的值
  const values = new Map()
  product.value.spu.sku_list.forEach(sku => {
    sku.spec_value_list.forEach(spec => {
      if (spec.spec_id === specId) {
        values.set(spec.id, {
          id: spec.id,
          spec_id: spec.spec_id,
          spec_value: spec.spec_value
        })
      }
    })
  })
  
  return Array.from(values.values())
}

// 根据选择的规格获取对应的 SKU
const currentSku = computed(() => {
  if (!product.value?.spu.sku_list || !selectedSpecs.value) return null

  // 检查是否所有规格都已选择
  const allSpecsSelected = product.value.spu.spec_list.every(spec => 
    selectedSpecs.value[spec.spec_id] !== undefined
  )

  if (!allSpecsSelected) return null

  // 查找匹配的 SKU
  return product.value.spu.sku_list.find(sku => 
    sku.spec_value_list.every(spec => 
      selectedSpecs.value[spec.spec_id] === spec.id
    )
  )
})

// 检查是否已选择所有规格
const hasSelectedAllSpecs = computed(() => {
  if (!product.value?.spu.spec_list) return true
  return product.value.spu.spec_list.every(spec => 
    selectedSpecs.value[spec.spec_id] !== undefined
  )
})

// 判断是否低库存（小于10件）
const isLowStock = computed(() => {
  return currentSku.value && currentSku.value.sku.stock_num < 10
})

// 加入购物车
const addToCart = async () => {
  if (!hasSelectedAllSpecs.value) {
    ElMessage.warning('请选择完整的商品规格')
    return
  }

  if (!currentSku.value) {
    ElMessage.warning('所选规格组合不可用')
    return
  }
  
  try {
    // TODO: 调用加入购物车 API
    ElMessage.success('加入购物车成功')
  } catch (error) {
    ElMessage.error('加入购物车失败')
  }
}

// 更新当前选中的 SKU
const updateCurrentSku = () => {
  if (!product.value || !hasSelectedAllSpecs.value) {
    currentSku.value = null
    return
  }

  // 获取当前选择的规格值 ID 组合
  const selectedSpecIds = Object.values(selectedSpecs.value)
  
  // 在 SKU 列表中查找匹配的 SKU
  currentSku.value = product.value.spu.sku_list.find(sku => {
    // 检查 SKU 的规格值是否完全匹配当前选择
    const skuSpecIds = sku.spec_value_list.map(spec => spec.id)
    return selectedSpecIds.length === skuSpecIds.length && 
           selectedSpecIds.every(id => skuSpecIds.includes(id))
  })

  console.log('Current SKU updated:', currentSku.value) // 调试日志
}

// 监听规格选择变化
watch(selectedSpecs, async (newSpecs) => {
  // 更新当前 SKU
  updateCurrentSku()
  
  // 如果已经选择了所有规格，更新结算数据
  if (hasSelectedAllSpecs.value && currentSku.value) {
    updateCheckoutData()
    
    // 如果当前在结算页，则重新加载
    if (route.path === '/checkout') {
      const tradeId = localStorage.getItem('current_trade_id')
      router.replace({
        path: '/checkout',
        query: { 
          from: 'buy_now',
          trade_id: tradeId
        }
      })
    }
  }
}, { deep: true })

// 生成唯一的交易ID
const generateTradeId = () => {
  return 'trade_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// 更新结算数据
const updateCheckoutData = () => {
  if (!currentSku.value) return
  
  // 生成新的交易ID
  const tradeId = generateTradeId()
  
  // 构建交易数据
  const tradeData = {
    items: [{
      spu_id: product.value.spu.spu.id,
      sku_id: currentSku.value.sku.id,
      quantity: quantity.value,
      product_info: {
        name: product.value.spu.spu.spu_name,
        image: product.value.spu.spu.spu_img_url,
        price: currentSku.value.sku.sku_price,
        category_id: product.value.spu.spu.category_id,
        category_name: product.value.spu.spu.category_name,
        brand_id: product.value.spu.spu.brand_id,
        brand_name: product.value.spu.spu.brand_name,
        specs: currentSku.value.spec_value_list.map(spec => ({
          id: spec.id,
          spec_id: spec.spec_id,
          spec_name: spec.spec_name,
          spec_value: spec.spec_value
        }))
      }
    }],
    address: null, // 初始为空，在结算页选择
    payment: {
      method: 'alipay', // 默认支付方式
      amount: currentSku.value.sku.sku_price * quantity.value
    },
    shipping: {
      fee: 0, // 运费
      method: '普通快递'
    },
    created_at: new Date().toISOString()
  }
  
  // 存储交易数据
  localStorage.setItem(tradeId, JSON.stringify(tradeData))
  
  // 存储最新的交易ID
  localStorage.setItem('current_trade_id', tradeId)
}

// 监听数量变化
watch(quantity, () => {
  if (hasSelectedAllSpecs.value && currentSku.value) {
    updateCheckoutData()
  }
})

// 立即购买
const buyNow = () => {
  if (!hasSelectedAllSpecs.value) {
    ElMessage.warning('请选择完整的商品规格')
    return
  }

  if (!currentSku.value) {
    ElMessage.warning('所选规格组合不可用')
    return
  }
  
  // 更新结算数据
  updateCheckoutData()
  
  // 获取当前交易ID
  const tradeId = localStorage.getItem('current_trade_id')
  
  // 跳转到结算页面
  router.push({
    path: '/checkout',
    query: { 
      from: 'buy_now',
      trade_id: tradeId // 传递交易ID
    }
  })
}

onMounted(() => {
  fetchProductDetail()
})
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-bottom: 20px;
}

.product-container {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  gap: 40px;
}

.product-gallery {
  width: 400px;
  flex-shrink: 0;
}

.product-image {
  width: 100%;
  height: 400px;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.product-content {
  flex: 1;
  min-width: 0;
}

.product-header {
  margin-bottom: 20px;
}

.product-name {
  font-size: 24px;
  color: #333;
  margin: 0 0 12px;
}

.product-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.product-meta {
  padding: 16px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.meta-item {
  margin: 8px 0;
  color: #666;
}

.product-specs {
  margin: 20px 0;
}

.spec-group {
  margin-bottom: 16px;
}

.spec-name {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.spec-values {
  margin-bottom: 12px;
}

.product-purchase {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.price {
  font-size: 28px;
  color: #f56c6c;
  margin-bottom: 24px;
}

.quantity {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.quantity .label {
  margin-right: 12px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.action-buttons .el-button {
  flex: 1;
  height: 48px;
}

.image-error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #909399;
}

.image-error .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.image-error .text {
  font-size: 14px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.stock-info {
  margin-top: 16px;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.stock-label {
  color: #666;
  margin-right: 8px;
}

.stock-value {
  color: #67c23a;
  font-weight: 500;
}

.stock-value.low-stock {
  color: #e6a23c;
}
</style> 