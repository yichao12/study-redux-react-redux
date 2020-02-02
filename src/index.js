import React from 'react'
import ReactDOM from 'react-dom'
// import { createStore, applyMiddleware, compose} from 'redux'
// import { Provider } from 'react-redux';
// import thunk from 'redux-thunk'
// 以下两行为手动实现的redux和react-redux
import { createStore,applyMiddleware } from './hand-redux'
import { Provider } from './hand-react-redux';

import { counter } from './index.redux'
import thunk from './hand-redux-thunk'
import arrThunk from './hand-redux-array'
import App from './App'
import './only-redux.js'

const store = createStore(counter,applyMiddleware(thunk,arrThunk))
ReactDOM.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  document.getElementById('root'))

// const store = createStore(counter, compose(
//   applyMiddleware(thunk),
//   window.devToolsExtension ? window.devToolsExtension() : f => f
// ))
// ReactDOM.render(
//   (
//     <Provider store={store}>
//       <App />
//     </Provider>
//   ),
//   document.getElementById('root'))


