import Layout from 'src/components/Layout'
import HomePage from 'src/components/HomePage'
import AboutPage from 'src/components/AboutPage'
import PostPage from 'src/components/PostPage'

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
      {
        path: '/post/:id',
        exact: true,
        component: PostPage,
      },
    ],
  },
]

export default routes
