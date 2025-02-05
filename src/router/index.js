import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useUserStore } from '../stores/user'
import { useStoreStore } from '../stores/store'

// 预导入关键组件
import User from '../views/User.vue'
import UserProfile from '../views/user/Profile.vue'
import UserTrade from '../views/user/Trade.vue'
import UserAddress from '../views/user/Address.vue'
import UserSecurity from '../views/user/Security.vue'
import ProductSearch from '../views/product/ProductSearch.vue'  
import SellerDashboard from '../views/seller/SellerDashboard.vue'
import ProductDetail from '../views/product/ProductDetail.vue'

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
    component: () => import('../views/product/ProductDetail.vue')
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
        component: () => import('../views/user/Trade.vue')
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
      },
      {
        path: 'orders/:orderId',
        name: 'OrderDetail',
        component: () => import('../views/user/OrderDetail.vue')
      }
    ]
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/trades/Checkout.vue'),
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      if (!to.query.trade_id) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/seller',
    component: SellerDashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'order/:orderNumber',
        component: () => import('../views/seller/SellerOrderDetail.vue')
      }
    ]
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('../views/payment/PaymentPage.vue'),
    meta: { requiresAuth: true }
  }
  ,
  {
    path: '/search',
    name: 'SearchResult',
    component: () => import('../views/search/SearchResult.vue'),
    props: (route) => ({
      keyword: route.query.keyword,
      searchType: route.query.type || 'product',
      total: Number(route.query.total) || 0
    })
  },
  {
    path: '/store/:id',
    name: 'StoreDetail',
    component: () => import('../views/store/StoreDetail.vue')
  },
  {
    path: '/seller/bill/:billNo',
    name: 'BillDetail',
    component: () => import('../views/seller/BillDetail.vue'),
    meta: {
      requiresAuth: true,
      requiresStore: true
    }
  },
  {
    path: '/seller/apply',
    name: 'StoreApply',
    component: () => import('../views/seller/StoreApply.vue'),
    meta: { 
      requiresAuth: true,
      title: '店铺入驻'
    }
  },
  {
    path: '/store/search',
    name: 'StoreSearch',
    component: () => import('../views/store/StoreSearch.vue')
  },
  {
    path: '/seller/product/publish',
    name: 'ProductPublish',
    component: () => import('../views/seller/ProductPublish.vue'),
    meta: { requiresAuth: true, requiresStore: true }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail
  },
  {
    path: '/user/trades/:tradeNo',
    name: 'TradeDetail',
    component: () => import('../views/user/TradeDetail.vue'),
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
  const storeStore = useStoreStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresStore && !storeStore.hasStore) {
    if (to.path !== '/seller/apply') {
      next('/seller/apply')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 