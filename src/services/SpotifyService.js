// spotify dashboard: maxpinheiro181, Poi1poi1$$
export const spotify_client_id = "171ae7dd63c640819e0446c3b2dfd196";
export const spotify_client_secret = "b0abf14d0a084609b0ab79251dab34d4";
export const spotify_redirect_uri = "http://localhost:3000/spotifycallback";

export const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export const jsonToUrlEncoded = (obj) => Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');

export async function getTokens(auth_code) {
    const body = {
        grant_type: "authorization_code",
        code: auth_code,
        redirect_uri: spotify_redirect_uri
    };
    const encoded = jsonToUrlEncoded(body);
    //console.log('service: get tokens')

    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + window.btoa(`${spotify_client_id}:${spotify_client_secret}`)
        },
        body: encoded
    }).then(res =>  res.json()).catch(e => e.json())
}

export async function getCurrentPlayback(access_token) {
    return fetch('https://api.spotify.com/v1/me/player', {
        headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${access_token}`
        }
    }).then(res =>  res.json()).catch(e => e.json())
}

//const service = {authorize, generateRandomString};
//export default service;
