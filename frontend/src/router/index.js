import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import User from '../components/user/User.vue'
import Article from '../components/article/Article.vue'
import Welcome from '../components/Welcome.vue'
import Details from '../components/article/Details.vue'
import Add from '../components/article/Add.vue'
import Edit from '../components/article/Edit.vue'
import Log from '../components/report/Log.vue'
import Report from '../components/report/Report.vue'
import Persona from '../components/report/Persona.vue'
import HomePage from '../components/com/HomePage.vue'
import IndexArticle from '../components/com/IndexArticle.vue'
import Test from '../components/test.vue'

// element-ui的全部组件
import ElementUI from 'element-ui'
// element-ui的css
import 'element-ui/lib/theme-chalk/index.css'
// 使用elementUI
Vue.use(ElementUI)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Login },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/user', component: User },
        { path: '/article', component: Article },
        { path: '/welcome', component: Welcome },
        { path: '/log', component: Log },
        { path: '/report', component: Report },
        { path: '/persona', component: Persona },
        { path: '/article/details', component: Details },
        { path: '/article/add', component: Add },
        { path: '/article/edit', component: Edit },
        { path: '/test', component: Test }
      ]
    },
    {
      path: '/index',
      component: HomePage,
      redirect: '/index/welcome',
      children: [
        { path: '/index/article', component: IndexArticle },
        { path: '/index/welcome', component: Welcome }
      ]
    }
  ]
})
// 挂载路由导航守卫
// to将要访问的路径
// from 代表从哪个路径来的
// next 是一个函数，表示放行
//  next() 放行 next('/login')强制跳转到登录页
router.beforeEach((to, from, next) => {
  // 如果用户访问的是登录页 直接放行
  if (to.path === '/login') return next()
  // 从 sessionStorage 中获取到 保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token 代表没有登录 ，强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})
export default router
