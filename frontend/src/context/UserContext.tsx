"use client"; // 이 파일은 클라이언트 컴포넌트입니다.

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. 사용자 정보 타입 정의: 백엔드의 UserDto와 일치해야 합니다.
interface User {
    id: number;
    username: string;
    nickname: string;
    email: string;
    address: string;
    postalCode: string;
    role?: string;
}

// 2. UserContext가 제공할 값의 타입 정의
interface UserContextType {
    user: User | null; // 현재 로그인한 사용자 정보, 없으면 null
    isLoggedIn: boolean; // 로그인 여부
    login: (userData: User) => void; // 로그인 처리 함수
    logout: () => void; // 로그아웃 처리 함수
}

// 3. UserContext 생성
const UserContext = createContext<UserContextType | undefined>(undefined);

// 4. UserProvider 컴포넌트 생성
interface UserProviderProps {
    children: ReactNode; // Provider가 감쌀 React 노드들
}

export const UserProvider = ({ children }: UserProviderProps) => {
    // 사용자 정보와 로그인 상태를 관리하는 useState 훅
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 5. 컴포넌트 초기 마운트 시 sessionStorage에서 사용자 정보 복원
    useEffect(() => {
        if (typeof window !== 'undefined') { // 브라우저 환경에서만 실행되도록 보호
            const savedUser = sessionStorage.getItem('currentUser');
            const savedLoginStatus = sessionStorage.getItem('isLoggedIn');

            if (savedUser && savedLoginStatus === 'true') {
                try {
                    const parsedUser: User = JSON.parse(savedUser);
                    setUser(parsedUser);
                    setIsLoggedIn(true);
                } catch (e) {
                    console.error("SessionStorage에서 사용자 데이터 파싱 실패:", e);
                    // 데이터 파싱 실패 시, 상태 초기화 및 sessionStorage 데이터 제거
                    sessionStorage.removeItem('currentUser');
                    sessionStorage.removeItem('isLoggedIn');
                    setUser(null);
                    setIsLoggedIn(false);
                }
            }
        }
    }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때만 이펙트가 실행됨을 의미

    // 6. 로그인 함수
    const login = (userData: User) => {
        setUser(userData);
        setIsLoggedIn(true);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
            sessionStorage.setItem('isLoggedIn', 'true');
        }
    };

    // 7. 로그아웃 함수
    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('currentUser');
            sessionStorage.removeItem('isLoggedIn');
        }
    };

    // 8. Context에 제공할 최종 값 객체
    const contextValue: UserContextType = {
        user,
        isLoggedIn,
        login,
        logout,
    };

    // 9. Provider를 통해 자식 컴포넌트들에게 `contextValue`를 제공
    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

// 10. useUser 커스텀 훅: UserContext를 쉽게 사용할 수 있도록 돕는 훅
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        // UserProvider로 감싸지지 않은 곳에서 useUser를 사용하려 할 때 에러 발생
        throw new Error('useUser 훅은 UserProvider 안에서 사용되어야 합니다.');
    }
    return context;
};