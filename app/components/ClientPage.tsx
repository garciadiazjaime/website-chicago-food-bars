"use client";

import { useEffect, useRef } from "react";
import ReactGA from "react-ga4";

import Map, { MapRef } from "@/app/components/Map";
import LocationButton from "@/app/components/LocationButton";
import SelectedPlace from "@/app/components/SelectedPlace";
import LoginModal from "@/app/components/LoginModal";
import { Place } from "@/app/support/types";
import Header from "./Header";

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

    useEffect(() => {
        ReactGA.initialize("G-RMJYP1YMHE");
    }, [])

    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <LoginModal />
            <Header />
            <div style={{ height: "64vh" }}>
                <Map ref={mapRef} places={places} />
            </div>
            <LocationButton onLocationFound={handleLocationFound} />
            <SelectedPlace />
        </div>
    );
}
