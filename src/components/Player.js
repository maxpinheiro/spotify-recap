import React from 'react';
import spotifyService from "../services/SpotifyService";
import geniusService from "../services/GeniusService";
import {LoadingMessage} from "./Home";
import InfoDisplay from "./InfoDisplay";

const queryString = require('query-string');

class Player extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: "loading",
            spotify_access_token: undefined,
            spotify_refresh_token: undefined,
            spotify_expires_in: undefined,
            genius_access_token: undefined,
            song: {
                title: undefined,
                artist: undefined,
                albumArtUrl: undefined,
                lyrics: undefined
            },
        };
    }

    componentDidMount() {
        // logic: detect current playback, fetch lyrics for song, display info to page
        // extra: use song features for more specific rendering (background? font? color?)
        const {spotify_access_token, spotify_refresh_token, spotify_expires_in, genius_access_token} = queryString.parse(this.props.location.search);
        //console.log({spotify_access_token, spotify_refresh_token, spotify_expires_in, genius_access_token});
        if (spotify_access_token && genius_access_token) {
            this.findCurrentSong(spotify_access_token, genius_access_token)
                .then(_ => {

                });
        }
    }

    async findCurrentSong(spotify_access_token, genius_access_token) {
        spotifyService.getCurrentTrack(spotify_access_token)
            .then(data => {
                if (data.item && data.item.name && data.item.artists && data.item.artists[0].name) {
                    const song = data.item.name;
                    const artist = data.item.artists[0].name;
                    this.findLyrics(song, artist, genius_access_token);
                    return undefined;
                } else {
                    this.setState({status: "error", message: "No track is currently playing. Please play a track and refresh the page for the lyric player to work."});
                }
            }).catch(e => {})
    }

    async findLyrics(song, artist, genius_access_token) {
        geniusService.getSongArtist(song, artist, genius_access_token)
            .then(songData => {
                if (songData.albumArt) {
                    this.setState({
                        status: "success",
                        song: {
                            title: song,
                            artist,
                            albumArtUrl: songData.albumArt,
                            lyrics: songData.lyrics
                        }
                    });
                }
            }).catch(e => {})
    }

    render() {
        return (
            <div className="container mx-auto text-center my-3">
                {
                    this.state.status === "loading" && LoadingMessage("Retrieving song info...")
                }
                {
                    this.state.status === "success" && this.state.song.title &&
                    <InfoDisplay title={this.state.song.title} artist={this.state.song.artist} albumArtUrl={this.state.song.albumArtUrl} lyrics={this.state.song.lyrics} />
                }
                {
                    this.state.status === "error" &&
                    <p>{this.state.message}</p>
                }

            </div>
        )
    }
}

export default Player;
