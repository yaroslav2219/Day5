import { login } from './login.js'
import { campaigns } from './campaigns.js'
import { campaign } from './campaign.js'

const Empty = (title) => ({
  template: `<div class="inside-content"><h1>${title}</h1></div>`
})

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: [
    { path: '/', name: 'Login', component: login },
    { path: '/campaigns', name: 'Campaigns', component: campaigns },
    { path: '/campaign/:id', name: 'Campaign', component: campaign },

    { path: '/users', name: 'Users', component: Empty('Users') },
    { path: '/statistics', name: 'Statistics', component: Empty('Statistics') },
    { path: '/ads', name: 'Ads', component: Empty('Ads') },
    { path: '/sites', name: 'Sites', component: Empty('Sites') },
    { path: '/payments', name: 'Payments', component: Empty('Payments') }
  ]
})
