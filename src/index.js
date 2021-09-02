import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './index.css';
import Home from "./components/Home";
import Player from "./components/Player";
import SpotifyCallback from "./components/SpotifyCallback";
import GeniusCallback from "./components/GeniusCallback";

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <Switch>
            <Route path="/spotifycallback" component={SpotifyCallback} />
            <Route path="/geniuscallback" component={GeniusCallback} />
            <Route path="/player" component={Player} />
            <Route exact path="/" component={Home} />
        </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
