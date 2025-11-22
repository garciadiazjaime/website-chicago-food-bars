"use client";

import { ReactNode } from "react";

import EmailInput from "@/app/components/EmailInput";
import { useSelectedPlace } from "@/app/contexts/SelectedPlaceContext";

interface EmailProviderProps {
    children: ReactNode;
}

export default function EmailProvider({ children }: EmailProviderProps) {
    const { showEmailModal, setShowEmailModal, setUserEmailState } = useSelectedPlace();

    const setUserEmail = (email: string) => {
        setUserEmailState(email);
        if (email) {
            localStorage.setItem("userEmail", email);
        } else {
            localStorage.removeItem("userEmail");
        }
    };

    const handleEmailSubmitted = (email: string) => {
        setUserEmail(email);
        setShowEmailModal(false);
    };

    const handleCloseModal = () => {
        setShowEmailModal(false);
    };

    return (<>
        {showEmailModal && (
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1500,
                }}
            />
        )}

        {children}

        {showEmailModal && <EmailInput onEmailSubmitted={handleEmailSubmitted} onClose={handleCloseModal} />}

        <style jsx>{`
                .sign-in-btn:hover {
                    background-color: #3367d6 !important;
                }
                
                .sign-off-btn:hover {
                    background-color: #f5f5f5 !important;
                    border-color: #999 !important;
                }
            `}</style>
    </>
    );
}
