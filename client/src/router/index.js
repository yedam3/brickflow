import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/DashBoard.vue')
                },
                {
                    path: '/work/schedule',
                    name: 'Schedule',
                    component: () => import('@/views/pages/work/Schedule.vue')
                },
                {
                    path: '/work/dispatch',
                    name: 'Dispatch',
                    component: () => import('@/views/pages/work/Dispatch.vue')
                },
                {
                    path: '/work/order',
                    name: 'Order',
                    component: () => import('@/views/pages/work/Order.vue')
                },
                {
                    path: '/work/process',
                    name: 'Process',
                    component: () => import('@/views/pages/work/Process.vue')
                },
                {
                    path: '/work/report',
                    name: 'Report',
                    component: () => import('@/views/pages/work/Report.vue')
                },
            ]
        },
        // {
        //     path: '/landing',
        //     name: 'landing',
        //     component: () => import('@/views/pages/Landing.vue')
        // },
        // {
        //     path: '/pages/notfound',
        //     name: 'notfound',
        //     component: () => import('@/views/pages/NotFound.vue')
        // },

        // {
        //     path: '/auth/login',
        //     name: 'login',
        //     component: () => import('@/views/pages/auth/Login.vue')
        // },
        // {
        //     path: '/auth/access',
        //     name: 'accessDenied',
        //     component: () => import('@/views/pages/auth/Access.vue')
        // },
        // {
        //     path: '/auth/error',
        //     name: 'error',
        //     component: () => import('@/views/pages/auth/Error.vue')
        // }
    ]
});

export default router;
