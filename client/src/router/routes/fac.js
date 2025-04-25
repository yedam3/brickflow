export default[
  {
      path: '/facs/enroll',
      name: 'Enroll',
      component: () => import('@/views/pages/facs/facEnroll.vue')
  },
  {
    path: '/facs/status',
    name: 'Status',
    component: () => import('@/views/pages/facs/facStatus.vue')
  },
  {
    path: '/facs/noplay',
    name: 'Noplay',
    component: () => import('@/views/pages/facs/facNoplay.vue')
  },
  {
    path: '/facs/repaire',
    name: 'Repaire',
    component: () => import('@/views/pages/facs/facRepaire.vue')
  },
  {
    path: '/facs/statistic',
    name: 'Statistic',
    component: () => import('@/views/pages/facs/facStatistic.vue')
  },
  {
    path: '/facs/inspection',
    name: 'Inspection',
    component: () => import('@/views/pages/facs/facInspection.vue')
  },
  {
    path: '/facs/repirList',
    name: 'RepirList',
    component: () => import('@/views/pages/facs/facRepirList.vue')
  },
  {
    path: '/facs/inspectList',
    name: 'InspectList',
    component: () => import('@/views/pages/facs/facInspectList.vue')
  },
]