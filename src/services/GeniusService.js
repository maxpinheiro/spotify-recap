// genius dashboard: maxpinheiro181,

export const genius_client_id = "LnIGLJSrLWudU9q90TxMiVVWsnP3EgDSgJ8Z_JoY22o-fjzZlcoqgMFIjth8dJQt";
export const genius_client_secret = "099cE-WQImmJg0gXRM8nimwKFRBiTV7oewrsTVtHGazzBI5U3rtVDjGY6qwF6-Qce1RzKsdBPmLXBGVWYITheQ";
export const genius_redirect_uri = "http://localhost:3000/geniuscallback"

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
    }).then(res =>  res.json()).catch(e => e.json())
}