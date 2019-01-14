import Layout from 'src/components/Layout'
import HomePage from 'src/components/HomePage'
import AboutPage from 'src/components/AboutPage'

const routes = [
  // {
  //   path: '/404',
  //   component: NotFound,
  // },
  {
    component: Layout,
    routes: [
      {
        path: '/',
        exact: true,
        component: HomePage,
      },
      {
        path: '/about',
        exact: true,
        component: AboutPage,
      },
    ],
  },
]

export default routes
