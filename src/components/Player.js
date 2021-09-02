import React from 'react';

const queryString = require('query-string');


class Player extends React.Component {
    componentDidMount() {
        const {spotify_access_token, spotify_refresh_token, spotify_expires_in, genius_access_token} = queryString.parse(this.props.location.search);
        console.log({spotify_access_token, spotify_refresh_token, spotify_expires_in, genius_access_token});
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}

export default Player;
