"use client";

import { useSelectedPlace } from "@/app/contexts/SelectedPlaceContext";
import { useEffect, useRef, useState } from "react";

export default function SelectedPlace() {
    const { userEmail, selectedPlace, clearSelectedPlace } = useSelectedPlace();
    const panelRef = useRef<HTMLDivElement>(null);
    const justMountedRef = useRef(true);
    const [visitedPlaces, setVisitedPlaces] = useState<{ [slug: string]: boolean }>({});

    // Load visited places from localStorage
    useEffect(() => {
        if (userEmail) {
            const saved = localStorage.getItem(`visitedPlaces_${userEmail}`);
            if (saved) {
                try {
                    setVisitedPlaces(JSON.parse(saved));
                } catch (error) {
                    console.error('Error loading visited places:', error);
                    setVisitedPlaces({});
                }
            }
        } else {
            setVisitedPlaces({});
        }
    }, [userEmail]);

    const toggleVisited = (slug: string) => {
        if (!userEmail) return;

        const newVisitedPlaces = {
            ...visitedPlaces,
            [slug]: !visitedPlaces[slug]
        };

        setVisitedPlaces(newVisitedPlaces);
        localStorage.setItem(`visitedPlaces_${userEmail}`, JSON.stringify(newVisitedPlaces));
    };

    useEffect(() => {
        if (selectedPlace) {
            justMountedRef.current = true;
            // Allow closing after a short delay
            const timer = setTimeout(() => {
                justMountedRef.current = false;
            }, 150);

            // Handle clicks outside the panel
            const handleClickOutside = (event: MouseEvent) => {
                if (!justMountedRef.current &&
                    panelRef.current &&
                    !panelRef.current.contains(event.target as Node)) {
                    clearSelectedPlace();
                }
            };

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                clearTimeout(timer);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [selectedPlace, clearSelectedPlace]);

    if (!selectedPlace) {
        return null;
    }

    const openGoogleMapsHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        const url = `https://www.google.com/maps?q=${selectedPlace.lat},${selectedPlace.lng}`;
        window.open(url, "_blank");
    };

    const placeClickHandler = () => {
        window.open(selectedPlace.url, "_blank");
    };

    return (
        <div
            ref={panelRef}
            style={{
                position: "fixed",
                bottom: "10px",
                left: "10px",
                right: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                backdropFilter: "blur(10px)",
                cursor: "pointer",
            }}
            onClick={placeClickHandler}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                }}
            >
                <div style={{ flex: 1 }}>
                    <h3
                        style={{
                            margin: "0 0 12px 0",
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "#333",
                            lineHeight: "1.3",
                        }}
                    >
                        {selectedPlace.name}
                    </h3>
                    <p
                        style={{
                            margin: "0 0 12px 0",
                            fontSize: "16px",
                            color: "#666",
                            lineHeight: "1.4",
                        }}
                    >
                        {selectedPlace.address}
                    </p>
                    <span
                        style={{
                            display: "inline-block",
                            padding: "8px 12px",
                            backgroundColor:
                                selectedPlace.type === "restaurant"
                                    ? "#e8f5e8"
                                    : selectedPlace.type === "bar"
                                        ? "#fff3e0"
                                        : "#e3f2fd",
                            color:
                                selectedPlace.type === "restaurant"
                                    ? "#2e7d32"
                                    : selectedPlace.type === "bar"
                                        ? "#f57c00"
                                        : "#1976d2",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            textTransform: "capitalize",
                        }}
                    >
                        {selectedPlace.type}
                    </span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    {userEmail && (
                        <button
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleVisited(selectedPlace.slug);
                            }}
                            style={{
                                background: visitedPlaces[selectedPlace.slug] ? "#4caf50" : "#f5f5f5",
                                border: "1px solid #ddd",
                                fontSize: "16px",
                                cursor: "pointer",
                                color: visitedPlaces[selectedPlace.slug] ? "white" : "#333",
                                padding: "12px",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "48px",
                                minHeight: "48px",
                                zIndex: 1001,
                                flexShrink: 0,
                                fontWeight: "500",
                                transition: "all 0.2s ease",
                            }}
                            title={visitedPlaces[selectedPlace.slug] ? "Mark as not visited" : "Mark as visited"}
                        >
                            {visitedPlaces[selectedPlace.slug] ? "✓" : "○"}
                        </button>
                    )}
                    <button
                        onClick={openGoogleMapsHandler}
                        style={{
                            background: "#4285f4",
                            border: "none",
                            fontSize: "16px",
                            cursor: "pointer",
                            color: "white",
                            padding: "12px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "48px",
                            minHeight: "48px",
                            zIndex: 1001,
                            flexShrink: 0,
                            fontWeight: "500",
                        }}
                        title="Open in Google Maps"
                    >
                        📍
                    </button>
                </div>
            </div>
        </div>
    );
}
