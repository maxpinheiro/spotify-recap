import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import './index.css';
import Home from "./components/Home";
import LyricPlayer from "./components/LyricPlayer";
import VisualizerContainer from "./components/VisualizerContainer";
import SpotifyCallback from "./components/SpotifyCallback";
import GeniusCallback from "./components/GeniusCallback";

console.log(`public url: ${process.env.PUBLIC_URL}`);
ReactDOM.render(
  <React.StrictMode>
    <Router basename="">
        <Link to='/spotify-lyrics'><p className="text-green-400 m-3">Home</p></Link>
        <Switch>
            <Route path={[process.env.PUBLIC_URL + "/spotify-lyrics/spotifycallback", process.env.PUBLIC_URL + "/spotifycallback"]} component={SpotifyCallback} />
            <Route path={[process.env.PUBLIC_URL + "/spotify-lyrics/geniuscallback", process.env.PUBLIC_URL + "/geniuscallback"]} component={GeniusCallback} />
            <Route path={[process.env.PUBLIC_URL + "/spotify-lyrics/player", process.env.PUBLIC_URL + "/player"]} component={LyricPlayer} />
            <Route path={[process.env.PUBLIC_URL + "/spotify-lyrics/visualizer", process.env.PUBLIC_URL + "/visualizer"]} component={VisualizerContainer} />
            <Route exact path={process.env.PUBLIC_URL + "/spotify-lyrics/"} component={Home} />
            <Route exact path={process.env.PUBLIC_URL + "/"} component={Home} />
        </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
