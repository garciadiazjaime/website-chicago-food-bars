"use client";

import { useRef } from "react";
import Map, { MapRef } from "@/app/components/Map";
import LocationButton from "@/app/components/LocationButton";
import SelectedPlace from "@/app/components/SelectedPlace";
import { Place } from "@/app/support/types";

interface ClientPageProps {
    places: Place[];
}

export default function ClientPage({ places }: ClientPageProps) {
    const mapRef = useRef<MapRef>(null);

    const handleLocationFound = (lat: number, lng: number) => {
        if (mapRef.current) {
            mapRef.current.centerMap(lat, lng);
        }
    };

    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <Map ref={mapRef} places={places} />
            <LocationButton onLocationFound={handleLocationFound} />
            <SelectedPlace />
        </div>
    );
}