import React from 'react';
import {generateRandomString, client_id} from '../services/SpotifyService';

const redirect = 'http://localhost:3000/callback';
const scope = 'user-read-private user-read-email';
const developing = true;
const state = generateRandomString(10);

const Home = () => {

    return (
        <div>
            <a href={`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect}&state=${state}&scope=${scope}&show_dialog=${developing}`}>
                Login
            </a>
        </div>
    )
}

export default Home;
