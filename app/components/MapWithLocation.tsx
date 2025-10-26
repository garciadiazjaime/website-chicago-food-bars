"use client";

import { useRef } from "react";
import Map, { MapRef } from "@/app/components/Map";
import LocationButton from "@/app/components/LocationButton";
import { Place } from "@/app/support/types";

interface MapWithLocationProps {
    places: Place[];
}

export default function MapWithLocation({ places }: MapWithLocationProps) {
    const mapRef = useRef<MapRef>(null);

    const handleLocationFound = (lat: number, lng: number) => {
        if (mapRef.current) {
            mapRef.current.centerMap(lat, lng);
        }
    };

    return (
        <>
            <Map ref={mapRef} places={places} />
            <LocationButton onLocationFound={handleLocationFound} />
        </>
    );
}