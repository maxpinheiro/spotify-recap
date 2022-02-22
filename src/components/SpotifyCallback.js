import React from 'react';
//import { Link } from 'react-router-dom';
import {LoadingMessage} from "./Home";
import spotifyService from '../services/SpotifyService';

const queryString = require('query-string');


class SpotifyCallback extends React.Component {

    constructor(props) {
        super(props);
        this.state = {status: "loading", error: undefined, local: undefined};
    }

    componentDidMount() {
        // spotify redirects to /callback?code=... or /callback?error=...
        const {code, error} = queryString.parse(this.props.location.search);
        if (code) {
            setTimeout(() => this.getTokens(code), 1000);
        } else if (error) {
            this.setState({status: "error", error: error});
        }
    }

    getTokens(spotifyCode) {
        const local = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "";
        spotifyService.getTokens(spotifyCode, local).then(data => {
            if (data.success) {
                this.setState({status: "success", spotifyAccessToken: data.accessToken, spotifyRefreshToken: data.refreshToken, spotifyExpiresIn: data.expiresIn, local});
            } else {
                this.setState({status: "error", message: data.errorMessage});
            }
        }).catch(e => {
            this.setState({status: "error", message: e});
        });
    }


    render() {
        return (
            <div className="container mx-auto my-3 text-center text-josephin">
                <div style={{height: "30vh"}} />
                {
                    this.state.status === "loading" && LoadingMessage("Logging you in...", "#15d61c", "text-white")
                }
                {
                    this.state.status === "success" &&
                    <div className="">
                        <a href={`/#/recap?accessToken=${this.state.spotifyAccessToken}&refreshToken=${this.state.spotifyRefreshToken}&expiresIn=${this.state.spotifyExpiresIn}&startTimeMs=${Date.now()}`}
                              className="rounded-lg p-4 bg-spotify-green text-xl text-josephin text-white mx-auto">Continue to Recap</a>
                              
                    </div>
                }
                {
                    this.state.status === "error" &&
                    <span>
                        <p className="mb-3 mx-2 text-white">There was an issue logging in{this.state.message && `: ${this.state.message}`}. Please login again through the home page.</p>
                        <div className="flex">
                            <a href="/" className="rounded bg-spotify-green text-white p-3 mx-auto">Home page</a>
                        </div>
                    </span>
                }
                <div style={{height: "50vh"}} />
            </div>
        );
    }
}

export default SpotifyCallback;
