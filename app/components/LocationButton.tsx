"use client";

import { useState } from "react";

interface LocationButtonProps {
    onLocationFound: (lat: number, lng: number) => void;
}

export default function LocationButton({ onLocationFound }: LocationButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser");
            return;
        }

        setIsLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                onLocationFound(latitude, longitude);
                setIsLoading(false);
            },
            (error) => {
                let errorMessage = "Unable to get your location";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access denied";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information unavailable";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out";
                        break;
                }
                setError(errorMessage);
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes
            }
        );
    };

    return (
        <>
            <button
                onClick={getCurrentLocation}
                disabled={isLoading}
                style={{
                    position: "fixed",
                    top: "20px",
                    right: "20px",
                    backgroundColor: isLoading ? "#ccc" : "#4285f4",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "500",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minHeight: "48px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    transition: "background-color 0.2s ease",
                }}
                title="Center map on your location"
            >
                {isLoading ? (
                    <>
                        <span style={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid #fff",
                            borderTop: "2px solid transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite"
                        }} />
                        <span>Finding...</span>
                    </>
                ) : (
                    <>
                        <span>📍</span>
                        <span>My Location</span>
                    </>
                )}
            </button>

            {error && (
                <div
                    style={{
                        position: "fixed",
                        top: "80px",
                        right: "20px",
                        backgroundColor: "#ff4444",
                        color: "white",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        zIndex: 1000,
                        maxWidth: "250px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    }}
                >
                    {error}
                    <button
                        onClick={() => setError(null)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "white",
                            marginLeft: "8px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}
