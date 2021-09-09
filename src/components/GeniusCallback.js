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
            spotify_access_token: undefined,
            spotify_refresh_token: undefined,
            spotify_expires_in: undefined,
            genius_access_token: undefined
        };
    }

    componentDidMount() {
        // logic: just came from genius authorization, next get tokens and redirect to player
        // genius redirects to /callback#access_token=...&state=...
        const {access_token, state} = queryString.parse(this.props.location.hash);
        if (access_token && state) setTimeout(() => this.getTokens(state, access_token), 1000);
    }

    async getTokens(spotify_code, genius_token) {
        spotifyService.getTokens(spotify_code).then(spotifyData => {
            if (spotifyData.access_token) {
                this.setState({status: "success", spotify_access_token: spotifyData.access_token, spotify_refresh_token: spotifyData.refresh_token, spotify_expires_in: spotifyData.expires_in, genius_access_token: genius_token});
            } else if (spotifyData.error) {
                this.setState({status: "error", message: spotifyData.error_description});
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
                    <div>
                        <Link to={`/player?spotify_access_token=${this.state.spotify_access_token}&spotify_refresh_token=${this.state.spotify_refresh_token}&spotify_expires_in=${this.state.spotify_expires_in}&genius_access_token=${this.state.genius_access_token}&startTimeMs=${Date.now()}`}
                              className="rounded bg-green-400 p-3">Continue to Player</Link>
                    </div>
                }
                {
                    this.state.status === "error" &&
                    <span>
                        <p className="mb-3">There was an issue logging in{this.state.message && `: ${this.state.message}`}. Please login again through the home page.</p>
                        <div className="flex">
                            <Link to="/" className="rounded bg-green-400 p-3 mx-auto">Home page</Link>
                        </div>
                    </span>
                }
            </div>
        );
    }
}

export default GeniusCallback;
