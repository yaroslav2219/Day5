import { login } from './login.js'
import { campaigns } from './campaigns.js'
import { campaign } from './campaign.js'

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'Sign in',
            component: login
        },
        {
            path: '/campaigns',
            name: 'Campaigns',
            component: campaigns
        },
        {
            path: '/campaign/:id',
            name: 'Campaign',
            component: campaign
        }
    ]
})
