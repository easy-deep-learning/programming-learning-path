import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import reducer from './reducers'
import createLoguxCreator from '@logux/redux/create-logux-creator'
import badge from '@logux/client/badge'
import badgeStyles from '@logux/client/badge/default'
import badgeMessages from '@logux/client/badge/en'
import log from '@logux/client/log'

const createStore = createLoguxCreator({
  subprotocol: '1.0.0',
  server: process.env.NODE_ENV === 'development'
          ? 'ws://localhost:31337'
          : 'wss://logux.example.com',
  userId: false,  // TODO: We will fill it in next chapter
  credentials: '', // TODO: We will fill it in next chapter
})

window.__REDUX_DEVTOOLS_EXTENSION__ = window.__REDUX_DEVTOOLS_EXTENSION__ || (() => {})

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__())
badge(store.client, { messages: badgeMessages, styles: badgeStyles })
log(store.client)

console.log("store.client.nodeId: ", store.client.nodeId); // eslint-disable-line

ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
