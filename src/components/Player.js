import React from 'react';

const queryString = require('query-string');


class Player extends React.Component {
    componentDidMount() {
        const {access_token, refresh_token, expires_in} = queryString.parse(this.props.location.search);
        console.log(access_token)
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}

export default Player;
