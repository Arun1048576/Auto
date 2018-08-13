import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import App from './app'
import { reducerCreator }   from './reducerCreator'

import reducers from './reducers'

const reducerEnhancer = (typeof window != 'undefined' && window.devToolsExtension)? window.devToolsExtension() : (f => f)
const initialReducer = reducerCreator({}, reducers)

function onLoad () {
  const store = createStore(initialReducer, {}, reducerEnhancer)

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById('main-content')
  )
}

window.onload = onLoad