import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./locale/i18n";
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import {createStore} from "redux";

const reducer = (state, action) => {
    if (action.type === "login-success") {
        const newState = {...state}
        newState.id = action.payload.id;
        newState.isLoggedIn = true;
        return newState;
    }
    console.log({state, action});
    return state;
};

const initialState = {
    isLoggedIn: false,
    id:''
};


const store = createStore(
    reducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Provider store={store}>
            <App />
        </Provider>
    </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
