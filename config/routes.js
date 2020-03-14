export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/dashboard',
          },
          {
            path: '/dashboard',
            name: 'dashboard',
            component: './Dashboard',
          },
          {
            path: '/screen',
            name: 'screen',
            component: './Screen',
          },
          {
            path: '/hostgroup',
            name: 'hostgroup',
            component: './HostGroup',
          },
          {
            path: '/template',
            name: 'template',
            component: './Template',
          },
          {
            path: '/expression',
            name: 'expression',
            component: './Expression',
          },
          {
            path: '/nodata',
            name: 'nodata',
            component: './NoData',
          },
          {
            path: '/alarm',
            name: 'alarm',
            component: './Alarm',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
]
