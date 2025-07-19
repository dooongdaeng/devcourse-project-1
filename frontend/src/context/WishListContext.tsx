"use client";

import { components } from "@/lib/backend/apiV1/schema";
import {useState, useEffect, useCallback, createContext, useContext} from "react";
import { apiFetch } from "@/lib/backend/client";

type WishList = components['schemas']['WishListDto'];

type WishListContextType = {
    wishLists: WishList[];
    isLoading: boolean;
    error: string | null;
    toggleWishList: (productId: number) => Promise<any>;
    deleteWishList: (productId: number) => Promise<any>;
    refetch: () => Promise<void>;
    isInWishList: (productId: number) => boolean;
};

const WishListContext = createContext<WishListContextType | undefined>(undefined);

export function WishListProvider({ children, userId }: {
    children: React.ReactNode;
    userId: number | null;
}) {
    const {
        wishLists,
        isLoading,
        error,
        toggleWishList,
        deleteWishList,
        refetch
    } = useWishList(userId);

    const isInWishList = (productId: number): boolean => {
        if (!userId) return false;
        return wishLists.some(item => item.productId === productId);
    };

    return (
        <WishListContext.Provider value={{
            wishLists,
            isLoading,
            error,
            toggleWishList,
            deleteWishList,
            refetch,
            isInWishList
        }}>
            {children}
        </WishListContext.Provider>
    );
}

export const useWishListContext = () => {
    const context = useContext(WishListContext);
    if (!context) {
        throw new Error("useWishListContext must be used within a WishListProvider");
    }
    return context;
};

export const useWishList = (userId: number | null) => {
    const [wishLists, setWishLists] = useState<WishList[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWishLists = useCallback(async () => {
        if (!userId || userId === 0) {
            setWishLists([]);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await apiFetch(`/api/v1/wish-lists`);
            setWishLists(response?.data || []);
        } catch (err:any) {
            console.error('Failed to fetch wish lists:', err);
            const errorMessage = err?.resultCode && err?.msg
                ? `${err.resultCode}: ${err.msg}`
                : err instanceof Error ? err.message : '찜 목록을 불러오는데 실패했습니다.';
            setError(errorMessage);
            setWishLists([]);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchWishLists();
    }, [fetchWishLists]);


    const toggleWishList = useCallback(async (productId: number) => {
        if (!userId || userId === 0) {
            throw new Error('로그인이 필요합니다.');
        }

        try {
            setError(null);

            const res = await apiFetch('/api/v1/wish-lists/toggle', {
                method: 'POST',
                body: JSON.stringify({ productId })
            });

            await fetchWishLists();
            return res?.data || null;
        } catch (err:any) {
            setError(err?.msg || '찜 변경에 실패했습니다.');
            throw err;
        }
    }, [userId, fetchWishLists]);

    const deleteWishList = useCallback(async (productId: number) => {
        if (!userId || userId === 0) {
            throw new Error('로그인이 필요합니다.');
        }
      
        try {
            setError(null);

            const res = await apiFetch(`/api/v1/wish-lists/${productId}`, {
                method: 'DELETE'
            });
            // 로컬 상태에서 삭제
            setWishLists(prev => prev.filter(item => item.productId !== productId));
            return res?.data || null;
        } catch (err :any) {
            setError(err?.msg || '찜 삭제에 실패했습니다.');
            await fetchWishLists();
            throw err;
        }
    }, [userId, fetchWishLists]);

    return {
        wishLists,
        isLoading,
        error,
        toggleWishList,
        fetchWishLists,
        deleteWishList,
        refetch: fetchWishLists
    };
};