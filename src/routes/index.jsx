import { lazy } from 'react'

/**
 * 请勿删除 plop add 注释
 **/

export const routes = [
  /* plop add */
  {
    path: '/home',
    component: lazy(() => import(`../pages/home/index.jsx`)),
    exact: true
  }
]
