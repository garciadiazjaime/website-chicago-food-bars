"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Place } from "@/app/support/types";

interface VisitedPlaces {
    [slug: string]: boolean;
}

interface SelectedPlaceContextType {
    selectedPlace: Place | null;
    setSelectedPlace: (place: Place | null) => void;
    clearSelectedPlace: () => void;

    userEmail: string;
    setUserEmail: (email: string) => void;
    showEmailModal: boolean;
    setShowEmailModal: (show: boolean) => void;

    visitedPlaces: VisitedPlaces;
    setVisitedPlaces: (places: VisitedPlaces) => void;
}

const SelectedPlaceContext = createContext<SelectedPlaceContextType | undefined>(undefined);

export function SelectedPlaceProvider({ children }: { children: ReactNode }) {
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [userEmail, setUserEmail] = useState<string>("");
    const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
    const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlaces>({});

    const clearSelectedPlace = () => {
        setSelectedPlace(null);
    };

    return (
        <SelectedPlaceContext.Provider
            value={{
                selectedPlace,
                setSelectedPlace,
                clearSelectedPlace,

                userEmail,
                setUserEmail,
                showEmailModal,
                setShowEmailModal,

                visitedPlaces,
                setVisitedPlaces,
            }}
        >
            {children}
        </SelectedPlaceContext.Provider>
    );
}

export function useSelectedPlace() {
    const context = useContext(SelectedPlaceContext);
    if (context === undefined) {
        throw new Error("useSelectedPlace must be used within a SelectedPlaceProvider");
    }
    return context;
}
