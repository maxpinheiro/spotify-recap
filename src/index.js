import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import './index.css';
import Home from "./components/Home";
import RecapContainer from "./components/Recapper";
import SpotifyCallback from "./components/SpotifyCallback";
import FallbackHandler from "./components/FallbackHandler";

ReactDOM.render(
  <React.StrictMode>
      <div className="">
          <Router>
              <div className="flex flex-row">
                  <a href='/'><p className="text-white m-3">Home</p></a>
              </div>
              <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/callback" component={SpotifyCallback} />
                  <Route path="/recap" component={RecapContainer} />
                  <Route component={FallbackHandler} />
              </Switch>
          </Router>
      </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
