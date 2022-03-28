import React, { useEffect, useState } from "react";

const Item = ({nameElement, imageUrl, link}, showImage=true) => (
    <div className="d-flex flex-column mx-auto items-center mb-4 cursor-pointer">
        <a href={link}>
            { showImage && <img src={imageUrl} alt="album cover" className="mx-auto mb-1 rounded-full" style={{width: "60vw", height: "60vw", maxWidth: 300, maxHeight: 300}} />}
            { nameElement }
        </a>
    </div>
)

const ArtistList = ({items, showImage=true}) => (
    <div>
        {
            items.map((artist, idx) => (
                <Item key={idx}
                    nameElement={<p className="text-white text-2xl">{artist.name}</p>} 
                    imageUrl={artist.images[0]?.url || ""} 
                    link={artist.external_urls?.spotify || ""} 
                    showImage={showImage} 
                /> )
            )
        }
    </div>
);

const TrackList = ({items, showImage=true}) => (
    <div>
        {
            items.map((track, idx) => (
                <Item key={idx}
                    nameElement={<div><p className="text-white text-2xl">{track.name}</p><p className="text-white text-lg">{track.artists[0]?.name || ""}</p></div>}
                    imageUrl={track.album?.images[0]?.url || ""} 
                    link={track.external_urls?.spotify || ""} 
                    showImage={showImage} 
                />) 
            )
        }
    </div>
);

//const emptyOptions = {short_term: [], medium_term: [], long_term: []};
const timeRangeNames = {short_term: "last 4 weeks", medium_term: "last 6 months", long_term: "several years"};

const RecapInfo = ({topArtists, topTracks}) => {
    const [type, setType] = useState("artists");
    const [timeRange, setTimeRange] = useState("");

    useEffect(() => {
    }, []);
    
    return (
        <div className="flex flex-col text-josefin">
            <div className="flex mx-auto">
                <p className="text-white text-2xl mx-1">top</p>
                {
                    (["artists", "tracks"]).map(optType => <p className={`text-white${optType === type ? " cursor-pointer" : "-disabled"} text-2xl mx-1`} onClick={() => setType(optType)}>{optType}</p>)
                }                
            </div>
            <div className="flex mx-auto my-2">
                {
                    (["short_term", "medium_term", "long_term"]).map(range => <p className={`text-white${range === timeRange ? "" : "-disabled"} text-xl cursor-pointer mx-2`} onClick={() => setTimeRange(range)}>{timeRangeNames[range] || ""}</p>)
                }
            </div>
            
            <div className="border-b border-white w-1/2 mb-3 mt-1 mx-auto"/>
            {
                type === "artists" && <ArtistList items={topArtists[timeRange] || []} />
            }
            {
                type === "tracks" && <TrackList items={topTracks[timeRange] || []} />
            }
        </div>
    )
}

export default RecapInfo;
