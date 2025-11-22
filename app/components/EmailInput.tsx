"use client";

import { useState } from "react";

interface EmailInputProps {
    onEmailSubmitted: (email: string) => void;
    onClose: () => void;
}

export default function EmailInput({ onEmailSubmitted, onClose }: EmailInputProps) {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            onEmailSubmitted(email.trim());
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                padding: "32px",
                borderRadius: "16px",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                zIndex: 2000,
                backdropFilter: "blur(10px)",
                minWidth: "320px",
                maxWidth: "90vw",
            }}
        >
            <button
                onClick={onClose}
                className="close-btn"
                style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#666",
                    padding: "10px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.2s ease",
                    minWidth: "44px",
                    minHeight: "44px",
                }}
                title="Close"
            >
                ✕
            </button>
            <br /><br />
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    className="email-input"
                    style={{
                        width: "100%",
                        padding: "14px 16px",
                        fontSize: "16px",
                        border: "2px solid #e1e5e9",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                        fontFamily: "inherit",
                    }}
                />
                <button
                    type="submit"
                    className="submit-btn"
                    style={{
                        width: "100%",
                        padding: "14px 16px",
                        fontSize: "16px",
                        fontWeight: "600",
                        backgroundColor: "#4285f4",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                        fontFamily: "inherit",
                    }}
                >
                    log in
                </button>
            </form>

            <style jsx>{`
                .close-btn:hover {
                    background-color: #f0f0f0 !important;
                }
                
                .email-input:focus {
                    border-color: #4285f4 !important;
                }
                
                .submit-btn:hover {
                    background-color: #3367d6 !important;
                }
            `}</style>
        </div>
    );
}
