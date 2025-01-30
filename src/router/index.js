import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/product/ProductSearch.vue')
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue')
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
    component: () => import('../views/User.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/user/profile'
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('../views/user/Profile.vue')
      },
      {
        path: 'orders',
        name: 'UserOrders',
        component: () => import('../views/user/Orders.vue')
      },
      {
        path: 'address',
        name: 'UserAddress',
        component: () => import('../views/user/Address.vue')
      },
      {
        path: 'security',
        name: 'UserSecurity',
        component: () => import('../views/user/Security.vue')
      }
    ]
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/order/Checkout.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/seller',
    name: 'SellerDashboard',
    component: () => import('../views/seller/SellerDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('../views/order/Payment.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
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