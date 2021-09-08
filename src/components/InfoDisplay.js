import React from 'react';
import {PhotoshopPicker} from "react-color";

const themeNames = ['light', 'dark', 'green', 'blue'];
const bgThemes = ['bg-white', 'bg-gray-800', 'bg-green-600', 'bg-blue-500'];
const textColorThemes = ['text-black', 'text-gray-50', 'text-white', 'text-white'];

class InfoDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            artist: props.artist,
            albumArtUrl: props.albumArtUrl,
            lyrics: props.lyrics,
            themeIdx: 0,
            displayColorPicker: false,
            customColor: "",
            customTextClass: "",
            showMore: false
        };

        this.handleColorPicked = this.handleColorPicked.bind(this);
        this.handleColorAccepted = this.handleColorAccepted.bind(this);
        this.handleColorClosed = this.handleColorClosed.bind(this);
    }

    componentDidMount() {
    }

    setTheme(theme_idx) {
        if (theme_idx < 0) return;
        document.body.style.backgroundColor = '';
        document.body.classList.remove(...bgThemes);
        document.body.classList.add(bgThemes[theme_idx]);
        this.setState(prevState => ({...prevState, themeIdx: theme_idx}));
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


    render() {
        return (
            <div className="container mx-auto text-center font-sans my-3">
                <div className={textColorThemes[this.state.themeIdx]|| this.state.customTextClass}>
                    <div className="sticky flex justify-center items-baseline">
                        <p>Theme: </p>
                        {themeNames.map((name, idx) => (
                            <button className={`rounded-lg p-2 ${bgThemes[idx]} ${textColorThemes[idx]}`} onClick={() => this.setTheme(idx)} key={idx} >{name}</button>
                        ))}
                        <button className={`rounded-lg p-2 ${bgThemes[0]} ${textColorThemes[0]}`} onClick={() => this.setState(prevState => ({...prevState, showColorPicker: true}))}>custom</button>
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
                        <div>

                        </div>
                    }
                    <pre className="text-center font-sans my-3">{this.state.lyrics}</pre>
                </div>
            </div>
        )
    }
}

export default InfoDisplay;
