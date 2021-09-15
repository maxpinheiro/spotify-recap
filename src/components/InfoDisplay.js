import React from 'react';
import {PhotoshopPicker} from "react-color";
import CanvasJSReact from "../canvasjs.react";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const themeNames = ['light', 'dark', 'green', 'blue'];
const bgThemes = ['bg-white', 'bg-gray-800', 'bg-green-600', 'bg-blue-500'];
const bgHexThemes = ['#FFF', '#202A37', '#059669', '#3B82F6'];
const textColorThemes = ['text-black', 'text-gray-50', 'text-white', 'text-white'];
const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

class InfoDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            artist: props.artist,
            albumArtUrl: props.albumArtUrl,
            lyrics: props.lyrics,
            audioFeatures: {
                acousticness: props.audioFeatures.acousticness, // [0, 1]
                danceability: props.audioFeatures.danceability, // [0, 1]
                duration_ms:  props.audioFeatures.duration_ms,
                energy: props.audioFeatures.energy, // [0, 1]
                instrumentalness: props.audioFeatures.instrumentalness, // [0, 1], above 0.5 = instrumental
                key: props.audioFeatures.key, // 0 = C, 1 = C# / Db, 2 = D...
                liveness: props.audioFeatures.liveness, // value above 0.8 = likely track is live
                loudness: props.audioFeatures.loudness, // [-60, 0] db (typical range)
                mode:  props.audioFeatures.mode, // 1 = major, 0 = minor
                speechiness: props.audioFeatures.speechiness, // [0, 1]
                tempo: Math.round(props.audioFeatures.tempo), // bpm
                time_signature: props.audioFeatures.time_signature, // meter (number of beats per bar)
                valence: props.audioFeatures.valence // [0, 1]
            },
            description: props.description,
            geniusUrl: props.geniusUrl,
            themeIdx: 0,
            displayColorPicker: false,
            customColor: "",
            customTextClass: "",
            showMore: false,
            refreshPlayer: props.refreshPlayer
        };

        this.handleColorPicked = this.handleColorPicked.bind(this);
        this.handleColorAccepted = this.handleColorAccepted.bind(this);
        this.handleColorClosed = this.handleColorClosed.bind(this);
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.themeIdx === -2 && prevState.title !== this.state.title) this.setTheme(0);
    }


    setTheme(theme_idx) {
        if (theme_idx >= 0) {
            document.body.style.backgroundColor = '';
            document.body.style.backgroundImage = '';
            document.body.style.backdropFilter = '';
            document.body.classList.remove(...bgThemes);
            document.body.classList.add(bgThemes[theme_idx]);
            this.setState(prevState => ({...prevState, themeIdx: theme_idx}));
        } else if (theme_idx === -2) {
            document.body.style.backgroundImage = `url(${this.state.albumArtUrl})`;
            document.body.style.backdropFilter = 'blur(5px)';
            this.setState(prevState => ({...prevState, themeIdx: theme_idx}));
        }

    }

    handleColorPicked(color) {
        this.setState(prevState => ({...prevState, customColor: color.hex, customTextClass: color.hsv.v < 0.5 ? 'text-white' : 'text-black'}));
    }

    handleColorAccepted() {
        document.body.style.backgroundColor = this.state.customColor;
        this.setState(prevState => ({...prevState, showColorPicker: false, themeIdx: -1}));
    }

    handleColorClosed() {
        this.setState(prevState => ({...prevState, showColorPicker: false}));
    }

    invertBackgroundTextColors(bgClass, textClass) {
        const newText = "text" + bgClass.substring(bgClass.indexOf('-'));
        const newBg = "bg" + textClass.substring(textClass.indexOf('-'));
        return `${newBg} ${newText}`;
    }

    millisecondsToFormatted(time_ms) {
        const time_s = Math.floor(time_ms / 1000);
        const seconds = time_s % 60;
        return `${Math.floor(time_s / 60)}:${seconds < 10 ? '0' : ''}${seconds}`;
    }


    render() {
        return (
            <div className="container mx-auto text-center font-sans my-3">
                <div className={textColorThemes[this.state.themeIdx]|| this.state.customTextClass}>
                    <button onClick={this.props.refreshPlayer}
                            className={`mx-auto mb-4 block rounded-lg p-3 ${this.state.themeIdx >= 0 && this.invertBackgroundTextColors(bgThemes[this.state.themeIdx], textColorThemes[this.state.themeIdx])}`}
                            style={this.state.themeIdx < 0 ? {backgroundColor: "#FFF", color: this.state.customColor} : {}}>
                        Refresh Player
                    </button>
                    <div className="sticky flex justify-center items-baseline">
                        <p>Theme: </p>
                        {themeNames.map((name, idx) => (
                            <button className={`rounded-lg p-2 ${bgThemes[idx]} ${textColorThemes[idx]}`} onClick={() => this.setTheme(idx)} key={idx} >{name}</button>
                        ))}
                        <button className={`rounded-lg p-2 ${bgThemes[0]} ${textColorThemes[0]}`} onClick={() => this.setState(prevState => ({...prevState, showColorPicker: true}))}>custom</button>
                        <button className={`rounded-lg p-2 ${bgThemes[1]} ${textColorThemes[1]}`} onClick={() => this.setTheme(-2)}>album cover</button>
                        {this.state.showColorPicker && <PhotoshopPicker onChangeComplete={this.handleColorPicked} onAccept={this.handleColorAccepted} onCancel={this.handleColorClosed} color={this.state.customColor}/>}
                    </div>
                    <div className="flex justify-center items-baseline my-3">
                        <p className="text-xl font-medium">{this.state.title}</p>
                        <pre className="font-sans"> by </pre>
                        <p className="text-xl font-medium"> {this.state.artist}</p>
                    </div>

                    <img className="mx-auto my-3 md:w-1/4 md:h-1/4" src={this.state.albumArtUrl} alt=""/>
                    <button onClick={() => this.setState(prevState => ({...prevState, showMore: !prevState.showMore}))}
                            className={`rounded-lg p-3 ${this.state.themeIdx >= 0 && this.invertBackgroundTextColors(bgThemes[this.state.themeIdx], textColorThemes[this.state.themeIdx])}`}
                            style={this.state.themeIdx === -1 ? {backgroundColor: "#FFF", color: this.state.customColor} : {}}>
                        {this.state.showMore ? "Hide Info" : "Show Advanced Info"}
                    </button>
                    {
                        this.state.showMore &&
                        <div className="rounded border border-gray p-4 my-3">
                            {this.state.description === "?" ? "[ No description available ]" : `Description: ${this.state.description}`}
                            <a href={this.state.geniusUrl} className="block my-2">Genius Page</a>
                            <div className="md:grid md:grid-cols-5">
                                <p className="my-2">Duration: {this.millisecondsToFormatted(this.state.audioFeatures.duration_ms)}</p>
                                <p className="my-2">Key: {keys[this.state.audioFeatures.key]} | Mode: {(["minor", "major"])[this.state.audioFeatures.mode]}</p>
                                <p className="my-2">Tempo: {this.state.audioFeatures.tempo} bpm</p>
                                <p className="my-2">Time signature: {this.state.audioFeatures.time_signature}</p>
                                <p className="my-2">Loudness: {this.state.audioFeatures.loudness} db</p>
                            </div>
                            {/*<div className="w-1/2 border border-top border-gray my-3 mx-auto" />*/}
                            <CanvasJSChart options={
                                {
                                    backgroundColor: bgHexThemes[this.state.themeIdx] || this.state.customColor,
                                    data: [{
                                        // Change type to "doughnut", "line", "splineArea", etc.
                                        type: "column",
                                        dataPoints: (["acousticness", "danceability", "energy", "instrumentalness", "speechiness", "valence"]).map(feature => (
                                            {label: feature, y: this.state.audioFeatures[feature] || 0}
                                        )),
                                        axisY:{
                                            minimum: 0.0,
                                            maximum: 1.0,
                                        }
                                    }
                                    ]
                                }
                            } />
                        </div>
                    }
                    <pre className="text-center font-sans my-3">{this.state.lyrics || "[ No Lyrics ]"}</pre>
                </div>
            </div>
        )
    }
}

export default InfoDisplay;
