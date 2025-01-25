<template>
  <div class="cart-page">
    <div class="cart-container">
      <h2 class="page-title">购物车</h2>
      
      <!-- 空购物车提示 -->
      <el-empty 
        v-if="!cartStore.items.length"
        description="购物车是空的"
      >
        <el-button type="primary" @click="$router.push('/products')">
          去购物
        </el-button>
      </el-empty>

      <!-- 购物车列表 -->
      <template v-else>
        <div class="cart-header">
          <el-checkbox 
            v-model="allSelected"
            @change="handleSelectAll"
          >
            全选
          </el-checkbox>
          <span>商品信息</span>
          <span>单价</span>
          <span>数量</span>
          <span>小计</span>
          <span>操作</span>
        </div>

        <div class="cart-list">
          <div v-for="item in cartStore.items" 
               :key="item.id"
               class="cart-item"
          >
            <el-checkbox v-model="item.selected"></el-checkbox>
            
            <div class="product-info">
              <el-image :src="item.image" :alt="item.name"></el-image>
              <div class="product-detail">
                <h3>{{ item.name }}</h3>
                <p class="specs" v-if="item.selectedSpecs">
                  <span v-for="(value, key) in item.selectedSpecs" 
                        :key="key"
                        class="spec-tag"
                  >
                    {{ key }}: {{ value }}
                  </span>
                </p>
              </div>
            </div>

            <div class="price">¥{{ item.price }}</div>

            <el-input-number 
              v-model="item.quantity"
              :min="1"
              :max="item.stock || 99"
              @change="(val) => updateQuantity(item.id, val)"
            ></el-input-number>

            <div class="subtotal">¥{{ item.price * item.quantity }}</div>

            <div class="actions">
              <el-button 
                type="danger" 
                circle
                plain
                @click="removeItem(item)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <!-- 购物车底部 -->
        <div class="cart-footer">
          <div class="left">
            <el-button @click="clearCart">清空购物车</el-button>
            <span class="selected-count">
              已选择 {{ selectedCount }} 件商品
            </span>
          </div>
          
          <div class="right">
            <div class="total-price">
              合计：<span>¥{{ totalPrice }}</span>
            </div>
            <el-button 
              type="primary" 
              size="large"
              :disabled="!selectedCount"
              @click="checkout"
            >
              结算 ({{ selectedCount }})
            </el-button>
          </div>
        </div>
      </template>
    </div>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="showDeleteDialog"
      title="确认删除"
      width="300px"
    >
      <span>确定要删除这个商品吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDeleteDialog = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
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

const showDeleteDialog = ref(false)
const itemToDelete = ref(null)

// 计算属性
const selectedCount = computed(() => 
  cartStore.items.filter(item => item.selected).length
)

const totalPrice = computed(() => 
  cartStore.items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const allSelected = computed({
  get: () => cartStore.items.length && cartStore.items.every(item => item.selected),
  set: (value) => handleSelectAll(value)
})

// 方法
const handleSelectAll = (value) => {
  cartStore.items.forEach(item => item.selected = value)
}

const updateQuantity = (productId, quantity) => {
  cartStore.updateQuantity(productId, quantity)
}

const removeItem = (item) => {
  itemToDelete.value = item
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  if (itemToDelete.value) {
    cartStore.removeItem(itemToDelete.value.id)
    ElMessage.success('商品已删除')
  }
  showDeleteDialog.value = false
  itemToDelete.value = null
}

const clearCart = () => {
  ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    cartStore.clearCart()
    ElMessage.success('购物车已清空')
  })
}

const checkout = () => {
  if (!selectedCount.value) {
    ElMessage.warning('请选择要结算的商品')
    return
  }
  router.push('/checkout')
}
</script>

<style scoped>
.cart-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.page-title {
  margin-bottom: 20px;
  font-size: 24px;
}

.cart-header {
  display: grid;
  grid-template-columns: 50px 3fr 1fr 1fr 1fr 80px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  align-items: center;
  color: #666;
}

.cart-item {
  display: grid;
  grid-template-columns: 50px 3fr 1fr 1fr 1fr 80px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.product-info {
  display: flex;
  gap: 15px;
}

.product-info .el-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.product-detail h3 {
  margin-bottom: 10px;
}

.specs {
  display: flex;
  gap: 10px;
}

.spec-tag {
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.price, .subtotal {
  color: var(--el-color-danger);
  font-weight: bold;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  margin-top: 20px;
}

.selected-count {
  margin-left: 20px;
  color: #666;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-price {
  font-size: 16px;
}

.total-price span {
  color: var(--el-color-danger);
  font-size: 24px;
  font-weight: bold;
}
</style> 