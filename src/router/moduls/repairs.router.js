export default [
  // 首页
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/repairs/register/Index')
  },
  {
    path: '/repairs',
    name: 'repairs',
    component: () => import('@/views/repairs/Index')
  },
  // 没有租约
  {
    path: '/unRegistered',
    name: 'unRegistered',
    component: () => import('@/views/repairs/unRegistered')
  },
  // 工单性情
  {
    path: '/orderDetails',
    name: 'orderDetails',
    component: () => import('@/views/repairs/orderDetails')
  },
  // 费用详情
  {
    path: '/costList',
    name: 'costList',
    component: () => import('@/views/repairs/costList')
  },
  // 评价
  {
    path: '/order/evaluate',
    name: 'evaluate',
    component: () => import('@/views/repairs/appraise/index')
  },
  // 投诉
  {
    path: '/order/complaint',
    name: 'complaint',
    component: () => import('@/views/repairs/complaint')
  }
];
