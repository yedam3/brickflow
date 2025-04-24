export default[
    {
        path: '/mat/order',
        name: 'Schedule',
        component: () => import('@/views/pages/mat/MatOrder.vue')
    },
    {
        path: '/mat/practice',
        name: 'MatPractice',
        component: () => import('@/views/pages/mat/AgPractice.vue')
    },
]