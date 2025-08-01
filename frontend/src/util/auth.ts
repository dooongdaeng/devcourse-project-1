
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

    // 1. JWT 토큰에서 사용자 ID 추출 (현재는 HttpOnly라 접근 불가)
    const accessToken = getCookie('accessToken');
    if (accessToken) {
        const payload = parseJwtToken(accessToken);
        if (payload?.id) return payload.id;
    }

    /// 2. sessionStorage에서 사용자 정보 확인 (현재 주 사용 방식)
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