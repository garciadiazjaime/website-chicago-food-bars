import { useEffect } from "react";

import { useSelectedPlace } from "@/app/contexts/SelectedPlaceContext";

export default function Header() {
    const { userEmail, setUserEmail, setShowEmailModal } = useSelectedPlace();

    useEffect(() => {
        const savedEmail = localStorage.getItem("userEmail");
        if (savedEmail) {
            setUserEmail(savedEmail);
        }
    }, []);

    const clearEmail = () => {
        setUserEmail("");
        localStorage.removeItem("userEmail");
    };

    const handleSignInClick = () => {
        setShowEmailModal(true);
    };

    return (
        <header>
            {
                !userEmail && (
                    <div style={{
                        fontSize: 20,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "right",
                        padding: 12
                    }} onClick={handleSignInClick}>sign in</div>
                )
            }

            {/* Email Display - shown when email is stored */}
            {
                userEmail && (
                    <div
                        style={{
                            padding: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "right",
                            height: 48,
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                fontSize: "14px",
                                color: "#333",
                                fontWeight: "500",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {userEmail}
                        </div>
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
                )
            }
        </header >
    );
}
