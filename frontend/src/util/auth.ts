
export const getCookie = (name: string): string | null => {
    if (typeof window === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

export const parseJwtToken = (token: string): any | null => {
    try {
        // JWT는 header.payload.signature 형태
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
};

export const getUserId = (): number | null => {
    if (typeof window === 'undefined') return null;

    // JWT 토큰에서 사용자 ID 추출
    const accessToken = getCookie('accessToken');
    if (accessToken) {
        const payload = parseJwtToken(accessToken);
        if (payload?.id) return payload.id;
    }

    // 세션 스토리지 (임시 fallback - 나중에 제거 예정)
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            if (user.id) return user.id;
        } catch {
            // 파싱 실패
        }
    }

    return null;
};

export const isLoggedIn = (): boolean => {
    return getUserId() !== null;
};