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
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);
    const { selectedPlace, setSelectedPlace } = useSelectedPlace();
    const [center, setCenter] = useState({ lat: 41.8781, lng: -87.6298 }); // Default to Chicago
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMarkers, setSearchMarkers] = useState<{ lat: number, lng: number, address: string }[]>([]);

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
        geocoderRef.current = new google.maps.Geocoder();
    };

    const markerClickHandler = (place: Place) => {
        setSelectedPlace(place);
    };

    const handleSearch = () => {
        if (!geocoderRef.current || !searchQuery.trim()) return;

        geocoderRef.current.geocode(
            { address: searchQuery },
            (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                    const location = results[0].geometry.location;
                    const lat = location.lat();
                    const lng = location.lng();
                    const address = results[0].formatted_address;

                    // Replace search marker (only keep one)
                    const newMarker = { lat, lng, address };
                    setSearchMarkers([newMarker]);

                    // Center map on result
                    const newCenter = { lat, lng };
                    setCenter(newCenter);
                    if (mapRef.current) {
                        mapRef.current.panTo(newCenter);
                        mapRef.current.setZoom(14);
                    }

                    // Clear search input
                    setSearchQuery("");
                } else {
                    alert("Location not found. Please try a different search.");
                }
            }
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const clearSearchMarkers = () => {
        setSearchMarkers([]);
    };

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    right: "10px",
                    zIndex: 1000,
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                }}
            >
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyUp={handleKeyPress}
                    placeholder="Search for a location or address..."
                    style={{
                        flex: 1,
                        padding: "12px 16px",
                        fontSize: "16px",
                        border: "none"
                    }}
                />
                {searchMarkers.length > 0 && (
                    <button
                        onClick={clearSearchMarkers}
                        style={{
                            padding: "12px 16px",
                            fontSize: "16px",
                            fontWeight: "500",
                            backgroundColor: "#f5f5f5",
                            color: "#333",
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            cursor: "pointer",
                            transition: "background-color 0.2s ease",
                            minHeight: "48px",
                        }}
                        title="Clear search results"
                    >
                        ✕
                    </button>
                )}
            </div>
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
                    {searchMarkers.map((marker, index) => (
                        <Marker
                            key={`search-${index}`}
                            position={{ lat: marker.lat, lng: marker.lng }}
                            title={marker.address}
                            icon={{
                                url: `data:image/svg+xml,${encodeURIComponent(`
                                    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="22" cy="22" r="16" fill="#9c27b0" stroke="#ffffff" stroke-width="3"/>
                                        <circle cx="22" cy="22" r="6" fill="#ffffff"/>
                                    </svg>
                                `)}`
                            }}
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
