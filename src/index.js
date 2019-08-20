import React from "react";
import ReactDOM from "react-dom";
// import "./index.css";
import "./App.scss";
import HomePage from "./components/HomePage";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./reducer/rootReducer";
import * as serviceWorker from "./serviceWorker";

const store = createStore(rootReducer, applyMiddleware(thunk));

console.log("store", store.getState());

function App() {
  return (
    <div>
      <HomePage />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

serviceWorker.unregister();
