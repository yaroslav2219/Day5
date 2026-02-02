import { login } from './login.js';
import { campaigns } from './campaigns.js';
import { campaign } from './campaign.js';

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/', name:'Sign in', component: login },
        { path: '/campaigns', name:'Campaigns', component: campaigns },
        { path: '/campaign/:id', name:'Campaign', component: campaign },

          {
            path: '/campaign/:id',
            name: 'Campaign view',
            component: {
                template: `<div style="padding:20px">
                    <h2>Campaign {{ $route.params.id }}</h2>
                </div>`
            }
        }
    ]
});





