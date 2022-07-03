import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import stroage from '../util/storage'
import Welcome from '../views/Welcome'
import Users from '../views/Users'
import Permissions from '../views/Permissions/Permissions'
import Role from '../views/Permissions/Role'
import Orders from '../views/Orders'
import Goods from '../views/Goods'
import Categories from '../views/Goods/Categories'
import Params from '../views/Goods/Params'
import GoodAdd from '../views/Goods/GoodAdd'
import Reports from '../views/Reports'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/users',
        component: Users
      },
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/rights',
        component: Permissions
      },
      {
        path: '/roles',
        component: Role
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/goods/add',
        component: GoodAdd
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/reports',
        component: Reports
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = stroage.get('token')
  console.log('token: ', token)
  if (!token) return next('/login')
  next()
})

export default router
