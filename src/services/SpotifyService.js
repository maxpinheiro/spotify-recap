// spotify dashboard: maxpinheiro181, Poi1poi1$$
export const spotify_client_id = "171ae7dd63c640819e0446c3b2dfd196";
export const spotify_client_secret = "b0abf14d0a084609b0ab79251dab34d4";
export const spotify_redirect_uri = "http://maxpinheiro.github.io/spotify-lyrics/spotifycallback";
export const local_spotify_redirect_uri = "http://localhost:3000/spotifycallback";

export const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export const jsonToUrlEncoded = (obj) => Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');

/*
* Response object:
* success (200 status in header):
*  {
   "access_token": "NgCXRK...MzYjw",
   "token_type": "Bearer",
   "scope": "user-read-private user-read-email",
   "expires_in": 3600,
   "refresh_token": "NgAagA...Um_SHo"
}
* error (400 status in header):
*   {
*   "error": "invalid_grant",
*   "error_description": "Invalid authorization code"
*   }
*/
export async function getTokens(auth_code, local = true) {
    const body = {
        grant_type: "authorization_code",
        code: auth_code,
        redirect_uri: local ? local_spotify_redirect_uri : spotify_redirect_uri
    };
    const encoded = jsonToUrlEncoded(body);

    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + window.btoa(`${spotify_client_id}:${spotify_client_secret}`)
        },
        body: encoded
    }).then(res =>  res.json().then(data => {
        return new Promise((resolve, reject) => {
            if (data.hasOwnProperty("access_token") && data.hasOwnProperty("refresh_token") && data.hasOwnProperty("expires_in")) {
                resolve({success: true, accessToken: data.access_token, refreshToken: data.refresh_token, expiresIn: data.expires_in});
            } else if (data.hasOwnProperty("error") && data.hasOwnProperty("error_description")) {
                resolve({success: false, errorMessage: data.error_description});
            } else {
                resolve({success: false, errorMessage: "unknown error"});
            }
        })
    })).catch(e => {console.log("TOKEN ERROR: ", e); return e.json()})
}

/*
* Response object:
* success (200 status in header):
*  {
   "access_token": "NgCXRK...MzYjw",
   "token_type": "Bearer",
   "scope": "user-read-private user-read-email",
   "expires_in": 3600
}
*
*/
export async function refreshTokens(refresh_token) {
    const body = {
        grant_type: "refresh_token",
        refresh_token
    };
    const encoded = jsonToUrlEncoded(body);

    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + window.btoa(`${spotify_client_id}:${spotify_client_secret}`)
        },
        body: encoded
    }).then(res =>  res.json().then(data => {
        return new Promise(resolve => {
            if (data.hasOwnProperty("access_token") && data.hasOwnProperty("expires_in")) {
                resolve({success: true, accessToken: data.access_token, expiresIn: data.expires_in});
            } else if (data.hasOwnProperty("error") && data.hasOwnProperty("error_description")) {
                resolve({success: false, errorMessage: data.error_description});
            } else {
                resolve({success: false, errorMessage: "unknown error"});
            }
        })
    })).catch(e => e.json())
}

export async function getCurrentTrack(access_token) {
    return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${access_token}`
        }
    }).then(res => {
        if (res.status === 204) {
            return new Promise(resolve => resolve({success: false, playing: false}))
        } else {
            return res.json().then(data => {
                return new Promise(resolve => {
                    if (data.hasOwnProperty("item") && data.item.hasOwnProperty("name") && data.item.hasOwnProperty("artists")) {
                        const song = data.item.name;
                        const artist = data.item.artists[0].name;
                        const spotifyId = data.item.id;
                        const albumArtUrl = data.item.album.images[0].url;
                        resolve({success: true, song, artist, spotifyId, albumArtUrl});
                    } else {
                        resolve({success: false, errorMessage: "unknown error"});
                    }
                })
            })
        }
    })
}

export async function getAudioFeatures(spotifyId, access_token) {
    return fetch(`https://api.spotify.com/v1/audio-features/${spotifyId}`, {
        headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${access_token}`
        }
    }).then(res => res.json().then(data => {
        return new Promise(resolve => {
            if (data.hasOwnProperty("danceability")) {
                resolve({success: true, audioFeatures: {
                        danceability: data.danceability,
                        energy: data.energy,
                        key: data.key,
                        loudness: data.loudness,
                        mode:  data.mode,
                        speechiness: data.speechiness,
                        acousticness: data.acousticness,
                        instrumentalness: data.instrumentalness,
                        liveness: data.liveness,
                        valence: data.valence,
                        tempo: data.tempo,
                        type: data.type,
                        duration_ms: data.duration_ms,
                        time_signature: data.time_signature
                    }})
            } else {
                resolve({success: false});
            }
        })
    }))
}

export async function getAudioAnalysis(spotifyId, access_token) {
    return fetch(`https://api.spotify.com/v1/audio-features/${spotifyId}`, {
        headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${access_token}`
        }
    }).then(res => res.json().then(data => {
        return new Promise(resolve => {
            if (data.hasOwnProperty("beats")) {
                resolve({success: true, beats: data.beats});
            } else {
                resolve({success: false});
            }
        })
    }))
}

export async function searchSongs(query, access_token) {
    return fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
        headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${access_token}`
        }
    }).then(res => res.json().then(data => {
        return new Promise(resolve => {
            if (data.hasOwnProperty("tracks")) {
                const tracks = data.tracks.items;
                const concatArtists = (artists) => (artists.join(', '));
                const songs = tracks.map(track => ({name: track.name, artist: concatArtists(track.artists.map(a => a.name)), spotifyId: track.id, spotifyUri: track.uri, imageUrl: track.album.images[0].url}));
                resolve({success: true, songs});
            } else if (data.hasOwnProperty("error")) {
                resolve({success: false, errorMessage: data.message});
            } else {
                resolve({success: false, errorMessage: "unknown error"});
            }
        })
    }))
}

export async function startPlayback(access_token) {
    return fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${access_token}`
        }
    }).then(res => {
        if (res.status === 204) {
            return new Promise(resolve => resolve({success: true}));
        } else if (res.status === 404) {
            return new Promise(resolve => resolve({success: false, message: "no device found"}));
        } else if (res.status === 403) {
            return new Promise(resolve => resolve({success: false, message: "user making request is non-premium"}));
        } else {
            return new Promise(resolve => resolve({success: false, message: "unknown error"}));
        }
    })
}

export async function pausePlayback(access_token) {
    return fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${access_token}`
        }
    }).then(res => {
        if (res.status === 204) {
            return new Promise(resolve => resolve({success: true}));
        } else if (res.status === 404) {
            return new Promise(resolve => resolve({success: false, message: "no device found"}));
        } else if (res.status === 403) {
            return new Promise(resolve => resolve({success: false, message: "user making request is non-premium"}));
        } else {
            return new Promise(resolve => resolve({success: false, message: "unknown error"}));
        }
    })
}

export async function skipPlayback(access_token) {
    return fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${access_token}`
        }
    }).then(res => {
        if (res.status === 204) {
            return new Promise(resolve => resolve({success: true}));
        } else if (res.status === 404) {
            return new Promise(resolve => resolve({success: false, message: "no device found"}));
        } else if (res.status === 403) {
            return new Promise(resolve => resolve({success: false, message: "user making request is non-premium"}));
        } else {
            return new Promise(resolve => resolve({success: false, message: "unknown error"}));
        }
    })
}

export async function addToQueue(spotifyUri, access_token) {
    return fetch(`https://api.spotify.com/v1/me/player/queue?uri=${spotifyUri}`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${access_token}`
        }
    }).then(res => {
        if (res.status === 204) {
            return new Promise(resolve => resolve({success: true}));
        } else if (res.status === 404) {
            return new Promise(resolve => resolve({success: false, message: "no device found"}));
        } else if (res.status === 403) {
            return new Promise(resolve => resolve({success: false, message: "user making request is non-premium"}));
        } else {
            return new Promise(resolve => resolve({success: false, message: "unknown error"}));
        }
    })
}

const spotifyService = {getTokens, refreshTokens, getCurrentTrack, getAudioFeatures, getAudioAnalysis, searchSongs, pausePlayback, skipPlayback, addToQueue};
export default spotifyService;
