"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Place } from "@/app/support/types";

interface SelectedPlaceContextType {
    selectedPlace: Place | null;
    setSelectedPlace: (place: Place | null) => void;
    clearSelectedPlace: () => void;

    userEmail: string;
    setUserEmailState: (email: string) => void;
    showEmailModal: boolean;
    setShowEmailModal: (show: boolean) => void;
}

const SelectedPlaceContext = createContext<SelectedPlaceContextType | undefined>(undefined);

export function SelectedPlaceProvider({ children }: { children: ReactNode }) {
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [userEmail, setUserEmailState] = useState<string>("");
    const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

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
                setUserEmailState,
                showEmailModal,
                setShowEmailModal
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
