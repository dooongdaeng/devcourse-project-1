const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RsData<T = unknown> {
    resultCode: string;
    msg: string;
    data?: T;
}

interface ApiResponseError extends RsData {
}

export const apiFetch = async <T = unknown>(url: string, options?: RequestInit) => {
    options = options || {};

    options.credentials = "include";

    if(options?.body) {
        const headers = new Headers(options?.headers || {});

        if(!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json; charset=utf-8");
        }

        options.headers = headers;
    }

    const fullUrl = `${NEXT_PUBLIC_API_BASE_URL}${url}`;

    let response: Response;
    let responseData: RsData<T>;

    try {
        response = await fetch(fullUrl, options);
        responseData = await response.json() as RsData<T>;
    } catch (error) {
        console.error('API 요청 중 네트워크 오류 또는 응답 파싱 실패:', error);
        throw { resultCode: 'FETCH_ERROR', msg: '네트워크 오류 또는 응답을 파싱할 수 없습니다.' } as ApiResponseError;
    }

    const newAccessToken = response.headers.get('Authorization');
    if (newAccessToken && newAccessToken.startsWith('Bearer ')) {
        console.log('새로운 액세스 토큰을 응답 헤더에서 받았습니다. 백엔드에서 쿠키로도 설정되었을 것입니다.');
    }

    if (!response.ok) {
        throw responseData as ApiResponseError;
    }
    return responseData;
};