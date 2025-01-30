import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useUserStore } from '../stores/user'
import ProductSearch from '../views/product/ProductSearch.vue'
import ProductDetail from '../views/ProductDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/products',
    name: 'products',
    component: ProductSearch
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../views/Categories.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/User.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'orders',
        name: 'UserOrders',
        component: () => import('../views/user/Orders.vue')
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('../views/user/Profile.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router 