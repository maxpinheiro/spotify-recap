export const client_id = "4231ede22a1a4728ba29b7bf2a12612e";
export const client_secret = "8ea73dfafbc241fc83cecc93722c9468";

export const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export const jsonToUrlEncoded = (obj) => Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');

export async function getAuthTokens(auth_code) {
    const redirect = 'http://localhost:3000/callback';
    const body = {
        grant_type: "authorization_code",
        code: auth_code,
        redirect_uri: redirect
    };
    const encoded = jsonToUrlEncoded(body);
    //console.log('service: get tokens')

    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + window.btoa(`${client_id}:${client_secret}`)
        },
        body: encoded
    }).then(res =>  res.json()).catch(e => e.json())
}

//const service = {authorize, generateRandomString};
//export default service;
