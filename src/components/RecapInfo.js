import React from "react";

const RecapInfo = ({items, type}) => {
    return (
        <div className="flex flex-col text-josefin">
            <p className="text-white text-2xl">top {type}</p>
            <div className="border-b border-white w-1/6 mb-3 mt-1 mx-auto"/>
            {
                type === "artists" && items.map((artist, idx) => (
                    <div key={idx}>
                        <a href={artist.external_urls?.spotify || ""} className="text-white">{artist.name}</a>
                    </div>
                ))
            }
        </div>
    )
}

export default RecapInfo;
