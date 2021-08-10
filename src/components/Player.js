import React from 'react';

class Player extends React.Component {
    componentDidMount() {
        const playerId = this.props.match.params.playerId;
        if (!playerId) return;
        console.log(playerId);
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}

export default Player;
