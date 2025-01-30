<template>
  <div class="cart-container">
    <div class="cart-header">
      <h2>购物车</h2>
      <div class="cart-summary">共 {{ cartStore.totalItems }} 件商品</div>
    </div>

    <!-- 购物车列表 -->
    <div class="cart-list" v-if="cartStore.items.length">
      <el-table :data="cartStore.items" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="商品信息" min-width="400">
          <template #default="{ row }">
            <div class="product-info">
              <el-image :src="row.image" class="product-image" />
              <div class="product-detail">
                <div class="product-name">{{ row.name }}</div>
                <div class="product-specs">
                  <el-tag size="small" type="info">{{ row.specs?.color }}</el-tag>
                  <el-tag size="small" type="info">{{ row.specs?.memory }}</el-tag>
                  <el-tag size="small" type="info">{{ row.specs?.storage }}</el-tag>
                </div>
                <div class="store-name">{{ row.storeName }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="单价" width="120" align="center">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="数量" width="150" align="center">
          <template #default="{ row }">
            <el-input-number 
              v-model="row.quantity" 
              :min="1" 
              :max="99"
              size="small"
              @change="(value) => handleQuantityChange(row, value)"
            />
          </template>
        </el-table-column>

        <el-table-column label="小计" width="120" align="center">
          <template #default="{ row }">
            <span class="subtotal">¥{{ (row.price * row.quantity).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button 
              type="danger" 
              link
              @click="removeItem(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 购物车底部 -->
      <div class="cart-footer">
        <div class="left">
          <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
          <el-button type="danger" link @click="clearCart">清空购物车</el-button>
        </div>
        <div class="right">
          <div class="total-info">
            已选择 <span class="selected-count">{{ selectedItems.length }}</span> 件商品
            <span class="total-price">
              合计：<span class="price">¥{{ totalPrice.toFixed(2) }}</span>
            </span>
          </div>
          <el-button 
            type="primary" 
            size="large" 
            :disabled="!selectedItems.length"
            @click="checkout"
          >
            结算
          </el-button>
        </div>
      </div>
    </div>

    <!-- 空购物车 -->
    <el-empty 
      v-else 
      description="购物车是空的"
    >
      <el-button type="primary" @click="$router.push('/products')">
        去购物
      </el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()
const selectedItems = ref([])
const selectAll = ref(false)

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedItems.value = selection
  selectAll.value = selection.length === cartStore.items.length
}

// 处理全选
const handleSelectAll = (val) => {
  cartStore.items.forEach(item => {
    item.selected = val
  })
}

// 处理数量变化
const handleQuantityChange = (item, value) => {
  cartStore.updateQuantity(item.id, value)
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
    cartStore.removeFromCart(item.id)
    ElMessage.success('商品已移除')
  })
}

// 清空购物车
const clearCart = () => {
  ElMessageBox.confirm(
    '确定要清空购物车吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    cartStore.clearCart()
    ElMessage.success('购物车已清空')
  })
}

// 结算
const checkout = () => {
  if (!selectedItems.value.length) {
    ElMessage.warning('请先选择要结算的商品')
    return
  }
  router.push('/checkout')
}

// 计算总价
const totalPrice = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
})
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.cart-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-info {
  display: flex;
  gap: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-detail {
  flex: 1;
}

.product-name {
  font-size: 14px;
  margin-bottom: 8px;
}

.product-specs {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.store-name {
  font-size: 12px;
  color: #999;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.cart-footer {
  margin-top: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f8f8;
  border-radius: 4px;
}

.left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-info {
  font-size: 14px;
}

.selected-count {
  color: #f56c6c;
  font-weight: bold;
}

.total-price {
  margin-left: 20px;
}
</style> 