export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/login',
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
            path: '/account/profile',
            component: './user/detail',
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
            routes:[
              {path: '/alarm', component: './Alarm'},
              {path: '/alarm/:caseId', component: './Alarm/Detail'},
            ],
          },
          {
            path: '/team',
            name: 'team',
            authority: ['admin'],
            component: './Team',
          },
          {
            path: '/user',
            name: 'user',
            authority: ['admin'],
            component: './user',
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
