"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import EmailInput from "@/app/components/EmailInput";

interface EmailContextType {
    userEmail: string;
    setUserEmail: (email: string) => void;
    clearEmail: () => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function useEmail() {
    const context = useContext(EmailContext);
    if (context === undefined) {
        throw new Error("useEmail must be used within an EmailProvider");
    }
    return context;
}

interface EmailProviderProps {
    children: ReactNode;
}

export default function EmailProvider({ children }: EmailProviderProps) {
    const [userEmail, setUserEmailState] = useState<string>("");
    const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

    useEffect(() => {
        // Load email from localStorage on mount
        const savedEmail = localStorage.getItem("userEmail");
        if (savedEmail) {
            setUserEmailState(savedEmail);
        }
    }, []);

    const setUserEmail = (email: string) => {
        setUserEmailState(email);
        if (email) {
            localStorage.setItem("userEmail", email);
        } else {
            localStorage.removeItem("userEmail");
        }
    };

    const clearEmail = () => {
        setUserEmailState("");
        localStorage.removeItem("userEmail");
    };

    const handleEmailSubmitted = (email: string) => {
        setUserEmail(email);
        setShowEmailModal(false);
    };

    const handleSignInClick = () => {
        setShowEmailModal(true);
    };

    const handleCloseModal = () => {
        setShowEmailModal(false);
    };

    return (
        <EmailContext.Provider value={{ userEmail, setUserEmail, clearEmail }}>
            {/* Overlay when email modal is open */}
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

            {/* Sign In Button - shown when no email is stored */}
            {!userEmail && (
                <button
                    onClick={handleSignInClick}
                    className="sign-in-btn"
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        backgroundColor: "#4285f4",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        fontSize: "16px",
                        fontWeight: "500",
                        cursor: "pointer",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        minHeight: "48px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        transition: "background-color 0.2s ease",
                    }}
                    title="Sign in to save your favorite places"
                >
                    <span>👤</span>
                    <span>Sign In</span>
                </button>
            )}

            {/* Email Display - shown when email is stored */}
            {userEmail && (
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        zIndex: 1000,
                        backdropFilter: "blur(10px)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        maxWidth: "250px",
                    }}
                >
                    <span style={{ fontSize: "14px", color: "#333" }}>👤</span>
                    <span
                        style={{
                            fontSize: "14px",
                            color: "#333",
                            fontWeight: "500",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                        }}
                    >
                        {userEmail}
                    </span>
                    <button
                        onClick={clearEmail}
                        className="sign-off-btn"
                        style={{
                            background: "none",
                            border: "1px solid #ddd",
                            fontSize: "12px",
                            cursor: "pointer",
                            color: "#666",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            fontWeight: "500",
                            whiteSpace: "nowrap",
                        }}
                        title="Sign off"
                    >
                        Sign Off
                    </button>
                </div>
            )}

            {/* Email Input Modal - shown when showEmailModal is true */}
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
        </EmailContext.Provider>
    );
}
