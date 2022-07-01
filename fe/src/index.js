import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import myReducer from './reducers/index'
import { Provider } from 'react-redux'

const store = createStore(
  myReducer,
  composeWithDevTools(
    applyMiddleware()
  )
);
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>

      <App />
    </Provider>,
  </React.StrictMode>,
  document.getElementById('root')
);

