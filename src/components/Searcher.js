import React, {useState} from "react";

export const Searcher = ({searchSong}) => {
    const [query, setQuery] = useState("");

    return (
        <div className="flex ">
            <div className="flex mx-auto rounded-lg bg-green-100">
                <p className="text-center my-auto mx-2">Search for a song: </p>
                <input value={query} placeholder="song title" className="text-center bg-green-50" onChange={(e) => setQuery(e.target.value)} />
                <button onClick={() => searchSong(query.split(' ').join('%20'))} className="rounded-r-lg px-3 py-1 bg-green-600 text-green-100">Search</button>
            </div>
        </div>
    )
}

export const SearchResults = ({songs, selectSong}) => {
    return (
        <div className="">
            <div className="flex flex-col justify-self-auto">
                <div className="mx-auto">
                    {songs.map(({name, artist, spotifyId, imageUrl}, idx) => (
                        <div className="flex items-center justify-between my-3 bg-gray-50" key={idx}>
                            <img src={imageUrl} alt=" " className="" width={100} height={100}/>
                            <p className="my-auto mx-3">{name} by {artist}</p>
                            <button onClick={() => selectSong(spotifyId)} className="rounded-lg px-3 py-1 bg-green-600 text-green-100">Select Song</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Searcher;