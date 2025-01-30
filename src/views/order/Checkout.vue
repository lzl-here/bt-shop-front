<template>
  <div class="checkout-container">
    <el-card class="checkout-card">
      <!-- 收货地址 -->
      <div class="section address-section">
        <h3 class="section-title">收货地址</h3>
        <div class="address-list" v-if="addresses.length">
          <div
            v-for="address in addresses"
            :key="address.id"
            :class="['address-item', selectedAddress?.id === address.id ? 'active' : '']"
            @click="selectAddress(address)"
          >
            <div class="address-info">
              <div class="contact">
                <span class="name">{{ address.name }}</span>
                <span class="phone">{{ address.phone }}</span>
              </div>
              <div class="location">
                {{ address.province + address.city + address.district + address.detail }}
              </div>
            </div>
            <div class="address-default" v-if="address.isDefault">默认</div>
          </div>
        </div>
        <el-button type="primary" plain @click="addNewAddress">
          <el-icon><Plus /></el-icon>添加新地址
        </el-button>
      </div>

      <!-- 商品清单 -->
      <div class="section order-section">
        <h3 class="section-title">商品清单</h3>
        <div class="order-items">
          <div v-for="item in selectedItems" :key="item.id" class="order-item">
            <img :src="item.image" :alt="item.name" class="item-image">
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-attrs">
                <el-tag size="small" type="info">{{ item.brandName }}</el-tag>
                <el-tag size="small" type="info">{{ item.storeName }}</el-tag>
              </div>
            </div>
            <div class="item-price">¥{{ item.price.toFixed(2) }}</div>
            <div class="item-quantity">x{{ item.quantity }}</div>
            <div class="item-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="section payment-section">
        <h3 class="section-title">支付方式</h3>
        <div class="payment-methods">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            :class="['payment-method', selectedPayment?.id === method.id ? 'active' : '']"
            @click="selectPayment(method)"
          >
            <img :src="method.icon" :alt="method.name" class="method-icon">
            <span class="method-name">{{ method.name }}</span>
          </div>
        </div>
      </div>

      <!-- 订单金额 -->
      <div class="section amount-section">
        <div class="amount-item">
          <span>商品总额：</span>
          <span>¥{{ totalAmount.toFixed(2) }}</span>
        </div>
        <div class="amount-item">
          <span>运费：</span>
          <span>¥{{ shipping.toFixed(2) }}</span>
        </div>
        <div class="amount-item total">
          <span>应付金额：</span>
          <span class="final-price">¥{{ (totalAmount + shipping).toFixed(2) }}</span>
        </div>
      </div>

      <!-- 提交订单 -->
      <div class="submit-section">
        <el-button type="primary" size="large" @click="submitOrder" :loading="submitting">
          提交订单
        </el-button>
      </div>
    </el-card>
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
  if (!selectedPayment.value) {
    ElMessage.warning('请选择支付方式')
    return
  }

  submitting.value = true
  try {
    // TODO: 实现提交订单的逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('订单提交成功')
    
    // 如果是从购物车来的，清除选中的商品
    if (!route.query.from) {
      cartStore.clearSelected()
    }
    // 清除临时订单数据
    localStorage.removeItem('tempOrder')
    
    router.push('/user/orders')
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

.section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}

/* 地址样式 */
.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.address-item {
  padding: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.address-item:hover {
  border-color: var(--el-color-primary);
}

.address-item.active {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.contact {
  margin-bottom: 8px;
}

.name {
  font-weight: bold;
  margin-right: 10px;
}

.phone {
  color: #666;
}

.location {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.address-default {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  padding: 2px 6px;
  border-radius: 2px;
}

/* 商品列表样式 */
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

.item-name {
  font-size: 14px;
  margin-bottom: 8px;
}

.item-attrs {
  display: flex;
  gap: 8px;
}

.item-price,
.item-quantity,
.item-subtotal {
  font-size: 14px;
  color: #666;
}

.item-subtotal {
  font-weight: bold;
  color: #f56c6c;
}

/* 支付方式样式 */
.payment-methods {
  display: flex;
  gap: 20px;
}

.payment-method {
  padding: 15px 30px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
}

.payment-method:hover {
  border-color: var(--el-color-primary);
}

.payment-method.active {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.method-icon {
  width: 24px;
  height: 24px;
}

/* 金额样式 */
.amount-section {
  text-align: right;
}

.amount-item {
  margin-bottom: 10px;
  color: #666;
}

.amount-item.total {
  font-size: 16px;
  color: #333;
}

.final-price {
  font-size: 24px;
  color: #f56c6c;
  font-weight: bold;
}

/* 提交按钮样式 */
.submit-section {
  text-align: right;
  margin-top: 20px;
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

  .payment-methods {
    flex-direction: column;
  }
}
</style> 