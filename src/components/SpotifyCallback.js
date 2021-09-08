import React from 'react';
import {genius_client_id, genius_redirect_uri} from "../services/GeniusService";
import { Link } from 'react-router-dom';
import {LoadingMessage} from "./Home";

const queryString = require('query-string');


class SpotifyCallback extends React.Component {

    constructor(props) {
        super(props);
        this.state = {status: "loading", auth_code: undefined, error: undefined};
    }

    componentDidMount() {
        // logic: just came from spotify authorization, next prompt genius authorization
        // spotify redirects to /callback?code=... or /callback?error=...
        const {code, error} = queryString.parse(this.props.location.search);
        if (code) {
            this.setState({status: "success", auth_code: code});
        } else if (error) {
            this.setState({status: "error", error: error});
        }
    }


    render() {
        return (
            <div className="container mx-auto my-3 text-center">
                {
                    this.state.status === "loading" && LoadingMessage("Logging you in...")
                }
                {
                    this.state.status === "success" && this.state.auth_code &&
                    <div>
                        <p>Almost done! Now we need you to authorize through Genius so we can retrieve song lyrics.</p>
                        <div className="flex">
                            <a href={`https://api.genius.com/oauth/authorize?client_id=${genius_client_id}&redirect_uri=${genius_redirect_uri}&scope=me&state=${this.state.auth_code}&response_type=token`}
                               className="rounded bg-green-400 p-3 mx-auto">
                                Login through Genius
                            </a>
                        </div>
                    </div>
                }
                {
                    this.state.status === "error" &&
                    <span>
                        <p>There was an issue logging in{this.state.error && `: ${this.state.message}`}. Please login again through the home page.</p>
                        <div className="flex">
                            <Link to="/" className="rounded bg-green-400 p-3 mx-auto">Home page</Link>
                        </div>
                    </span>
                }
            </div>
        );
    }
}

export default SpotifyCallback;
