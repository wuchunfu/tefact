import { auth } from "@arrplat/utils"
import { appStore } from '~/utils/store-accessor'

const whiteList = ['/login']

const pluginFilter = (to) => {
  const appRoute = to.path.replace('/plugins/', '').split('/')[0]
  const apps = appStore.apps
  if (!apps) return

  const currentApp = apps.filter(that => that.admin_route === appRoute)

  if (currentApp && currentApp.length > 0)
    appStore.setCurrentAppId(currentApp[0].id)
}

const lightFilter = (to) => {
  const appRoute = to.path.replace('/light/', '').split('/')[0]
  const apps = appStore.apps
  if (!apps) return
  const currentApp = apps.filter(that => that.name === appRoute)

  if (currentApp && currentApp.length > 0)
    appStore.setCurrentAppId(currentApp[0].id)
}


export default async ({ app }) => {
  await app.router.beforeEach((to, from, next) => {
    if (to.path && to.path.indexOf('/plugins') === 0)
      pluginFilter(to)

    if (to.path && to.path.indexOf('/light') === 0)
      lightFilter(to)

    if (auth.getToken())
      return next()

    if (whiteList.indexOf(to.path) !== -1) next()
    else next({path: '/login'})
  })
}
