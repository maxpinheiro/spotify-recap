import React from 'react';
import spotifyService from "../services/SpotifyService";
import geniusService from "../services/GeniusService";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

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
        this.state = {
            status: "success",
            song: {
                title: "Sweet",
                artist: "Bren Joy",
                albumArtURL: "https://images.genius.com/82c0310b3a3ddb16230e3b93745106ca.1000x1000x1.jpg",
                lyrics: "[Chorus: Caleb Lee]\n" +
                    "I got you going so far\n" +
                    "Keep running away from me\n" +
                    "(Running away from me yeah)\n" +
                    "You said you know who you are\n" +
                    "You keep it so sweet\n" +
                    "\n" +
                    "[Refrain: Landon Sears]\n" +
                    "Are you recordin'? All right\n" +
                    "Okay welcome to your twenties twenties twenties twenties twenties babe\n" +
                    "Welcome to your twenties twenties twenties twenties twenties babe\n" +
                    "Welcome to your twenties twenties twenties twenties twenties babe\n" +
                    "Welcome to your twenties babe\n" +
                    "Welcome to your twenties babe\n" +
                    "Welcome to ya\n" +
                    "\n" +
                    "[Verse 1: Bren Joy]\n" +
                    "I'll admit it\n" +
                    "I been wanting you and I been\n" +
                    "Tryna kick it\n" +
                    "Watching every move if I could\n" +
                    "Get a minute\n" +
                    "I'll show you I'm the one to choose\n" +
                    "(Hit it then I flip it, love the way you get it)\n" +
                    "I been feeling\n" +
                    "You since the beginning you so\n" +
                    "Independent\n" +
                    "Always steady winning if I\n" +
                    "Get a minute\n" +
                    "I'll show you I'm the one for you\n" +
                    "(Hit it then I flip it, love the way you get it)\n" +
                    "Okay okay okay\n" +
                    "I'm honestly, tryna see\n" +
                    "If me and you could be a possibly, modesty\n" +
                    "Is what I’m 'bout but man I'm thrown up off the Hennessy\n" +
                    "So let me drown you in the Prada\n" +
                    "It would be an honor"
            }
        };
    }

    componentDidMount() {
        // logic: detect current playback, fetch lyrics for song, display info to page
        // extra: use song features for more specific rendering (background? font? color?)
        const {spotify_access_token, spotify_refresh_token, spotify_expires_in, genius_access_token} = queryString.parse(this.props.location.search);
        //console.log({spotify_access_token, spotify_refresh_token, spotify_expires_in, genius_access_token});
        if (spotify_access_token && genius_access_token) {
            //this.findCurrentSong(spotify_access_token, genius_access_token);
        }

    }

    findCurrentSong(spotify_access_token, genius_access_token) {
        spotifyService.getCurrentTrack(spotify_access_token)
            .then(data => {
                if (data.item && data.item.name && data.item.artists && data.item.artists[0].name) {
                    const song = data.item.name;
                    const artist = data.item.artists[0].name;
                    this.findLyrics(song, artist, genius_access_token);
                } else {
                    this.setState({status: "error", message: "No track is currently playing. Please play a track and refresh the page for the lyric player to work."});
                }
            }).catch(e => {})
    }

    findLyrics(song, artist, genius_access_token) {
        geniusService.getSongArtist(song, artist, genius_access_token)
            .then(songData => {
                if (songData.albumArt) {
                    this.setState({
                        status: "success",
                        song: {
                            title: song,
                            artist,
                            albumArtURL: songData.albumArt,
                            lyrics: songData.lyrics
                        }
                    });
                }
            }).catch(e => {})
        /*
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
         */
    }


    render() {
        return (
            <div className="container mx-auto">
                {
                    this.state.status === "loading" &&
                    <div>
                        <p>Logging you in...</p>
                        <Loader type="Oval" color="#15d61c" height={80} width={80}/>
                    </div>
                }
                {
                    this.state.status === "success" && this.state.song &&
                    <div className="font-sans">
                        <div className="flex justify-center items-end my-3">
                            <p className="text-xl font-medium">{this.state.song.title}</p>
                            <pre className="font-sans"> by </pre>
                            <p className="text-xl font-medium"> {this.state.song.artist}</p>
                        </div>
                        <img className="mx-auto my-3" src={this.state.song.albumArtURL} alt="" width="25%" height="25%"/>
                        <pre className="text-center font-sans my-3">{this.state.song.lyrics}</pre>
                    </div>
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
