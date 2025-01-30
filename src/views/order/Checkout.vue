<template>
  <div class="checkout-container">
    <h2>订单结算页</h2>

    <!-- 商品清单 -->
    <el-card class="order-section">
      <template #header>
        <div class="section-header">商品清单</div>
      </template>
      
      <div class="order-items">
        <div v-for="item in selectedItems" :key="item.id" class="order-item">
          <img :src="item.image" :alt="item.name" class="item-image">
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <!-- 添加规格信息 -->
            <div class="item-specs">
              <el-tag size="small" type="info">{{ item.specs?.color }}</el-tag>
              <el-tag size="small" type="info">{{ item.specs?.memory }}</el-tag>
              <el-tag size="small" type="info">{{ item.specs?.storage }}</el-tag>
            </div>
            <div class="item-store">{{ item.storeName }}</div>
          </div>
          <div class="item-price">¥{{ item.price.toFixed(2) }}</div>
          <div class="item-quantity">x{{ item.quantity }}</div>
          <div class="item-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
        </div>
      </div>
    </el-card>

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
        <span class="amount">¥{{ (totalAmount + shipping).toFixed(2) }}</span>
      </div>
      <el-button 
        type="primary" 
        size="large" 
        :disabled="!selectedAddress"
        @click="submitOrder"
      >
        提交订单
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../../stores/cart'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const submitting = ref(false)

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
  return selectedItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
})

// 运费
const shipping = ref(0)

// 选中的地址和支付方式
const selectedAddress = ref(addresses.value.find(addr => addr.isDefault))
const selectedPayment = ref(paymentMethods.value[0])

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

// 提交订单
const submitOrder = async () => {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }

  submitting.value = true
  try {
    // 模拟创建订单
    const orderData = {
      orderId: Date.now().toString(), // 模拟订单ID
      items: selectedItems.value,
      address: selectedAddress.value,
      totalAmount: totalAmount.value + shipping.value,
      createTime: new Date().toISOString()
    }

    // 存储订单信息，以便在收银台使用
    localStorage.setItem('pendingOrder', JSON.stringify(orderData))

    // 如果是从购物车来的，清除选中的商品
    if (!route.query.from) {
      cartStore.clearSelected()
    }
    // 清除临时订单数据
    localStorage.removeItem('tempOrder')
    
    // 跳转到收银台页面
    router.push({
      path: '/payment',
      query: {
        orderId: orderData.orderId,
        amount: orderData.totalAmount
      }
    })

    ElMessage.success('订单创建成功，正在跳转到收银台...')
  } catch (error) {
    ElMessage.error('订单提交失败')
  } finally {
    submitting.value = false
  }
}

// 在组件卸载时清除临时订单数据
onUnmounted(() => {
  localStorage.removeItem('tempOrder')
})
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

.order-section {
  margin-bottom: 20px;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  align-items: center;
  gap: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-size: 14px;
  color: #333;
}

.item-specs {
  display: flex;
  gap: 8px;
}

.item-store {
  font-size: 12px;
  color: #999;
}

.item-price,
.item-quantity {
  color: #666;
}

.item-subtotal {
  color: #f56c6c;
  font-weight: 500;
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
  .order-item {
    grid-template-columns: 80px 1fr;
    gap: 10px;
  }

  .item-price,
  .item-quantity,
  .item-subtotal {
    grid-column: 2;
    text-align: right;
  }
}
</style> 