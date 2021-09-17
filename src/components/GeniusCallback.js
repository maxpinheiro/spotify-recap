import React from 'react';
import spotifyService from '../services/SpotifyService';
import { Link } from 'react-router-dom';
import {LoadingMessage} from "./Home";

const queryString = require('query-string');


class GeniusCallback extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: "loading",
            spotifyAccessToken: undefined,
            spotifyRefreshToken: undefined,
            spotifyExpiresIn: undefined,
            geniusAccessToken: undefined,
            local: undefined,
        };
    }

    componentDidMount() {
        // logic: just came from genius authorization, next get tokens and redirect to player
        // genius redirects to /callback#access_token=...&state=...
        const {access_token, state} = queryString.parse(this.props.location.hash);
        if (access_token && state) setTimeout(() => this.getTokens(state, access_token), 1000);
    }

    getTokens(spotifyCode, geniusToken) {
        const local = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "";
        spotifyService.getTokens(spotifyCode, local).then(data => {
            if (data.success) {
                this.setState({status: "success", spotifyAccessToken: data.accessToken, spotifyRefreshToken: data.refreshToken, spotifyExpiresIn: data.expiresIn, geniusAccessToken: geniusToken, local});
            } else {
                this.setState({status: "error", message: data.errorMessage});
            }
        }).catch(e => {
            this.setState({status: "error", message: e});
        });
    }

    render() {
        return (
            <div className="container mx-auto my-3 text-center">
                <div style={{height: "30vh"}} />
                {
                    this.state.status === "loading" && LoadingMessage("Logging you in...")
                }
                {
                    this.state.status === "success" &&
                    <div className="flex flex-col">
                        <Link to={`/spotify-lyrics/player?spotifyAccessToken=${this.state.spotifyAccessToken}&spotifyRefreshToken=${this.state.spotifyRefreshToken}&spotifyExpiresIn=${this.state.spotifyExpiresIn}&geniusAccessToken=${this.state.geniusAccessToken}&startTimeMs=${Date.now()}`}
                              className="rounded bg-green-200 border-green-800 text-green-800 p-3 mb-3">Continue to Player</Link>
                        {
                            this.state.local && <Link to={`/spotify-lyrics/visualizer?spotifyAccessToken=${this.state.spotifyAccessToken}&spotifyRefreshToken=${this.state.spotifyRefreshToken}&spotifyExpiresIn=${this.state.spotifyExpiresIn}&startTimeMs=${Date.now()}`}
                                                      className="rounded bg-green-800 border-green-200 text-green-200 p-3 mb-3">(In Production) Visualizer</Link>
                        }
                    </div>
                }
                {
                    this.state.status === "error" &&
                    <span>
                        <p className="mb-3">There was an issue logging in{this.state.message && `: ${this.state.message}`}. Please login again through the home page.</p>
                        <div className="flex">
                            <Link to="/spotify-lyrics/" className="rounded bg-green-400 p-3 mx-auto">Home page</Link>
                        </div>
                    </span>
                }
            </div>
        );
    }
}

export default GeniusCallback;
