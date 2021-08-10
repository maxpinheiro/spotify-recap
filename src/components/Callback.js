import React from 'react';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
const queryString = require('query-string');


class Callback extends React.Component {

    componentDidMount() {
        this.state = {loading: true};
        const {code, error, state} = queryString.parse(this.props.location.search);
        console.log({code, error, state});
    }

    render() {
        return (
            <div>
                <Loader type="Oval" color="#00BFFF" height={80} width={80}/>
            </div>
        );
    }
}

export default Callback;