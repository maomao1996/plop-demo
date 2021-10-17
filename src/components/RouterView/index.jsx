import React, { Suspense } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Loading } from '../'

const renderRedirectRoute = (route) => {
  return <Route {...route} key={route.path} render={() => <Redirect to={route.redirect} />} />
}

const renderRoute = (route) => {
  if (route.redirect) {
    return renderRedirectRoute(route)
  }
  const { component: Component, ...rest } = route
  return (
    <Route
      {...rest}
      key={route.path}
      render={(props) =>
        Component && (
          <Component {...props}>
            <RouterView routes={route.routes} />
          </Component>
        )
      }
    />
  )
}

const RouterView = ({ routes, fallback = <Loading />, ...switchProps }) => {
  if (!routes?.length) {
    return null
  }
  return (
    <Suspense fallback={fallback}>
      <Switch {...switchProps}>{routes.map((route) => renderRoute(route))}</Switch>
    </Suspense>
  )
}

export default RouterView
