import React from 'react';
import spotifyService from "../services/SpotifyService";
import geniusService from "../services/GeniusService";
import musixMatchService from "../services/MusixMatchService";

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
            song: undefined
        };
    }

    componentDidMount() {
        // logic: detect current playback, fetch lyrics for song, display info to page
        // extra: use song features for more specific rendering (background? font? color?)
        const {spotify_access_token, spotify_refresh_token, spotify_expires_in, genius_access_token} = queryString.parse(this.props.location.search);
        //console.log({spotify_access_token, spotify_refresh_token, spotify_expires_in, genius_access_token});
        if (spotify_access_token && genius_access_token) {
            this.findCurrentSong(spotify_access_token, genius_access_token);
        }

    }

    findCurrentSong(spotify_access_token, genius_access_token) {
        spotifyService.getCurrentTrack(spotify_access_token)
            .then(data => {
                //console.log(data);
                if (data.item && data.item.name && data.item.artists && data.item.artists[0].name) {
                    const title = data.item.name;
                    const artist = data.item.artists[0].name;
                    //this.findLyricsGenius(song, artist, genius_access_token);
                    geniusService.getSongArtist(title, artist)
                        .then(song => {
                            this.setState({
                                status: "success",
                                song: {
                                    title,
                                    artist,
                                    albumArtURL: song.albumArtURL,
                                    lyrics: song.lyrics
                                }
                            });
                        }).catch(e => {})
                }
            }).catch(e => {})
    }

    findLyricsGenius(song, artist, genius_access_token) {
        geniusService.searchSong(song, artist, genius_access_token)
            .then(result => {
                //console.log(result);
                if (result && result.response && result.response.hits) {
                    const song_id = result.response.hits[0].result.id;
                    geniusService.getSong(song_id, genius_access_token)
                        .then(res => {
                            console.log(res);
                            if (res && res.response && res.response.song) {
                                const path = res.response.song.path;
                                const fullTitle = res.response.song.full_title;
                                geniusService.scrapeSongLyrics(path)
                                    .then(d => console.log(d.body))
                            }
                        }).catch(e => {

                    })
                }
            }).catch(e => {})
    }

    findLyricsMusixMatch(song, artist) {
        musixMatchService.searchTrack(song, artist)
            .then(result => {
                //console.log(result);
                if (result && result.message && result.message.body && result.message.body.track_list) {
                    const track = result.message.body.track_list[0].track;
                    const track_id = track.track_id;
                    musixMatchService.getLyricsForTrack(track_id)
                        .then(res => {
                            console.log(res);
                            if (res && res.message && res.message.body && res.message.body.lyrics) {
                                const lyrics = res.message.body.lyrics.lyrics_body;
                                this.setState({
                                    status: "success",
                                    song: {
                                        title: song,
                                        artist,
                                        lyrics
                                    }
                                })
                            }
                        }).catch(e => {})
                }
            }).catch(e => {})
    }


    render() {
        return (
            <div>
                {this.state.song &&
                <div>
                    <span>{this.state.song.title} by {this.state.song.artist}</span>
                    <img src={this.state.song.albumArtURL} alt="" />
                    <pre>{this.state.song.lyrics}</pre>
                </div>
                }

            </div>
        )
    }
}

export default Player;
