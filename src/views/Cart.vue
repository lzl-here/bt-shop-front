<template>
  <div class="cart-container">
    <el-card class="cart-card">
      <!-- 购物车头部 -->
      <template #header>
        <div class="cart-header">
          <div class="header-left">
            <el-checkbox v-model="isAllSelected" @change="handleSelectAll">
              全选
            </el-checkbox>
            <span class="header-title">商品信息</span>
          </div>
          <div class="header-right">
            <span class="column-label">单价</span>
            <span class="column-label">数量</span>
            <span class="column-label">小计</span>
            <span class="column-label">操作</span>
          </div>
        </div>
      </template>

      <!-- 购物车列表 -->
      <div v-if="cartStore.items.length" class="cart-list">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <div class="item-main">
            <el-checkbox v-model="item.selected" @change="updateSelectAll" />
            <img :src="item.image" :alt="item.name" class="item-image">
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-desc">{{ item.description }}</div>
              <div class="item-attrs">
                <el-tag size="small" type="info">{{ item.brandName }}</el-tag>
                <el-tag size="small" type="info">{{ item.storeName }}</el-tag>
              </div>
            </div>
          </div>
          <div class="item-price">¥{{ item.price.toFixed(2) }}</div>
          <div class="item-quantity">
            <el-input-number 
              v-model="item.quantity" 
              :min="1" 
              :max="99"
              size="small"
              @change="updateTotal"
            />
          </div>
          <div class="item-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
          <div class="item-actions">
            <el-button 
              type="danger" 
              circle
              size="small"
              @click="removeItem(item)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 空购物车提示 -->
      <el-empty 
        v-else 
        description="购物车是空的"
      >
        <el-button type="primary" @click="$router.push('/products')">
          去购物
        </el-button>
      </el-empty>

      <!-- 购物车底部 -->
      <div v-if="cartStore.items.length" class="cart-footer">
        <div class="footer-left">
          <el-checkbox v-model="isAllSelected" @change="handleSelectAll">
            全选
          </el-checkbox>
          <el-button 
            type="text" 
            class="delete-selected"
            @click="removeSelected"
          >
            删除选中商品
          </el-button>
        </div>
        <div class="footer-right">
          <div class="cart-total">
            <span>已选择 {{ selectedCount }} 件商品</span>
            <span class="total-price">
              合计：<span class="price">¥{{ totalPrice.toFixed(2) }}</span>
            </span>
          </div>
          <el-button 
            type="primary" 
            size="large"
            :disabled="!selectedCount"
            @click="handleCheckout"
          >
            结算
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const router = useRouter()
const cartStore = useCartStore()
const isAllSelected = ref(false)

// 计算选中商品数量
const selectedCount = computed(() => {
  return cartStore.items.filter(item => item.selected).length
})

// 计算总价
const totalPrice = computed(() => {
  return cartStore.items
    .filter(item => item.selected)
    .reduce((total, item) => total + item.price * item.quantity, 0)
})

// 全选/取消全选
const handleSelectAll = (val) => {
  cartStore.items.forEach(item => {
    item.selected = val
  })
}

// 更新全选状态
const updateSelectAll = () => {
  isAllSelected.value = cartStore.items.length > 0 && 
    cartStore.items.every(item => item.selected)
}

// 移除商品
const removeItem = (item) => {
  ElMessageBox.confirm(
    '确定要从购物车中移除该商品吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    cartStore.removeItem(item)
  })
}

// 结算
const handleCheckout = () => {
  // TODO: 实现结算逻辑
  console.log('结算', selectedCount.value, '件商品，总价：', totalPrice.value)
}
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.header-title {
  font-size: 14px;
  color: #666;
}

.header-right {
  display: flex;
  gap: 100px;
}

.column-label {
  font-size: 14px;
  color: #666;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: grid;
  grid-template-columns: auto 100px 150px 100px 80px;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.item-main {
  display: flex;
  align-items: center;
  gap: 20px;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 16px;
  margin-bottom: 8px;
}

.item-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.item-attrs {
  display: flex;
  gap: 8px;
}

.item-price,
.item-subtotal {
  font-size: 16px;
  color: #f56c6c;
  text-align: center;
}

.item-quantity {
  text-align: center;
}

.item-actions {
  text-align: center;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-top: 20px;
  border-top: 1px solid #eee;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.delete-selected {
  color: #666;
}

.delete-selected:hover {
  color: #f56c6c;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-price {
  margin-left: 20px;
}

.price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
}

@media screen and (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .header-right {
    display: none;
  }

  .item-main {
    flex-wrap: wrap;
  }

  .item-price,
  .item-subtotal,
  .item-quantity,
  .item-actions {
    text-align: left;
    padding-left: 44px;
  }

  .cart-footer {
    flex-direction: column;
    gap: 20px;
  }

  .footer-right {
    width: 100%;
    flex-direction: column;
  }
}
</style> 