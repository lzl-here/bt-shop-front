<template>
  <div class="home">
    <!-- 轮播图 -->
    <div class="banner">
      <el-carousel height="500px">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <img :src="banner.image" :alt="banner.title">
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 商品分类 -->
    <div class="categories">
      <h2 class="section-title">商品分类</h2>
      <div class="category-list">
        <div v-for="category in categories" 
             :key="category.id" 
             class="category-item"
             @click="$router.push(`/categories/${category.id}`)">
          <el-image :src="category.icon" fit="cover"></el-image>
          <span>{{ category.name }}</span>
        </div>
      </div>
    </div>

    <!-- 热门商品 -->
    <div class="hot-products">
      <h2 class="section-title">热门商品</h2>
      <div class="product-grid">
        <div v-for="product in hotProducts" 
             :key="product.id" 
             class="product-card"
             @click="$router.push(`/products/${product.id}`)">
          <el-image :src="product.image" fit="cover"></el-image>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="description">{{ product.description }}</p>
            <p class="price">¥{{ product.price }}</p>
            <el-button type="primary" @click.stop="addToCart(product)">
              加入购物车
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { ElMessage } from 'element-plus'

const cartStore = useCartStore()

const banners = ref([
  {
    id: 1,
    image: '/images/banner1.jpg',
    title: '新品上市'
  },
  {
    id: 2,
    image: '/images/banner2.jpg',
    title: '限时特惠'
  }
])

const categories = ref([
  {
    id: 1,
    name: '手机数码',
    icon: '/images/category1.png'
  },
  {
    id: 2,
    name: '电脑办公',
    icon: '/images/category2.png'
  }
])

const hotProducts = ref([
  {
    id: 1,
    name: '商品1',
    price: 1999,
    image: '/images/product1.jpg',
    description: '商品描述...'
  },
  {
    id: 2,
    name: '商品2',
    price: 2999,
    image: '/images/product2.jpg',
    description: '商品描述...'
  }
])

const addToCart = (product) => {
  cartStore.addItem(product)
  ElMessage.success('已添加到购物车')
}
</script>

<style scoped>
.home {
  flex: 1;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section-title {
  text-align: center;
  margin: 2rem 0;
  font-size: 1.8rem;
  color: #333;
}

.categories {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.category-item {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.category-item:hover {
  transform: translateY(-5px);
}

.category-item img {
  width: 80px;
  height: 80px;
  margin-bottom: 0.5rem;
}

.hot-products {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  cursor: pointer;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.description {
  color: #666;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.price {
  color: var(--el-color-danger);
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0.5rem 0;
}
</style> 