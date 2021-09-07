const musix_match_api_key = "6175427da9270d9bf3cb0b7981199141";
const cors_proxy = "https://salty-wildwood-08581.herokuapp.com";

export async function searchTrack(track, artist) {
    return fetch(`${cors_proxy}/http://api.musixmatch.com/ws/1.1/track.search?apikey=${musix_match_api_key}&q_track=${track}&q_artist=${artist}&page_size=1&page=1`)
        .then(res =>  res.json())
}

export async function getLyricsForTrack(track_id) {
    return fetch(`${cors_proxy}/http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=${musix_match_api_key}&track_id=${track_id}`)
        .then(res => res.json())
}

const musixMatchService = {searchTrack, getLyricsForTrack};
export default  musixMatchService;