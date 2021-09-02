import React from 'react';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {genius_client_id, genius_redirect_uri} from "../services/GeniusService";
import { Link } from 'react-router-dom';

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
        //console.log({code, error});
        if (code) {
            this.setState({status: "success", auth_code: code});
        } else if (error) {
            this.setState({status: "error", error: error});
        }
    }


    render() {
        return (
            <div>
                {
                    this.state.status === "loading" &&
                    <div>
                        <p>Logging you in...</p>
                        <Loader type="Oval" color="#15d61c" height={80} width={80}/>
                    </div>
                }
                {
                    this.state.status === "success" && this.state.auth_code &&
                    <div>
                        <p>Almost done! Now we need you to authorize through Genius so we can retrieve song lyrics.</p>
                        <a href={`https://api.genius.com/oauth/authorize?client_id=${genius_client_id}&redirect_uri=${genius_redirect_uri}&scope=me&state=${this.state.auth_code}&response_type=token`}>
                            Login through Genius
                        </a>
                    </div>
                }
                {
                    this.state.status === "error" &&
                    <span>
                        <p>There was an issue logging in{this.state.error && `: ${this.state.error}`}. Please login again through the </p>
                        <Link to="/">Home page</Link>.
                    </span>
                }
            </div>
        );
    }
}

export default SpotifyCallback;