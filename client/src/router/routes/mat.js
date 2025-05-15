export default[
    {
        path: '/mat/practice',
        name: 'MatPractice',
        component: () => import('@/views/pages/mat/AgPractice.vue')
    },
    {
        path: '/mat/order',
        name: 'matOrder',
        component: () => import('@/views/pages/mat/MatOrder.vue')
    },
    {
        path: '/mat/check',
        name: 'MatCheck',
        component: () => import('@/views/pages/mat/MatCheck.vue')
    },
    {
        path: '/mat/store',
        name: 'MatStore',
        component: () => import('@/views/pages/mat/MatStore.vue')
    },
    { 
        path: '/mat/matList',
        name : 'MatList',
        component: () => import('@/views/pages/mat/MatStoreList.vue')
    },
]