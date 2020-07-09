import Vue from 'vue';
import Router from 'vue-router';
import healthRecord from './moduls/wxCard.router';
import repairs from './moduls/repairs.router';
Vue.use(Router);
// console.log(process.env.BASE_URL);
export default new Router({
  mode: 'hash',
  // base: 'maintain',
  // base: 'sale',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/repairs/Index')
    },
    ...repairs,
    ...healthRecord

  ]
});
