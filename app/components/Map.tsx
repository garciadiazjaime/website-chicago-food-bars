"use client";

import { useRef, useState } from "react";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import SelectedPlace from "@/app/components/SelectedPlace";

import { Place } from "@/app/support/types";

export default function Map(props: { places: Place[] }) {
    const { places } = props;
    const mapRef = useRef<google.maps.Map | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    const handleOnLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const markerClickHandler = (place: Place) => {
        setSelectedPlace(place);
    };

    const placeCloseHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setSelectedPlace(null);
    };

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <LoadScriptNext googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS!}>
                <GoogleMap
                    mapContainerStyle={{
                        width: "100%",
                        height: "100%",
                    }}
                    center={{ lat: 41.8781, lng: -87.6298 }} // Default to Chicago
                    zoom={12}
                    onLoad={handleOnLoad}
                >
                    {places.map((place, index) => (
                        <Marker
                            key={index}
                            position={{ lat: place.lat, lng: place.lng }}
                            title={place.name}
                            onClick={() => markerClickHandler(place)}
                        />
                    ))}
                </GoogleMap>
            </LoadScriptNext>

            {selectedPlace && <SelectedPlace place={selectedPlace} onCloseClicked={placeCloseHandler} />}
        </div>
    );
}
