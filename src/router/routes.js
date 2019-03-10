// import index from '@/pages/PgIndex'
// import userZone from '@/pages/PgUserZone';

//  路由懒加载
const index = () => import("@/pages/PgIndex");
const userZone = () => import("@/pages/PgUserZone");
const indexRadio = () => import("@/pages/PgRadio");
const indexMusic = () => import("@/pages/PgIntro");
const colList = () => import("@/pages/PgColList");
const login = () => import("@/pages/PgLogin");
const routes = [
  {
    path: "/",
    redirect: "/index"
  },
  {
    path: "/index",
    component: index,
    redirect: "/index/music",
    children: [
      {
        name: "indexMusic",
        path: "music",
        component: indexMusic,
        // children: [
        //   {
        //     name: "colList",
        //     path: "col/:col",
        //     props: true,
        //     component: colList
        //   }
        // ]
      },
      {
        name: "indexRadio",
        path: "radio",
        component: indexRadio
      }
    ]
  },
  {
    path: "/userzone",
    name: "userZone",
    component: userZone,
  },
  {
    path: "/login",
    name: "login",
    components: {
      // default: index,
      loginView: login
    }
  },
  {
    path: "/col/:col",
    name: "colList",
    props: true,
    components: {
      colView: colList
    }
  }
];
export default routes;
