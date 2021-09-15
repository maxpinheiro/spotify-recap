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
    songs: [{name: undefined, artist: undefined, spotifyId: undefined, imageUrl: undefined}],
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
    }
};

class VisualizerContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;

        this.searchSong = this.searchSong.bind(this);
        this.selectSong = this.selectSong.bind(this);
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
                }
            })
    }

    selectSong(spotifyId) {
        console.log(spotifyId);
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
            </div>
        )
    }
}

export default VisualizerContainer;
