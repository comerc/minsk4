import Layout from './components/Layout'
import HomePage from './components/HomePage'
import AboutPage from './components/AboutPage'
import PostPage from './components/PostPage'

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
