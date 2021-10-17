import React from 'react'
import { BrowserRouter, NavLink } from 'react-router-dom'

import { RouterView, Loading } from './components'

import { routes } from './routes'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <p>Plop Demo</p>
          <p>
            {routes.map((item) => (
              <NavLink className="App-link" to={item.path} key={item.path}>
                {item.path}
              </NavLink>
            ))}
          </p>
        </header>
        <main className="App-main">
          <RouterView routes={routes} />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
