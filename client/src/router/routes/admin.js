export default[
  {
      path: '/admin/bom',
      name: 'Bom',
      component: () => import('@/views/pages/qual/Bom.vue')
  },
  {
    path: '/admin/processflow',
    name: 'processflow',
    component: () => import('@/views/pages/qual/ProcessFlow.vue')
  },
  {
    path: '/admin/employees',
    name: 'employees',
    component: () => import('@/views/pages/qual/Employees.vue')
  },
  {
    path: '/admin/company',
    name: 'company',
    component: () => import('@/views/pages/qual/Company.vue')
  },
]