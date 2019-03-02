// import index from '@/pages/PgIndex'
// import userZone from '@/pages/PgUserZone';

//  路由懒加载
const index = () => import('@/pages/PgIndex');
const userZone = () => import('@/pages/PgUserZone');
const indexRadio = () => import('@/pages/PgRadio');
const indexMusic = () => import('@/pages/PgIntro');

const routes = [
  {
    path: '/',
    redirect: '/index'  
  },
  {
    path: '/index',
    component: index,
    redirect: '/index/music',
    children: [
      {
        name: 'indexMusic',
        path: 'music',
        component: indexMusic
      },
      {
        name: 'indexRadio',
        path: 'radio',
        component: indexRadio
      }
    ]
  },
  {
    path: '/userzone',
    name: 'userZone',
    component: userZone
  },
];
export default routes;