export default [{
    path: '/seller/order',
    name: 'order',
    component: () => import('@/views/pages/sales/saleorder.vue')
},
  {
    path: '/seller/deliverymanage',
    name: 'deliverymanage',
    component: () => import('@/views/pages/sales/saledeliverymanage.vue')
  },
  {
    path: '/seller/finishstore',
    name: 'finishstore',
    component: () => import('@/views/pages/sales/salefinishstore.vue')
  },
  {
    path: '/seller/return',
    name: 'return',
    component: () => import('@/views/pages/sales/salereturn.vue')
  },
]