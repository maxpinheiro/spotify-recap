import React from 'react';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {getTokens} from '../services/SpotifyService';
import { Link } from 'react-router-dom';

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
        //console.log(this.props.location)
        //console.log({access_token, state});
        if (access_token && state) setTimeout(() => this.getTokens(state, access_token), 1000);
    }

    async getTokens(spotify_code, genius_token) {
        getTokens(spotify_code).then(spotifyData => {
            if (spotifyData.access_token) {
                this.setState({status: "success", spotify_access_token: spotifyData.access_token, spotify_refresh_token: spotifyData.refresh_token, spotify_expires_in: spotifyData.expires_in, genius_access_token: genius_token});
            } else if (spotifyData.error) {
                this.setState({status: "error", message: spotifyData.error_description});
            }
        }).catch(e => {
            this.setState({status: "error", message: e});
        });

        /*Promise.all([getTokens(spotify_code), getAccessToken(genius_code)])
            .then(values => {
                console.log(values);
                const spotifyData = values[0];
                const geniusData = values[1];
                if (spotifyData.access_token && geniusData.access_token) {
                    this.setState({status: "success", spotify_access_token: spotifyData.access_token, spotify_refresh_token: spotifyData.refresh_token, spotify_expires_in: spotifyData.expires_in, genius_access_token: geniusData.access_token});
                } else if (spotifyData.error) {
                    this.setState({status: "error", message: spotifyData.error_description});
                }
            }).catch(e => {
            this.setState({status: "error", message: e});
        });*/
    }

    render() {
        return (
            <div>
                {
                    this.state.status === "loading" &&
                    <div>
                        <p>Logging you in...</p>
                        <Loader type="Oval" color="#15d61c" height={80} width={80}/>
                    </div>
                }
                {
                    this.state.status === "success" &&
                    <div>
                        <Link to={`/player?spotify_access_token=${this.state.spotify_access_token}&spotify_refresh_token=${this.state.spotify_refresh_token}&spotify_expires_in=${this.state.spotify_expires_in}&genius_access_token=${this.state.genius_access_token}`}>Continue to Player</Link>
                    </div>
                }
                {
                    this.state.status === "error" &&
                    <span>
                        <p>There was an issue logging in{this.state.message && `: ${this.state.message}`}. Please login again through the </p>
                        <Link to="/">Home page</Link>.
                    </span>
                }
            </div>
        );
    }
}

export default GeniusCallback;