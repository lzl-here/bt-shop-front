<template>
  <div class="orders">
    <h2>我的订单</h2>
    <div class="order-list" v-if="orders.length">
      <div v-for="order in orders" :key="order.id" class="order-item">
        <div class="order-header">
          <span class="order-number">订单号：{{ order.orderNumber }}</span>
          <span class="order-status">{{ order.status }}</span>
        </div>
        <div class="order-products">
          <div v-for="product in order.products" :key="product.id" class="product-item">
            <img :src="product.image" :alt="product.name">
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-price">¥{{ product.price }}</div>
              <div class="product-quantity">x{{ product.quantity }}</div>
            </div>
          </div>
        </div>
        <div class="order-footer">
          <div class="order-total">
            总计：<span class="price">¥{{ order.total }}</span>
          </div>
          <div class="order-actions">
            <button class="btn-detail">查看详情</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-orders">
      暂无订单
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserOrders',
  data() {
    return {
      orders: [
        // 示例数据
        {
          id: 1,
          orderNumber: 'ORDER2024001',
          status: '待付款',
          total: 299,
          products: [
            {
              id: 1,
              name: '示例商品1',
              price: 299,
              quantity: 1,
              image: '/images/product-1.jpg'
            }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
.orders h2 {
  margin-bottom: 30px;
  color: #333;
}

.order-item {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 20px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.order-number {
  color: #666;
}

.order-status {
  color: var(--primary-color);
}

.order-products {
  padding: 15px 0;
}

.product-item {
  display: flex;
  margin-bottom: 15px;
}

.product-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info {
  margin-left: 15px;
  flex: 1;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.product-price {
  color: #ff4d4f;
  font-size: 14px;
}

.product-quantity {
  color: #999;
  font-size: 12px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.order-total {
  color: #666;
}

.order-total .price {
  color: #ff4d4f;
  font-size: 18px;
  font-weight: bold;
}

.btn-detail {
  padding: 8px 15px;
  background-color: #fff;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  border-radius: 4px;
  cursor: pointer;
}

.btn-detail:hover {
  background-color: var(--primary-color);
  color: #fff;
}

.empty-orders {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
</style> 