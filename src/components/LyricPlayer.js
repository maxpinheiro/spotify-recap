import React from 'react';
import spotifyService from "../services/SpotifyService";
import geniusService from "../services/GeniusService";
import {LoadingMessage} from "./Home";
import InfoDisplay from "./InfoDisplay";

const queryString = require('query-string');

const initialState = {
    status: "loading",
    spotifyAccessToken: undefined,
    spotifyRefreshToken: undefined,
    spotifyExpiresIn: undefined,
    geniusAccessToken: undefined,
    startTimeMs: undefined,
    song: {
        title: undefined,
        artist: undefined,
        albumArtUrl: undefined,
        lyrics: undefined
    },
    audioFeatures: {
        danceability: undefined,
        energy: undefined,
        key: undefined,
        loudness: undefined,
        mode:  undefined,
        speechiness: undefined,
        acousticness: undefined,
        instrumentalness: undefined,
        liveness: undefined,
        valence: undefined,
        tempo: undefined,
        type: undefined,
        duration_ms: undefined,
        time_signature: undefined
    },
    description: undefined,
    geniusUrl: undefined
};

class LyricPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;

        this.refreshPlayer = this.refreshPlayer.bind(this);
    }

    componentDidMount() {
        // logic: detect current playback, fetch lyrics for song, display info to page
        // extra: use song features for more specific rendering (background? font? color?)
        const {spotifyAccessToken, spotifyRefreshToken, spotifyExpiresIn, geniusAccessToken, startTimeMs} = queryString.parse(this.props.location.search);
        //console.log({spotifyAccessToken, spotifyRefreshToken, spotifyExpiresIn, geniusAccessToken});
        if (spotifyAccessToken && geniusAccessToken) {
            this.setState(prevState => ({...prevState, spotifyAccessToken, spotifyRefreshToken, spotifyExpiresIn, geniusAccessToken, startTimeMs}));
            if (((Date.now() - startTimeMs) / 1000) >= spotifyExpiresIn) {
                this.refreshPlayer(spotifyRefreshToken);
            } else {
                this.findCurrentSong(spotifyAccessToken, geniusAccessToken);
            }
        } else {
            this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})
        }
    }

    findCurrentSong(spotifyAccessToken, geniusAccessToken) {
        spotifyService.getCurrentTrack(spotifyAccessToken)
            .then(data => {
                if (data.success) {
                    this.findLyrics(data.song, data.artist, data.spotifyId, data.albumArtUrl, geniusAccessToken, spotifyAccessToken);
                } else {
                    if (data.playing === false) {
                        this.setState({status: "error", message: "No track is currently playing. Please play a track and refresh the page for the lyric player to work."});
                    } else if (data.error) {
                        this.setState({status: "error", message: `There was an error loading the player: ${data.error.message}. Try refreshing the page or redirecting to the home page.`});
                    } else {
                        this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})
                    }
                }
            }).catch(e => {this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})})
    }

    findLyrics(song, artist, spotifyId, albumArtUrl, geniusAccessToken, spotifyAccessToken) {
        geniusService.getSongLyricsAPI(song, artist, geniusAccessToken)
            .then(data => {
                if (data.success) {
                    this.setState(prevState => ({...prevState, song: {title: song, artist, albumArtUrl, lyrics: data.lyrics}}));
                    this.getSpotifyFeatures(spotifyId, song, artist, spotifyAccessToken, geniusAccessToken);
                } else {
                    this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})
                }
            }).catch(e => {this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})})
    }

    getSpotifyFeatures(spotifyId, song, artist, spotifyAccessToken, geniusAccessToken) {
        spotifyService.getAudioFeatures(spotifyId, spotifyAccessToken)
            .then(data => {
                if (data.success) {
                    this.setState(prevState => ({...prevState, audioFeatures: data.audioFeatures }));
                    this.getGeniusData(song, artist, geniusAccessToken);
                } else {
                    this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})
                }
            }).catch(e => {this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})})
    }

    getGeniusData(song, artist, genius_access_code) {
        geniusService.searchSong(song, artist, genius_access_code)
            .then(res => {
                if (res.response && res.response.hits) {
                    const songData = res.response.hits.find(d => d.result.title.toLowerCase().includes(song.toLowerCase())) || res.response.hits[0];
                    //alert(song, songData);
                    if (!songData) {this.setState({status: "error", message: "The player could not find this song. Please refresh the page, or redirect to the home page to restart the authorization flow."}); return;}
                    const songId = songData.result.id;
                    geniusService.getSongDetails(songId, genius_access_code)
                        .then(data => {
                            if (data.response && data.response.song) {
                                this.setState(prevState => ({
                                    ...prevState,
                                    status: "success",
                                    description: data.response.song.description.plain,
                                    geniusUrl: data.response.song.url
                                }));
                            }
                        }).catch(e => {this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})})
                }
            }).catch(e => {this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})})
    }

    secondsLeft(startTimeMs, expireTimeMs) {
        const timeSinceStart = (Date.now() - startTimeMs) / 1000;
        return Math.ceil(expireTimeMs - timeSinceStart);
    }

    refreshPlayer() {
        this.setState(prevState => ({...prevState, status: "loading"}));
        const timeSinceStart = (Date.now() - this.state.startTimeMs) / 1000;
        const timeLeft = Math.ceil(this.state.spotifyExpiresIn - timeSinceStart);
        console.log(`Time left: ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s | Expired: ${timeLeft <= 0}`);
        if (timeLeft <= 0) {
            this.refreshToken(this.state.spotifyRefreshToken);
        } else {
            this.findCurrentSong(this.state.spotifyAccessToken, this.state.geniusAccessToken);
        }
    }

    refreshToken(refresh_token) {
        spotifyService.refreshTokens(refresh_token)
            .then(data => {
                if (data.success) {
                    const spotifyAccessToken = data.accessToken;
                    const spotifyExpiresIn = data.expiresIn;
                    this.setState(prevState => ({...prevState, spotifyAccessToken, spotifyExpiresIn}));
                    this.props.history.push(`/player?spotifyAccessToken=${spotifyAccessToken}&spotifyRefreshToken=${this.state.spotifyRefreshToken}&spotifyExpiresIn=${spotifyExpiresIn}&geniusAccessToken=${this.state.geniusAccessToken}&startTimeMs=${Date.now()}`)
                    this.findCurrentSong(spotifyAccessToken, this.state.geniusAccessToken);
                } else {
                    this.setState({status: "error", message: `The player failed to load: ${data.errorMessage || "idk why"}. Please refresh the page, or redirect to the home page to restart the authorization flow.`})
                }
            }).catch(e => {this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})})
    }

    render() {
        return (
            <div className="container mx-auto text-center my-3">
                {
                    this.state.status === "loading" && <div><div style={{height: "30vh"}}/>{LoadingMessage("Retrieving song info...")}</div>
                }
                {
                    this.state.status === "success" && this.state.song.title &&
                    <div>
                        <InfoDisplay title={this.state.song.title} artist={this.state.song.artist}
                                     albumArtUrl={this.state.song.albumArtUrl} lyrics={this.state.song.lyrics}
                                     audioFeatures={this.state.audioFeatures} description={this.state.description}
                                     geniusUrl={this.state.geniusUrl} refreshPlayer={this.refreshPlayer} />
                    </div>
                }
                {
                    this.state.status === "error" &&
                    <div>
                        <div style={{height: "30vh"}} />
                        <p>{this.state.message}</p>
                    </div>
                }

            </div>
        )
    }
}

export default LyricPlayer;
