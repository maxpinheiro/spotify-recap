// genius dashboard: maxpinheiro181,
import geniusAPI from 'genius-lyrics-api';

export const genius_client_id = "LnIGLJSrLWudU9q90TxMiVVWsnP3EgDSgJ8Z_JoY22o-fjzZlcoqgMFIjth8dJQt";
export const genius_client_secret = "099cE-WQImmJg0gXRM8nimwKFRBiTV7oewrsTVtHGazzBI5U3rtVDjGY6qwF6-Qce1RzKsdBPmLXBGVWYITheQ";
export const genius_redirect_uri = "http://localhost:3000/geniuscallback";
const cors_proxy = "https://salty-wildwood-08581.herokuapp.com";

export async function getAccessToken(auth_code) {
    return fetch('https://api.genius.com/oauth/token', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        },
        body: {
            "code": auth_code,
            "client_secret": genius_client_secret,
            'grant_type': "authorization_code",
            'client_id': genius_client_id,
            "redirect_uri": genius_redirect_uri,
            "response_type": "code",
        }
    }).then(res =>  res.json())
}

export async function searchSong(song, artist, access_token) {
    return fetch(`${cors_proxy}/http://api.genius.com/search?q=${song.replace('%', '')} ${artist}`, {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    }).then(res =>  res.json())
}

export async function getSongDetails(song_id, access_token) {
    return fetch(`${cors_proxy}/http://api.genius.com/songs/${song_id}?text_format=plain`, {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    }).then(res =>  res.json())
}


export async function getSongLyricsAPI(song, artist, access_token) {
    return geniusAPI.getSong({
        apiKey: access_token,
        title: song,
        artist,
        optimizeQuery: false
    }).then(data => {
        return new Promise(resolve => {
            if (data.hasOwnProperty("albumArt") && data.hasOwnProperty("lyrics")) {
                resolve({success: true, albumArtUrl: data.albumArt, lyrics: data.lyrics});
            } else {
                resolve({success: false, errorMessage: "unknown error"});
            }
        })
    }).catch(e => new Promise(resolve => resolve({success: false, errorMessage: "unknown error"})));
}

const geniusService = {getAccessToken, searchSong, getSongDetails, getSongLyricsAPI};
export default geniusService;
