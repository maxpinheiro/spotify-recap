import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import './index.css';
import Home from "./components/Home";
import LyricPlayer from "./components/LyricPlayer";
import VisualizerContainer from "./components/VisualizerContainer";
import SpotifyCallback from "./components/SpotifyCallback";
import GeniusCallback from "./components/GeniusCallback";

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <Link to='/'><p className="text-green-400 m-3">Home</p></Link>
        <Switch>
            <Route path="/spotify-lyrics/spotifycallback" component={SpotifyCallback} />
            <Route path="/spotify-lyrics/geniuscallback" component={GeniusCallback} />
            <Route path="/spotify-lyrics/player" component={LyricPlayer} />
            <Route path="/spotify-lyrics/visualizer" component={VisualizerContainer} />
            <Route exact path="/spotify-lyrics/" component={Home} />
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
