export default [
  // 健康打卡登录
  {
    path: '/wxsurvey/login',
    name: 'wxLogin',
    component: () => import('@/views/wxsurvey/enter/Login')
  },
  // 无匹配租约
  {
    path: '/wxsurvey/NoLease',
    name: 'wxNoLease',
    component: () => import('@/views/wxsurvey/enter/NoLease')
  },
  // 开始填写表单
  {
    path: '/wxsurvey/sign',
    name: 'wxSign',
    component: () => import('@/views/wxsurvey/formmsg/Default')
  },
  // 打卡列表
  {
    path: '/wxsurvey/fitnessList',
    name: 'wxFitnessList',
    component: () => import('@/views/wxsurvey/formmsg/FitnessList')
  }
]
;
