"use client";

import { components } from "@/lib/backend/apiV1/schema";
import { useState, useEffect, createContext, useContext } from "react";
import { apiFetch } from "@/lib/backend/client";

type Product = components['schemas']['ProductWithImageUrlDto'];
type ProductImage = components['schemas']['ProductImageDto'];

type ProductsContextType = {
  products: Product[] | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[] | null>>;
  addProduct: (...args: any[]) => void;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[] | null>(null);

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

  return (
    <ProductsContext.Provider value={{ products, setProducts, addProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProduct = () => {
  const context = useContext(ProductsContext);
  if(!context) throw new Error("useProduct must be used within a ProductsProvider");
  return context;
}

export const useProductItem = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);

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

  const firstImage = productImages?.[0]?.url;

  return { productImages, firstImage };
}

export const useProductImageItem = (productId: number, id: number) => {
  const [productImage, setProductImage] = useState<ProductImage>();

  useEffect(() => {
    apiFetch(`/api/v1/products/${productId}/images/${id}`).then(setProductImage);
  }, []);

  const deleteProductImage = (onSuccess: (data: any) => void) => {
    apiFetch(`/api/v1/adm/products/${productId}/images/${id}`, {
      method: "DELETE"
    }).then(onSuccess)
    .catch((error) => {
      alert(`${error.resultCode} : ${error.msg}`);
    });
  };

  return {productImage, deleteProductImage};
}