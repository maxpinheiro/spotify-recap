import React, { useEffect, useState } from "react";
import queryString from "querystring";
import { Redirect } from "react-router-dom";

const FallbackHandler = () => {
    const [spotifyCode, setSpotifyCode] = useState(null);

    useEffect(() => {
        if (window.location.hash.includes('callback') && window.location.search) {
            const { code } = queryString.parse(window.location.search.substring(1));
            if (code) {
                setSpotifyCode(code);
            }
        } 
    }, []);

    return (
        <div className="text-center">
            <div style={{height: "30vh"}} />
            { spotifyCode && <Redirect to={`/callback?code=${spotifyCode}`}/>}
            <div style={{height: "70vh"}} />
        </div>
);
}

export default FallbackHandler;
