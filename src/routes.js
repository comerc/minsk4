import Layout from 'src/components/Layout'
import HomePage from 'src/components/HomePage'
import AboutPage from 'src/components/AboutPage'
import PostPage from 'src/components/PostPage'

const routes = [
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
        component: PostLayout,
        // routes: [
        //   {
        //     path: '/post/new',
        //     exact: true,
        //     component: NewPostPage,
        //   },
        //   {
        //     path: '/post/:id',
        //     exact: true,
        //     component: PostPage,
        //   },
        //   {
        //     path: '/post/:id/edit',
        //     exact: true,
        //     component: EditPostPage,
        //   },
        // ],
      },
    ],
  },
]

export default routes
