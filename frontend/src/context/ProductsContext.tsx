"use client";

import { components } from "@/lib/backend/apiV1/schema";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/backend/client";

type ProductWithImageUrl = components['schemas']['ProductWithImageUrlDto'];
type ProductImage = components['schemas']['ProductImageDto'];

export const useProduct = () => {
  const [products, setProducts] = useState<ProductWithImageUrl[] | null>(null);

  useEffect(() => {
    apiFetch('/api/v1/products').then(setProducts);
  }, []);

  return products;
};

export const useProductImage = (productId: number) => {
  const [productImages, setProductImages] = useState<ProductImage[] | null>(null);

  useEffect(() => {
    apiFetch(`/api/v1/products/${productId}/images`).then(setProductImages);
  }, []);

  return productImages?.[0]?.url;
}