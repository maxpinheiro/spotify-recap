import React, {useEffect, useState} from 'react';
import {generateRandomString, spotify_client_id, spotify_redirect_uri, local_spotify_redirect_uri} from '../services/SpotifyService';
import Loader from "react-loader-spinner";
import {Redirect} from "react-router-dom";

const scope = 'user-top-read user-read-private user-read-currently-playing user-read-email';
const developing = true;
const state = generateRandomString(10);

export const LoadingMessage = (message, color = "#15d61c", textColor = "text-black", width = 80, height = 80) => (
    <div>
        <p className={`mb-3 ${textColor}`}>{message}</p>
        <div className="flex">
            <Loader className="mx-auto" type="Oval" color={color} height={height} width={width}/>
        </div>
    </div>
)

const Home = () => {
    const [spotifyCallback, setSpotifyCallback] = useState(false);
    useEffect(() => {
        if (window.location.pathname.includes('spotifycallback')) {
            setSpotifyCallback(true);
        }
    }, [])

    const local = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "";
    console.log(`Mode: ${local ? 'development' : 'production'}`);
    if (spotifyCallback) {
        return <Redirect to={`/spotify-lyrics#/spotifycallback${window.location.search}`} />;
    } else {
        return (
            <div className="container mx-auto">
                <div style={{height: "25vh"}} />
                <p className="text-4xl font-semibold text-josephin my-4 text-center text-spotify-green">Spotify Recap</p>
                <div className="py-5" />
                <div className="flex">
                    <a href={`https://accounts.spotify.com/authorize?client_id=${spotify_client_id}&response_type=code&redirect_uri=${local ? local_spotify_redirect_uri : spotify_redirect_uri}&state=${state}&scope=${scope}&show_dialog=${developing}`}
                       className="rounded-lg p-4 bg-spotify-green text-xl text-josephin text-white mx-auto">
                        Login through Spotify
                    </a>
                </div>
                <div style={{height: "50vh"}} />
            </div>
        )
    }

}

export default Home;
