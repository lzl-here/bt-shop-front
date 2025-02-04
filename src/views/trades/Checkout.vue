<template>
  <div class="checkout-container">
    <h2>订单结算页</h2>

    <!-- 商品清单 -->
    <div class="checkout-section">
      <h2 class="section-title">商品清单</h2>
      <div v-if="checkoutItems.length > 0" class="product-list">
        <div v-for="item in checkoutItems" :key="item.sku_id" class="product-item">
          <!-- 商品图片 -->
          <div class="product-image">
            <el-image 
              :src="item.product_info.image" 
              fit="contain"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                  <div class="text">图片加载失败</div>
                </div>
              </template>
            </el-image>
          </div>

          <!-- 商品信息 -->
          <div class="product-info">
            <!-- 商品名称 -->
            <h3 class="product-name">{{ item.product_info.name }}</h3>
            
            <!-- 商品分类和品牌 -->
            <div class="product-meta">
              <span class="meta-item">分类：{{ item.product_info.category_name }}</span>
              <span class="meta-item">品牌：{{ item.product_info.brand_name }}</span>
            </div>
            
            <!-- 规格信息 -->
            <div class="product-specs">
              <span v-for="spec in item.product_info.specs" 
                    :key="spec.spec_id" 
                    class="spec-item"
              >
                {{ spec.spec_name }}: {{ spec.spec_value }}
              </span>
            </div>

            <!-- 价格和数量 -->
            <div class="product-price-qty">
              <span class="price">¥{{ item.product_info.price }}</span>
              <span class="quantity">x {{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无商品" />
    </div>

    <!-- 收货地址 -->
    <el-card class="address-section">
      <template #header>
        <div class="section-header">
          <span>收货地址</span>
          <el-button type="primary" link @click="addNewAddress">
            {{ selectedAddress ? '修改地址' : '添加地址' }}
          </el-button>
        </div>
      </template>

      <div v-if="selectedAddress" class="selected-address">
        <div class="contact-info">
          <span class="name">{{ selectedAddress.name }}</span>
          <span class="phone">{{ selectedAddress.phone }}</span>
        </div>
        <div class="address-detail">
          {{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}
          {{ selectedAddress.detail }}
        </div>
      </div>
      <el-empty v-else description="请添加收货地址" />
    </el-card>

    <!-- 订单金额 -->
    <div class="order-summary">
      <div class="summary-item">
        <span>商品总额：</span>
        <span class="amount">¥{{ totalAmount.toFixed(2) }}</span>
      </div>
      <div class="summary-item">
        <span>运费：</span>
        <span class="amount">¥{{ shipping.toFixed(2) }}</span>
      </div>
      <div class="summary-item total">
        <span>实付金额：</span>
        <span class="amount">¥{{ finalAmount.toFixed(2) }}</span>
      </div>
      <el-button 
        type="primary" 
        size="large" 
        :disabled="checkoutItems.length === 0"
        @click="submitOrder"
      >
        提交订单
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../../stores/cart'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { createTrade } from '../../api/orderApi'
import { pay } from '../../api/payApi'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const submitting = ref(false)
const checkoutItems = ref([])
const shipping = ref(0)
const selectedAddress = ref(null)
const selectedPayment = ref(null)
const tradeData = ref(null)
const tradeToken = ref('') // 存储当前交易的 token

// 收货地址数据
const addresses = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园南路XX号',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '广东省',
    city: '深圳市',
    district: '福田区',
    detail: '福田中心区XX号',
    isDefault: false
  }
])

// 支付方式
const paymentMethods = ref([
  {
    id: 1,
    name: '支付宝',
    icon: 'https://via.placeholder.com/40x40'
  },
  {
    id: 2,
    name: '微信支付',
    icon: 'https://via.placeholder.com/40x40'
  }
])

// 选中的商品
const selectedItems = computed(() => {
  // 如果是从立即购买来的，使用临时订单数据
  if (route.query.from === 'buyNow') {
    const tempOrder = JSON.parse(localStorage.getItem('tempOrder') || '[]')
    return tempOrder
  }
  // 否则使用购物车中选中的商品
  return cartStore.items.filter(item => item.selected)
})

// 商品总额
const totalAmount = computed(() => {
  const amount = checkoutItems.value.reduce((total, item) => {
    return total + Number(item.product_info.price) * item.quantity
  }, 0)
  console.log('Calculated total amount:', amount) // 调试日志
  return amount
})

// 实付金额
const finalAmount = computed(() => {
  return totalAmount.value + shipping.value
})

// 选择收货地址
const selectAddress = (address) => {
  selectedAddress.value = address
}

// 选择支付方式
const selectPayment = (method) => {
  selectedPayment.value = method
}

// 添加新地址
const addNewAddress = () => {
  // TODO: 实现添加新地址的逻辑
  console.log('添加新地址')
}

// 生成唯一的 token
const generateToken = () => {
  return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// 加载交易数据
const loadTradeData = () => {
  try {
    const tradeId = route.query.trade_id
    
    if (!tradeId) {
      throw new Error('Missing trade ID')
    }
    
    const data = localStorage.getItem(tradeId)
    if (!data) {
      throw new Error('No trade data found')
    }
    
    // 重置数据
    tradeData.value = null
    checkoutItems.value = []
    
    // 生成新的 token
    tradeToken.value = generateToken()
    
    // 加载新数据
    const parsedData = JSON.parse(data)
    console.log('Parsed trade data:', parsedData) // 调试日志
    
    tradeData.value = parsedData
    checkoutItems.value = parsedData.items || []
    selectedAddress.value = parsedData.address
    selectedPayment.value = parsedData.payment
    shipping.value = parsedData.shipping?.fee || 0
    
    console.log('Trade data loaded:', tradeData.value)
    console.log('Checkout items:', checkoutItems.value)
    console.log('Trade token generated:', tradeToken.value)
  } catch (error) {
    console.error('Error loading trade data:', error)
    ElMessage.error(error.message || '加载交易数据失败')
    router.push('/')
  }
}

// 监听路由变化
watch(
  () => route.query.trade_id,
  (newTradeId) => {
    if (newTradeId) {
      loadTradeData()
    }
  },
  { immediate: true }
)

// 更新交易数据
const updateTradeData = () => {
  if (!tradeData.value) return
  
  const tradeId = route.query.trade_id
  if (!tradeId) return
  
  tradeData.value = {
    ...tradeData.value,
    address: selectedAddress.value,
    payment: selectedPayment.value,
    shipping: {
      fee: shipping.value,
      method: '普通快递'
    },
    updated_at: new Date().toISOString()
  }
  
  localStorage.setItem(tradeId, JSON.stringify(tradeData.value))
}

// 监听地址变化
watch(selectedAddress, () => {
  updateTradeData()
})

// 监听支付方式变化
watch(selectedPayment, () => {
  updateTradeData()
})

// 提交订单
const submitOrder = async () => {
  try {
    // 构建订单数据
    const orderData = {
      token: tradeToken.value, // 使用生成的 token
      trade: {
        trade: {
          trade_amount: finalAmount.value.toString(),
          buyer_id: 1,
          seller_id: 1,
          pay_type: selectedPayment.value?.method || 'alipay'
        },
        order_list: [{
          order: {
            shop_id: 1,
            order_amount: totalAmount.value.toString(),
            seller_id: 1,
            buyer_id: 1,
            buy_num: checkoutItems.value.reduce((sum, item) => sum + item.quantity, 0)
          },
          order_item_list: checkoutItems.value.map(item => ({
            spu_id: item.spu_id,
            sku_id: item.sku_id,
            spu_name: item.product_info.name,
            category_id: item.product_info.category_id,
            category_name: item.product_info.category_name,
            brand_id: item.product_info.brand_id,
            brand_name: item.product_info.brand_name,
            sku_img_url: item.product_info.image,
            sku_amount: item.product_info.price,
            spec_value_list: item.product_info.specs,
            shop_id: 1,
            seller_id: 1,
            buyer_id: 1,
            buy_num: item.quantity
          }))
        }]
      }
    }

    console.log('Submitting order with token:', tradeToken.value)
    const orderResponse = await createTrade(orderData)
    
    if (orderResponse.code === 1 && orderResponse.data) {
      // 发起支付
      const payData = {
        trade_no: orderResponse.data.trade_no,
        subject: checkoutItems.value[0].product_info.name + 
                (checkoutItems.value.length > 1 ? ` 等${checkoutItems.value.length}件商品` : ''),
        totalAmount: finalAmount.value.toString(),
        pay_type: selectedPayment.value?.method || 'alipay'
      }

      const payResponse = await pay(payData)

      if (payResponse.code === 1 && payResponse.data) {
        cleanup()
        localStorage.setItem('pending_trade_no', orderResponse.data.trade_no)
        window.location.href = payResponse.data.pay_page_url
        ElMessage.success('订单创建成功，正在跳转支付...')
      } else {
        throw new Error(payResponse.msg || '发起支付失败')
      }
    } else {
      throw new Error(orderResponse.msg || '创建订单失败')
    }
  } catch (error) {
    console.error('Error submitting order:', error)
    ElMessage.error(error.message || '订单提交失败')
  }
}

// 清理数据
const cleanup = () => {
  const tradeId = route.query.trade_id
  if (tradeId) {
    localStorage.removeItem(tradeId)
    localStorage.removeItem('current_trade_id')
    tradeToken.value = '' // 清除 token
  }
}
</script>

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.checkout-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item {
  display: flex;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 16px;
}

.product-image {
  width: 120px;
  height: 120px;
  margin-right: 20px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 16px;
  color: #333;
  margin: 0 0 12px;
}

.product-meta {
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.meta-item {
  margin-right: 16px;
}

.product-specs {
  margin-bottom: 12px;
}

.spec-item {
  display: inline-block;
  padding: 4px 8px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  margin: 0 8px 8px 0;
}

.product-price-qty {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: 500;
}

.quantity {
  color: #666;
  font-size: 14px;
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
  font-size: 12px;
}

.address-section {
  margin-bottom: 20px;
}

.selected-address {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.contact-info {
  margin-bottom: 8px;
}

.name {
  font-weight: 500;
  margin-right: 15px;
}

.phone {
  color: #666;
}

.address-detail {
  color: #666;
  line-height: 1.5;
}

.order-summary {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.summary-item {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}

.summary-item .amount {
  margin-left: 20px;
  color: #666;
}

.summary-item.total {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.summary-item.total .amount {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

.el-button {
  margin-top: 20px;
  width: 200px;
}

@media screen and (max-width: 768px) {
  .product-item {
    flex-direction: column;
    gap: 10px;
  }

  .product-price-qty {
    flex-direction: column;
    align-items: flex-end;
  }
}
</style> 