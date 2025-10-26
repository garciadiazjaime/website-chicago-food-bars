
export function getMarkerIcon(isSelected: boolean) {
    if (isSelected) {
        return {
            url: `data:image/svg+xml,${encodeURIComponent(`
                    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="18" fill="#ff4444" stroke="#ffffff" stroke-width="4"/>
                        <circle cx="24" cy="24" r="8" fill="#ffffff"/>
                    </svg>
                `)}`,
        };
    }

    return {
        url: `data:image/svg+xml,${encodeURIComponent(`
                <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="16" fill="#4285f4" stroke="#ffffff" stroke-width="3"/>
                    <circle cx="22" cy="22" r="6" fill="#ffffff"/>
                </svg>
            `)}`,
    };
}
