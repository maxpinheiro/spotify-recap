import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from "./components/Home";
import Player from "./components/Player";
import Callback from "./components/Callback";

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <Switch>
            <Route path="/callback" component={Callback} />
            <Route path="/play/:playerId" component={Player} />
            <Route exact path="/" component={Home} />
        </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
