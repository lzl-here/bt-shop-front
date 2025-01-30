import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useUserStore } from '../stores/user'

// 预导入关键组件
import User from '../views/User.vue'
import UserProfile from '../views/user/Profile.vue'
import UserTrade from '../views/user/Trade.vue'
import UserAddress from '../views/user/Address.vue'
import UserSecurity from '../views/user/Security.vue'

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
    component: User,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'UserHome',
        component: () => import('../views/user/UserHome.vue')
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: UserProfile
      },
      {
        path: 'trades',
        name: 'UserTrades',
        component: UserTrade
      },
      {
        path: 'trades/:tradeId',
        name: 'TradeDetail',
        component: () => import('../views/user/TradeDetail.vue')
      },
      {
        path: 'address',
        name: 'UserAddress',
        component: UserAddress
      },
      {
        path: 'security',
        name: 'UserSecurity',
        component: UserSecurity
      }
    ]
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/trades/Checkout.vue'),
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
    component: () => import('../views/trades/Payment.vue'),
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