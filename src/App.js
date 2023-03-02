import React from 'react'
// import routes from './router/IndexRouter'
// import routes from './components/sandbox/NewsRouter'
// import { useRoutes } from 'react-router-dom'
import IndexRouter from './router/IndexRouter'
import { Provider } from 'react-redux'
import {store,persistor} from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'

export default function App() {
  // const element=useRoutes(routes)
  return (
    <div>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter/>
      </PersistGate>
      </Provider>
    </div>
  )
}
