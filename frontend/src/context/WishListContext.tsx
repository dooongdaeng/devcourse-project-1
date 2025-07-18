"use client";

import { components } from "@/lib/backend/apiV1/schema";
import { useState, useEffect } from "react";
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

    useEffect(() => {
        if (userId) {
            apiFetch(`/api/v1/wish-lists?userId=${userId}`).then(setWishLists);
        }
    }, [userId]);



    const createWishList = (wishListData: CreateWishListRequest) => {
        setIsLoading(true);
        setError(null);

        return apiFetch('/api/v1/wish-lists', {
            method: 'POST',
            body: JSON.stringify(wishListData)
        })
            .then((res) => {
                setIsLoading(false);
                if (res.error) {
                    setError(res.error.msg);
                    throw new Error(res.error.msg);
                }
                if (wishLists) {
                    setWishLists([...wishLists, res.data]);
                }
                return res.data;
            });
    };

    const deleteWishList = (wishListId: number) => {
        setIsLoading(true);
        setError(null);

        return apiFetch(`/api/v1/wish-lists/${wishListId}`, {
            method: 'DELETE'
        })
            .then((res) => {
                setIsLoading(false);
                if (res.error) {
                    setError(res.error.msg);
                    throw new Error(res.error.msg);
                }
                if (wishLists) {
                    setWishLists(wishLists.filter(item => item.productId !== wishListId));
                }
                return res.data;
            });
    };


    const deleteAllWishLists = (userId: number) => {
        setIsLoading(true);
        setError(null);

        return apiFetch(`/api/v1/wish-lists/clear?userId=${userId}`, {
            method: 'DELETE'
        })
            .then((res) => {
                setIsLoading(false);
                if (res.error) {
                    setError(res.error.msg);
                    throw new Error(res.error.msg);
                }
                // 전체 삭제 후 목록 초기화
                setWishLists([]);
                return res.data;
            });
    };

    const toggleWishList = (userId: number, productId: number) => {
        setIsLoading(true);
        setError(null);

        return apiFetch('/api/v1/wish-lists/toggle', {
            method: 'POST',
            body: JSON.stringify({ userId, productId })
        })
            .then((res) => {
                setIsLoading(false);
                if (res.error) {
                    setError(res.error.msg);
                    throw new Error(res.error.msg);
                }
                // 토글 후 목록 새로고침
                apiFetch(`/api/v1/wish-lists?userId=${userId}`).then(setWishLists);
                return res.data;
            })
            .catch(err => {
                setIsLoading(false);
                throw err;
            });
    };

    return {
        wishLists,
        createWishList,
        deleteWishList,
        deleteAllWishLists,
        toggleWishList,
        isLoading,
        error
    };
};

// 특정 상품이 위시리스트에 있는지 확인
export const useWishListCheck = (userId: number, productId: number) => {
    const [isInWishList, setIsInWishList] = useState<boolean | null>(null);

    useEffect(() => {
        if (userId && productId) {
            apiFetch(`/api/v1/wish-lists/check?userId=${userId}&productId=${productId}`)
                .then(setIsInWishList);
        }
    }, [userId, productId]);

    return isInWishList;
};

// 위시리스트 개수 조회
export const useWishListCount = (userId: number) => {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        if (userId) {
            apiFetch(`/api/v1/wish-lists/count?userId=${userId}`).then(setCount);
        }
    }, [userId]);

    return count;
};