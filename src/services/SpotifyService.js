export const client_id = "4231ede22a1a4728ba29b7bf2a12612e";

export const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export async function authorize() {
    const redirect = 'https://localhost:3000/callback';
    const scope = 'user-read-private user-read-email';
    const developing = true;
    const state = generateRandomString(10);
    return fetch(`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect}&state=${state}&scope=${scope}&show_dialog=${developing}`, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'content-type': 'application/json'
        }
    }).then(response => response.json()).catch(error => console.log('Authorization failed : ' + error.message));
}

//const service = {authorize, generateRandomString};
//export default service;
