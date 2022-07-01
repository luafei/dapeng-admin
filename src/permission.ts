import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import i18n from '@/lang' // Internationalization
import settings from './settings'
import { fromPairs } from 'lodash'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

const getPageTitle = (key: string) => {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${settings.title}`
  }
  return `${settings.title}`
}

function dealRoot(next:any) {
  let route = PermissionModule.dynamicRoutes[0]
  let path = route && route.children[0].path
  next({ path: `${route.path}${path}` })
  NProgress.done()
}

router.beforeEach(async(to: Route, from: Route, next: any) => {
  // Start progress bar
  NProgress.start()
  // Determine whether the user has logged in
  // if (UserModule.token) {
  if (UserModule.token) {
    if (to.path === '/login' && PermissionModule.dynamicRoutes.length > 0) {
      // If is logged in, redirect to the home page
      // next({ path: '/' })
      dealRoot(next)
      NProgress.done()
    } else {
      // Check whether the user has obtained his permission roles
      if (PermissionModule.dynamicRoutes.length === 0) {
        // try {
          // Note: roles must be a object array! such as: ['admin'] or ['developer', 'editor']
          // await UserModule.GetUserInfo()
          const roles = UserModule.roles
          // Generate accessible routes map based on role
          PermissionModule.GenerateRoutes(roles)
          // Dynamically add accessible routes
          router.addRoutes(PermissionModule.dynamicRoutes)
          if(PermissionModule.dynamicRoutes.length === 0){
            Message.error('您没有访问权限，请联系管理员开通！')
            UserModule.LogOut()
          }
          if (to.path == '/login' || to.path == '/') {
            dealRoot(next)
            return
          }
          // Hack: ensure addRoutes is complete
          // Set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        // } catch (err) {
        //   // Remove token and redirect to login page
        //   UserModule.ResetToken()
        //   Message.error(err || 'Has Error')
        //   next(`/login?redirect=${to.path}`)
        //   NProgress.done()
        // }
      } else {
        if (to.path == '/') {
          dealRoot(next)
          return
        }
        next()
      }
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      //In the free login whitelist, go directly
      //Dynamically add accessible routes
      //Hack: ensure addRoutes is complete
      //Set the replace: true, so the navigation will not leave a history record
      // router.addRoutes(PermissionModule.dynamicRoutes)
      // PermissionModule.GenerateRoutes(['admin'])
      // next({ path: '/permissions/index' })
    

      next()
    } else {
      // next(`/login?redirect=${to.path}`)
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  NProgress.done()

  // set page title
  document.title = getPageTitle(to.meta.title)
})
