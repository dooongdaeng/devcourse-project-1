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
    clearWishList: () => Promise<any>;
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
        clearWishList,
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
            clearWishList,
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
            const response = await apiFetch(`/api/v1/wish-lists`);

            if (response?.data) {
                setWishLists(response.data);
            } else {
                setWishLists([]);
            }
        } catch (err:any) {
            console.error('Failed to fetch wish lists:', err);
            if (err?.resultCode && err?.msg) {
                setError(`${err.resultCode}: ${err.msg}`);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error');
            }
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

        setIsLoading(true);
        setError(null);

        try {
            const res = await apiFetch('/api/v1/wish-lists/toggle', {
                method: 'POST',
                body: JSON.stringify({ productId })
            });

            if (res?.resultCode && !res.resultCode.startsWith('2')) {
                throw new Error(res.error.msg || '위시리스트 토글 실패');
            }

            await fetchWishLists();
            return res?.data || null;
        } catch (err:any) {
            const errorMessage = err?.resultCode && err?.msg
                ? `${err.resultCode}: ${err.msg}`
                : err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [userId, fetchWishLists]);

    const deleteWishList = useCallback(async (productId: number) => {
        if (!userId || userId === 0) {
            throw new Error('로그인이 필요합니다.');
        }
        
        setIsLoading(true);
        setError(null);

        try {
            const res = await apiFetch(`/api/v1/wish-lists/${productId}`, {
                method: 'DELETE'
            });

            if (res?.error) {
                throw new Error(res.error.msg || '위시리스트 삭제 실패');
            }

            // 로컬 상태에서 삭제
            setWishLists(prev => prev.filter(item => item.productId !== productId));
            return res?.data || null;
        } catch (err :any) {
            const errorMessage = err?.resultCode && err?.msg
                ? `${err.resultCode}: ${err.msg}`
                : err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }

    }, []);

    // 전체 삭제
    const clearWishList = useCallback(async () => {
        if (!userId || userId ===0) {
            throw new Error('로그인이 필요합니다.');
        }

        setIsLoading(true);
        setError(null);

        try{
            const res = await apiFetch(`/api/v1/wish-lists/clear`, {
                method: 'DELETE'
            });

            if(res?.error){
                throw new Error(res?.error.msg);
            }

            setWishLists([]);
            return res?.data || null;
        } catch (err: any) {
            const errorMessage = err?.resultCode && err?.msg
                ? `${err.resultCode}: ${err.msg}`
                : err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    return {
        wishLists,
        isLoading,
        error,
        toggleWishList,
        fetchWishLists,
        deleteWishList,
        clearWishList,
        refetch: fetchWishLists
    };
};