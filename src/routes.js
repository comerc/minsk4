import Layout from 'src/components/Layout'
import HomePage from 'src/components/HomePage'
import AboutPage from 'src/components/AboutPage'
import PostLayout from 'src/components/PostLayout'
import PostPage from 'src/components/PostPage'
import EditPostPage from 'src/components/EditPostPage'
import EditorPage from 'src/components/EditorPage'
// import ReshadowPage from 'src/components/ReshadowPage'

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
        path: '/editor',
        exact: true,
        component: EditorPage,
      },
      // {
      //   path: '/reshadow',
      //   exact: true,
      //   component: ReshadowPage,
      // },
      {
        path: '/post/:id',
        component: PostLayout,
        routes: [
          // {
          //   path: '/post/new',
          //   exact: true,
          //   component: EditPostPage,
          // },
          {
            path: '/post/:id',
            exact: true,
            component: PostPage,
          },
          {
            path: '/post/:id/edit',
            exact: true,
            component: EditPostPage,
          },
        ],
      },
    ],
  },
]

export default routes
