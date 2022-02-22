import React from "react";
//import queryString from "querystring";
import { Redirect } from "react-router-dom";

//const buttonClass = "rounded-lg bg-spotify-green text-josephin text-lg text-white p-4";
class FallbackHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {spotifyCallback: false, code: null};
    }
    componentDidMount() {
        console.log(window.location);
        if (window.location.hash.includes('spotifycallback')) {
            this.setState({spotifyCallback: true, query: window.location.search});
        } /*else if (window.location.hash.includes('#/access_token')) {
            const {access_token, state} = queryString.parse(window.location.hash.substring(2));
            //const access_token = window.location.hash.substring(2).split('&')[0].substring(13) || '';
            console.log(`${access_token}, ${state}`);
            //this.props.history.push(`${window.location.hash.substring(1)}`);
            this.setState({geniusCallback: true, access_token, state});
        }*/
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        return (
            <div className="text-center">
                <div style={{height: "30vh"}} />
                {//this.state.spotifyCallback && <Link to={`/callback${window.location.search}`} className={buttonClass}>Confirm Spotify Authorization</Link>
                }
                { this.state.spotifyCallback && <Redirect to={`/callback${this.state.query}`} /> }
                <div style={{height: "70vh"}} />
            </div>
        )
    }
}

export default FallbackHandler;