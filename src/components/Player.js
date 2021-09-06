import React from 'react';
import {getCurrentTrack} from "../services/SpotifyService";
import {getLyricsForSong} from "../services/GeniusService";

const queryString = require('query-string');


class Player extends React.Component {

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
        // logic: detect current playback, fetch lyrics for song, display info to page
        // extra: use song features for more specific rendering (background? font? color?)
        const {spotify_access_token, spotify_refresh_token, spotify_expires_in, genius_access_token} = queryString.parse(this.props.location.search);
        //console.log({spotify_access_token, spotify_refresh_token, spotify_expires_in, genius_access_token});
        if (spotify_access_token && genius_access_token) {
            this.findCurrentLyrics(spotify_access_token, genius_access_token);
        }
    }

    findCurrentLyrics(spotify_access_token, genius_access_token) {
        getCurrentTrack(spotify_access_token)
            .then(data => {
                //console.log(data);
                if (data.item && data.item.name && data.item.artists && data.item.artists[0].name) {
                    const song = data.item.name;
                    const artist = data.item.artists[0].name;
                    getLyricsForSong(song, artist, genius_access_token)
                        .then(result => {
                            console.log(result);
                        }).catch(e => {})

                }
            }).catch(e => {})
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}

export default Player;
