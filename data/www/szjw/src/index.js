import React from 'react'
import ReactDOM from 'react-dom'

import App from './pages/home/App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import reportWebVitals from './reportWebVitals'
// import { makeServer } from './api/server'

import './assets/styles/app.scss'
import 'normalize.css'

// if (process.env.NODE_ENV === 'development') {
//   makeServer({ environment: 'development' })
// }

// 获取 config.json 文件
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
