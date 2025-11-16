"use client";

import { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";

import { useSelectedPlace } from "@/app/contexts/SelectedPlaceContext";
import { getMarkerIcon } from "@/app/support/icons";
import { Place } from "@/app/support/types";

interface MapRef {
    centerMap: (lat: number, lng: number) => void;
}

const Map = forwardRef<MapRef, { places: Place[] }>((props, ref) => {
    const { places } = props;
    const mapRef = useRef<google.maps.Map | null>(null);
    const { selectedPlace, setSelectedPlace } = useSelectedPlace();
    const [center, setCenter] = useState({ lat: 41.8781, lng: -87.6298 }); // Default to Chicago

    useImperativeHandle(ref, () => ({
        centerMap: (lat: number, lng: number) => {
            const newCenter = { lat, lng };
            setCenter(newCenter);
            if (mapRef.current) {
                mapRef.current.panTo(newCenter);
                mapRef.current.setZoom(14); // Zoom in when centering on user location
            }
        }
    }));

    const handleOnLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const markerClickHandler = (place: Place) => {
        setSelectedPlace(place);
    };

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <LoadScriptNext googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS!}>
                <GoogleMap
                    mapContainerStyle={{
                        width: "100%",
                        height: "100%",
                    }}
                    center={center}
                    zoom={12}
                    onLoad={handleOnLoad}
                >
                    {places.map((place, index) => (
                        <Marker
                            key={index}
                            position={{ lat: place.lat, lng: place.lng }}
                            title={place.name}
                            onClick={() => markerClickHandler(place)}
                            icon={getMarkerIcon(selectedPlace?.slug === place.slug, place.slug)}
                        />
                    ))}
                </GoogleMap>
            </LoadScriptNext>
        </div>
    );
});

Map.displayName = 'Map';

export default Map;
export type { MapRef };
