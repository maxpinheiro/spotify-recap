import React from 'react';
import {generateRandomString, spotify_client_id, spotify_redirect_uri, local_spotify_redirect_uri} from '../services/SpotifyService';
import Loader from "react-loader-spinner";

const scope = 'streaming user-read-private user-read-currently-playing user-read-email user-modify-playback-state';
const developing = true;
const state = generateRandomString(10);

export const LoadingMessage = (message, color = "#15d61c", width = 80, height = 80) => (
    <div>
        <p className="mb-3">{message}</p>
        <div className="flex">
            <Loader className="mx-auto" type="Oval" color={color} height={height} width={width}/>
        </div>
    </div>
)

const Home = () => {
    const local = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "";
    console.log(`Mode: ${local ? 'development' : 'production'}`);
    return (
        <div className="container mx-auto">
            <div style={{height: "30vh"}} />
            <p className="text-xl font-weight-medium my-4 text-center">Spotify Lyric Player</p>
            <div className="flex">
                <a href={`https://accounts.spotify.com/authorize?client_id=${spotify_client_id}&response_type=code&redirect_uri=${local ? local_spotify_redirect_uri : spotify_redirect_uri}&state=${state}&scope=${scope}&show_dialog=${developing}`}
                   className="rounded bg-green-400 p-3 mx-auto">
                    Login through Spotify
                </a>
            </div>

        </div>
    )
}

export default Home;
