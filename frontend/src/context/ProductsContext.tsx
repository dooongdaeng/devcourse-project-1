"use client";

import { components } from "@/lib/backend/apiV1/schema";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/backend/client";

type ProductWithImageUrl = components['schemas']['ProductWithImageUrlDto'];
type ProductImage = components['schemas']['ProductImageDto'];

export const useProduct = () => {
  const [products, setProducts] = useState<ProductWithImageUrl[] | null>(null);

  useEffect(() => {
    apiFetch('/api/v1/products')
      .then(setProducts)
      .catch((error) => {
        alert(`${error.resultCode} : ${error.msg}`);
      });
  }, []);

  const addProduct = ({name, price, description, stock, imageUrl, onSuccess}: {
    name: string,
    price: number,
    description: string,
    stock: number,
    imageUrl: string,
    onSuccess:(data: any) => void
  }) => {
    apiFetch(`/api/v1/adm/products`, {
      method: "POST",
      body: JSON.stringify({
        name, price, description, stock, imageUrl
      }),
    }).then(onSuccess)
    .catch((error) => {
      alert(`${error.resultCode} : ${error.msg}`);
    });
  }

  return {products, addProduct};
};

export const useProductItem = (id: number) => {
  const [product, setProduct] = useState<ProductWithImageUrl | null>(null);

  useEffect(() => {
    apiFetch(`/api/v1/products/${id}`).then(setProduct);
  }, []);

  const deleteProduct = (onSuccess: (data: any) => void) => {
    apiFetch(`/api/v1/adm/products/${id}`, {
      method: "DELETE"
    }).then(onSuccess)
    .catch((error) => {
      alert(`${error.resultCode} : ${error.msg}`);
    });
  };

  const modifyProduct = ({name, price, description, stock, imageUrl, onSuccess}: {
    name: string,
    price: number,
    description: string,
    stock: number,
    imageUrl: string,
    onSuccess:(data: any) => void
  }) => {
    apiFetch(`/api/v1/adm/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name, price, description, stock, imageUrl
      }),
    }).then(onSuccess)
    .catch((error) => {
      alert(`${error.resultCode} : ${error.msg}`);
    });
  }

  return {product, deleteProduct, modifyProduct}
}

export const useProductImage = (productId: number) => {
  const [productImages, setProductImages] = useState<ProductImage[] | null>(null);

  useEffect(() => {
    apiFetch(`/api/v1/products/${productId}/images`).then(setProductImages);
  }, []);

  return productImages?.[0]?.url;
}