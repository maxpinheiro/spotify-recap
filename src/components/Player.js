import React from 'react';
import spotifyService from "../services/SpotifyService";
import geniusService from "../services/GeniusService";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {PhotoshopPicker} from "react-color";

const queryString = require('query-string');

const themeNames = ['light', 'dark', 'green'];
const bgThemes = ['bg-white', 'bg-gray-800', 'bg-green-600'];
const textColorThemes = ['text-black', 'text-gray-50', 'text-white'];

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
            themeIdx: 0,
            displayColorPicker: false,
            customColor: "#2CB06E",
            customTextClass: "text-black",
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
        this.handleColorPicked = this.handleColorPicked.bind(this);
        this.handleColorAccepted = this.handleColorAccepted.bind(this);
        this.handleColorClosed = this.handleColorClosed.bind(this);
    }

    componentDidMount() {
        // logic: detect current playback, fetch lyrics for song, display info to page
        // extra: use song features for more specific rendering (background? font? color?)
        const {spotify_access_token, spotify_refresh_token, spotify_expires_in, genius_access_token} = queryString.parse(this.props.location.search);
        //console.log({spotify_access_token, spotify_refresh_token, spotify_expires_in, genius_access_token});
        if (spotify_access_token && genius_access_token) {
            this.findCurrentSong(spotify_access_token, genius_access_token);
        }
        //this.setTheme(0);
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
    }

    setTheme(theme_idx) {
        if (theme_idx < 0) return;
        document.body.style.backgroundColor = '';
        document.body.classList.remove(...bgThemes);
        document.body.classList.add(bgThemes[theme_idx]);
        this.setState(prevState => ({...prevState, themeIdx: theme_idx}));
    }

    handleColorPicked(color) {
        this.setState(prevState => ({...prevState, customColor: color.hex, customTextClass: color.hsv.v < 0.5 ? 'text-white' : 'text-black'}));
    }

    handleColorAccepted() {
        document.body.style.backgroundColor = this.state.customColor;
        this.setState(prevState => ({...prevState, showColorPicker: false, themeIdx: -1}));
    }

    handleColorClosed() {
        this.setState(prevState => ({...prevState, showColorPicker: false}));
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
                    <div className={`font-sans ${textColorThemes[this.state.themeIdx]|| this.state.customTextClass}`}>
                        <div className="sticky ">
                            {themeNames.map((name, idx) => (
                                <button className={`btn ${bgThemes[idx]} ${textColorThemes[idx]}`} onClick={() => this.setTheme(idx)} key={idx} >{name}</button>
                            ))}
                            <button className={`btn ${bgThemes[0]} ${textColorThemes[0]}`} onClick={() => this.setState(prevState => ({...prevState, showColorPicker: true}))}>custom</button>
                            {this.state.showColorPicker && <PhotoshopPicker onChangeComplete={this.handleColorPicked} onAccept={this.handleColorAccepted} onCancel={this.handleColorClosed} color={this.state.customColor}/>}
                        </div>
                        <div className="flex justify-center items-baseline my-3">
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
