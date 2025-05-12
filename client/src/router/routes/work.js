export default[
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
        path: '/work/control',
        name: 'Control',
        component: () => import('@/views/pages/work/Control.vue')
    },
    {
        path: '/work/process',
        name: 'Process',
        component: () => import('@/views/pages/work/Process.vue')
    },
    {
        path: '/work/state',
        name: 'State',
        component: () => import('@/views/pages/work/State.vue')
    },
    {
        path: '/work/report',
        name: 'Report',
        component: () => import('@/views/pages/work/Report.vue')
    },
]