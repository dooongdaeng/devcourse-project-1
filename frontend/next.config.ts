import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true, // 개발 모드에서 두 번 렌더링하여 잠재적인 문제를 찾는데 도움을 줍니다.
    async rewrites() {
        return [
            {
                source: '/api/v1/:path*', // /api/v1/로 시작하는 모든 요청
                destination: 'http://localhost:8080/api/v1/:path*', // 실제 백엔드 API 서버 주소
            },
        ];
    },
};

export default nextConfig;
