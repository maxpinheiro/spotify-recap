import React from 'react';
import {generateRandomString, spotify_client_id, spotify_redirect_uri} from '../services/SpotifyService';

const scope = 'streaming user-read-private user-read-currently-playing user-read-email';
const developing = true;
const state = generateRandomString(10);

const Home = () => {

    return (
        <div>
            <a href={`https://accounts.spotify.com/authorize?client_id=${spotify_client_id}&response_type=code&redirect_uri=${spotify_redirect_uri}&state=${state}&scope=${scope}&show_dialog=${developing}`}>
                Login through Spotify
            </a>
        </div>
    )
}

export default Home;
