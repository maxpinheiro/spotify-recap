import React from 'react';
import spotifyService from "../services/SpotifyService";
import { LoadingMessage } from './Home';
import RecapInfo from './RecapInfo';

const queryString = require('query-string');

const initialState = {
    status: "loading",
    accessToken: undefined,
    refreshToken: undefined,
    expiresIn: undefined,
    startTimeMs: undefined,
    
};

class RecapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;

        this.refreshPlayer = this.refreshPlayer.bind(this);
    }

    componentDidMount() {
        // logic: detect current playback, fetch lyrics for song, display info to page
        // extra: use song features for more specific rendering (background? font? color?)
        const {accessToken, refreshToken, expiresIn, startTimeMs} = queryString.parse(this.props.location.search);

        if (accessToken) {
            this.setState(prevState => ({...prevState, accessToken, refreshToken, expiresIn, startTimeMs}));
            if (((Date.now() - startTimeMs) / 1000) >= expiresIn) {
                this.refreshPlayer(refreshToken);
            } else {
                console.log(accessToken)
                this.getTopItems(accessToken);
            }
        } else {
            this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {accessToken, refreshToken, expiresIn, startTimeMs} = queryString.parse(this.props.location.search);
        if (startTimeMs && startTimeMs !== prevState.startTimeMs) this.setState(prevState => ({...prevState, accessToken, refreshToken, expiresIn, startTimeMs}));
    }


    refreshPlayer() {
        // reset background style
        if (document.body.style.backdropFilter === 'blur(5px)') {
            document.body.style.backgroundImage = '';
            document.body.style.backdropFilter = '';
            document.body.classList.add('bg-white');
        }
        this.setState(prevState => ({...prevState, status: "loading"}));
        const timeSinceStart = (Date.now() - this.state.startTimeMs) / 1000;
        const timeLeft = Math.ceil(this.state.expiresIn - timeSinceStart);
        console.log(`Time left: ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s | Expired: ${timeLeft <= 0}`);
        if (timeLeft <= 0) {
            this.refreshToken(this.state.spotifyRefreshToken);
        } else {
            
        }
    }

    refreshToken(refresh_token) {
        spotifyService.refreshTokens(refresh_token)
            .then(data => {
                if (data.success) {
                    const spotifyAccessToken = data.accessToken;
                    const spotifyExpiresIn = data.expiresIn;
                    this.setState(prevState => ({...prevState, spotifyAccessToken, spotifyExpiresIn}));
                    this.props.history.push(`/player?spotifyAccessToken=${spotifyAccessToken}&spotifyRefreshToken=${this.state.spotifyRefreshToken}&spotifyExpiresIn=${spotifyExpiresIn}&startTimeMs=${Date.now()}`)
                    this.findCurrentSong(spotifyAccessToken);
                } else {
                    this.setState({status: "error", message: `The recapper failed to load: ${data.errorMessage || "idk why"}. Please refresh the page, or redirect to the home page to restart the authorization flow.`})
                }
            }).catch(e => {this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})})
    }

    getTopItems(accessToken, type="artists", timespan="medium_term") {
        spotifyService.getTopItems(accessToken, type, timespan)
            .then(data => {
                if (data.success) {
                    this.setState(prevState => ({...prevState, status: "success", items: data.items}));
                } else {
                    this.setState({status: "error", message: `The recapper failed to load: ${data.errorMessage || "idk why"}. Please refresh the page, or redirect to the home page to restart the authorization flow.`})
                }
            })
        
    }

    render() {
        return (
            <div className="container mx-auto text-center my-3 text-josephin">
                {
                    this.state.status === "loading" && <div><div style={{height: "30vh"}} />{LoadingMessage("Collecting your listening history...", "#15d61c", "text-white")}</div>
                }
                {
                    this.state.status === "success" && <RecapInfo items={this.state.items} type="artists" />
                }
                {
                    this.state.status === "error" &&
                    <span>
                        <p className="mb-3 mx-2 text-white">There was an issue collecting data{this.state.message && `: ${this.state.message}`}. Please login again through the home page.</p>
                        <div className="flex">
                            <a href="/" className="rounded bg-spotify-green text-white p-3 mx-auto">Home page</a>
                        </div>
                    </span>
                }
            </div>
        )
    }
}

export default RecapContainer;
