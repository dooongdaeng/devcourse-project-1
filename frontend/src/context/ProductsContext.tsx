"use client";

import { components } from "@/lib/backend/apiV1/schema";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/backend/client";

type Product = components['schemas']['ProductDto'];

export const useProduct = () => {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    apiFetch('/api/v1/products').then(setProducts);
  }, []);

  return products;
};