import React from 'react';
import {Searcher, SearchResults} from "./Searcher";
import {LoadingMessage} from "./Home";
import spotifyService from "../services/SpotifyService";

const queryString = require('query-string');

const initialState = {
    status: "search",
    spotifyAccessToken: undefined,
    spotifyRefreshToken: undefined,
    spotifyExpiresIn: undefined,
    startTimeMs: undefined,
    songs: [{name: undefined, artist: undefined, spotifyId: undefined, spotifyUri: undefined, imageUrl: undefined}],
    beats: [{start: undefined, duration: undefined}],
    song: {
        title: undefined,
        artist: undefined,
        imageUrl: undefined,
        spotifyUri: undefined
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
    }
};

class VisualizerContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;

        this.searchSong = this.searchSong.bind(this);
        this.selectSong = this.selectSong.bind(this);
        this.getAudioAnalysis = this.getAudioAnalysis.bind(this);
        this.getAudioFeatures = this.getAudioFeatures.bind(this);
        this.startVisualizer = this.startVisualizer.bind(this);
    }

    componentDidMount() {
        const {spotifyAccessToken, spotifyRefreshToken, spotifyExpiresIn, startTimeMs} = queryString.parse(this.props.location.search);

        if (spotifyAccessToken) {
            this.setState(prevState => ({...prevState, spotifyAccessToken, spotifyRefreshToken, spotifyExpiresIn, startTimeMs}));

        } else {
            this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})
        }
    }

    searchSong(query) {
        this.setState(prevState => ({...prevState, status: "searching"}));
        spotifyService.searchSongs(query, this.state.spotifyAccessToken)
            .then(data => {
                if (data.success) {
                    this.setState(prevState => ({...prevState, status: "results", songs: data.songs}));
                } else {
                    this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})
                }
            })
    }

    selectSong(spotifyId, spotifyUri, title, artist, imageUrl) {
        this.setState(prevState => ({...prevState, status: "loading", song: {title, artist, imageUrl, spotifyUri}}));
        spotifyService.pausePlayback(this.state.spotifyAccessToken)
            .then(response => {
                if (response.success) {
                    this.getAudioAnalysis(spotifyId, this.state.spotifyAccessToken);
                } else if (response.message) {
                    this.setState({status: "error", message: `The player failed to load: ${response.message}. Please refresh the page, or redirect to the home page to restart the authorization flow.`})
                } else {
                    this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})
                }
            })
    }

    startVisualizer() {

    }

    getAudioAnalysis(spotifyId, spotifyAccessToken) {
        spotifyService.getAudioAnalysis(spotifyId, spotifyAccessToken)
            .then(data => {
                if (data.success) {
                    this.setState(prevState => ({...prevState, beats: data.beats }));
                    this.getAudioFeatures(spotifyId, spotifyAccessToken);
                } else {
                    this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})
                }
            }).catch(e => {this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})})
    }

    getAudioFeatures(spotifyId, spotifyAccessToken) {
        spotifyService.getAudioFeatures(spotifyId, spotifyAccessToken)
            .then(data => {
                if (data.success) {
                    this.setState(prevState => ({...prevState, status: "loaded", audioFeatures: data.audioFeatures }));
                } else {
                    this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})
                }
            }).catch(e => {this.setState({status: "error", message: "The player failed to load for an unknown reason. Please refresh the page, or redirect to the home page to restart the authorization flow."})})
    }

    render() {
        return (
            <div className="container mx-auto text-center my-3">
                {
                    this.state.status === "search" &&
                    <div>
                        <p>Begin by finding a song to play</p>
                        <Searcher searchSong={this.searchSong}/>
                    </div>
                }
                {
                    this.state.status === "searching" &&
                    <div><div style={{height: "30vh"}}/>{LoadingMessage("Searching...")}</div>
                }
                {
                    this.state.status === "results" &&
                    <div>
                        <Searcher searchSong={this.searchSong}/>
                        <p>Results: </p>
                        <SearchResults songs={this.state.songs} selectSong={this.selectSong} />
                    </div>
                }
                {
                    this.state.status === "loading" &&
                    <div>
                        <div style={{height: "30vh"}}/>
                        {LoadingMessage("Loading song...")}
                        <p>If you have a track playing on Spotify, the visualizer will pause it.</p>
                    </div>
                }
                {
                    this.state.status === "loaded" &&
                    <div>
                        <button onClick={this.startVisualizer}
                                className="rounded bg-green-800 border-green-200 text-green-200 p-3">
                            Start Visualizer
                        </button>
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

export default VisualizerContainer;
