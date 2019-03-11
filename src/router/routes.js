// import index from '@/pages/PgIndex'
// import userZone from '@/pages/PgUserZone';

//  路由懒加载
const index = () => import("@/pages/PgIndex");
const userZone = () => import("@/pages/PgUserZone");
const indexMusic = () => import("@/pages/PgIntro");
const colList = () => import("@/pages/PgColList");
const login = () => import("@/pages/PgLogin");
const search = () => import("@/pages/PgSearch");

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
      },
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
      extraView: login
    }
  },
  {
    path: "/col/:col",
    name: "colList",
    props: true,
    components: {
      extraView: colList
    }
  },
  {
    path: "/search",
    name: "search",
    components: {
      searchView: search
    }
  }
];
export default routes;
