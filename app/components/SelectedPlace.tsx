import { useSelectedPlace } from "@/app/contexts/SelectedPlaceContext";
import { useEffect, useRef } from "react";

import { saveVisitedPlace, removeVisitedPlace, getVisitedPlaces } from "@/app/helpers/dynamodb";
import { loggerError } from "@/app/helpers/logger";

export default function SelectedPlace() {
    const { userEmail, selectedPlace, clearSelectedPlace, visitedPlaces, setVisitedPlaces } = useSelectedPlace();
    const panelRef = useRef<HTMLDivElement>(null);
    const justMountedRef = useRef(true);

    const fetchVisitedPlaces = async (email: string) => {
        const visited = await getVisitedPlaces(email);

        const visitedMap = visited.reduce(
            (
                acc: {
                    [slug: string]: boolean;
                },
                slug: string
            ) => {
                acc[slug] = true;
                return acc;
            },
            {}
        );

        setVisitedPlaces(visitedMap);
        localStorage.setItem(
            `visitedPlaces_${userEmail}`,
            JSON.stringify(visitedMap)
        );
    };

    // Load visited places from localStorage
    useEffect(() => {
        if (userEmail) {
            const saved = localStorage.getItem(`visitedPlaces_${userEmail}`);
            if (saved) {
                try {
                    setVisitedPlaces(JSON.parse(saved));
                } catch (error) {
                    loggerError("Error loading visited places:", error);
                    setVisitedPlaces({});
                }
            } else {
                fetchVisitedPlaces(userEmail);
            }
        } else {
            setVisitedPlaces({});
        }
    }, [userEmail]);

    const toggleVisited = async (slug: string) => {
        if (!userEmail) return;

        const isCurrentlyVisited = visitedPlaces[slug];
        const newVisitedPlaces = {
            ...visitedPlaces,
            [slug]: !isCurrentlyVisited,
        };

        // Update local state immediately for responsive UI
        setVisitedPlaces(newVisitedPlaces);
        localStorage.setItem(
            `visitedPlaces_${userEmail}`,
            JSON.stringify(newVisitedPlaces)
        );

        // Sync with DynamoDB
        try {
            if (!isCurrentlyVisited) {
                // Mark as visited
                await saveVisitedPlace(userEmail, slug);
            } else {
                // Mark as not visited
                await removeVisitedPlace(userEmail, slug);
            }
        } catch (error) {
            loggerError("Failed to sync visited state with DynamoDB:", error);
            // todo: Optionally revert local state if DynamoDB operation failed
            // setVisitedPlaces(visitedPlaces);
            // localStorage.setItem(`visitedPlaces_${userEmail}`, JSON.stringify(visitedPlaces));
        }
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
                if (
                    !justMountedRef.current &&
                    panelRef.current &&
                    !panelRef.current.contains(event.target as Node)
                ) {
                    clearSelectedPlace();
                }
            };

            document.addEventListener("mousedown", handleClickOutside);

            return () => {
                clearTimeout(timer);
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [selectedPlace, clearSelectedPlace]);

    if (!selectedPlace) {
        return null;
    }

    const openGoogleMapsHandler = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();
        const url = `https://www.google.com/maps/place/${selectedPlace.address.replace(
            / /g,
            "+"
        )}`;
        window.open(url, "_blank");
    };

    const placeClickHandler = () => {
        window.open(selectedPlace.url, "_blank");
    };

    return (
        <div
            ref={panelRef}
            style={{
                backgroundImage: `url("${selectedPlace.image}")`,
                height: 179,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                position: "relative",
                backgroundColor: "black",
            }}
            onClick={placeClickHandler}
        >
            <h3
                style={{
                    fontSize: 28,
                    fontWeight: "600",
                    color: "white",
                    position: "absolute",
                    bottom: 6,
                    left: 12,
                }}
            >
                {selectedPlace.name}
            </h3>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    width: 48,
                    gap: 6,
                    position: "absolute",
                    top: 12,
                    right: 12,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        height: 48,
                        alignItems: "center",
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
                        justifyContent: "center",
                    }}
                >
                    {selectedPlace.type.toLowerCase() === "restaurant"
                        ? "Food"
                        : selectedPlace.type}
                </div>
                {userEmail && (
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleVisited(selectedPlace.slug);
                        }}
                        style={{
                            background: visitedPlaces[selectedPlace.slug]
                                ? "#4caf50"
                                : "#f5f5f5",
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
                        title={
                            visitedPlaces[selectedPlace.slug]
                                ? "Mark as not visited"
                                : "Mark as visited"
                        }
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
    );
}
