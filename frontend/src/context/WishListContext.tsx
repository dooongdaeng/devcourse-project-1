"use client";

import { components } from "@/lib/backend/apiV1/schema";
import {useState, useEffect, useCallback} from "react";
import { apiFetch } from "@/lib/backend/client";

type WishList = components['schemas']['WishListDto'];

export type CreateWishListRequest = {
    userId: number;
    productId: number;
};


export const useWishList = (userId: number) => {
    const [wishLists, setWishLists] = useState<WishList[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWishLists = useCallback(async () => {
        if (!userId) return;

        try {
            setIsLoading(true);
            const data = await apiFetch(`/api/v1/wish-lists?userId=${userId}`);
            setWishLists(data);
        } catch (err) {
            console.error('Failed to fetch wish lists:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchWishLists();
    }, [fetchWishLists]);


    const toggleWishList = useCallback(async (productId: number) => {
        if (!userId) {
            throw new Error('로그인이 필요합니다.');
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await apiFetch('/api/v1/wish-lists/toggle', {
                method: 'POST',
                body: JSON.stringify({ userId, productId })
            });

            if (res.error) {
                throw new Error(res.error.msg);
            }

            await fetchWishLists();
            return res.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [userId, fetchWishLists]);

    const deleteWishList = useCallback(async (productId: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await apiFetch(`/api/v1/wish-lists/${productId}`, {
                method: 'DELETE'
            });

            if (res.error) {
                throw new Error(res.error.msg);
            }

            // 로컬 상태에서 삭제
            setWishLists(prev => prev.filter(item => item.productId !== productId));
            return res.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }

    }, []);

    // 전체 삭제
    const deleteAllWishLists= useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        setError(null);

        try{
            const res = await apiFetch(`/api/v1/wish-lists/clear?userId=${userId}`, {
                method: 'DELETE'
            });

            if(res.error){
                throw new Error(res.error.msg);
            }

            setWishLists([]);
            return res.data;
        } catch(err){
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
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
        deleteAllWishLists,
        refetch: fetchWishLists
    };
};


// 특정 상품이 위시리스트에 있는지 상태 확인
export const useWishListStatus = (userId: number, productId: number) => {
    const [isInWishList, setIsInWishList] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    const checkWishListStatus = useCallback(async () => {
        if (!userId || !productId) {
            setIsInWishList(false);
            return;
        }
        try {
            setIsLoading(true);
            const result = await apiFetch(`/api/v1/wish-lists/check?userId=${userId}&productId=${productId}`);
            setIsInWishList(result);
        } catch (err) {
            console.error('Failed to check wish list status:', err);
            setIsInWishList(false);
        } finally {
            setIsLoading(false);
        }
    }, [userId, productId]);

    useEffect(() => {
        checkWishListStatus();
    }, [checkWishListStatus]);

    return {
        isInWishList,
        isLoading,
        refresh : checkWishListStatus
    };
};

// 찜 개수 조회
export const useWishListCount = (userId: number) => {
    const [count, setCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCount = useCallback(async () => {
        if(!userId){
            setCount(0);
            return;
        }

        try {
            setIsLoading(true);
            const result = await apiFetch(`/api/v1/wish-lists/count?userId=${userId}`);
            setCount(result || 0);
        } catch (err) {
            console.error('Failed to fetch wish list count:', err);
            setCount(0);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchCount();
    }, [fetchCount]);

    return {
        count,
        isLoading,
        refetch: fetchCount
    }
};