"use client";

import { useProducts } from "@/context/ProductContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { components } from "@/lib/backend/apiV1/schema";
import { useProduct, useProductImage } from "@/context/ProductsContext"

type Product = components['schemas']['ProductDto'];

function ProductCard({ product }: { product: Product }) {
  const imageUrl = useProductImage(product.id);
  const { favoriteProducts, toggleFavorite } = useProducts();

  return (
    <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
      <img src={imageUrl} alt={product.name} className="mb-3 h-40 w-full object-cover"/>

      <h2 className="mb-3 text-xl font-semibold">
        {product.name}{" "}
        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }} className="cursor-pointer">
          {favoriteProducts[product.id] ? <FaHeart color="red" /> : <FaRegHeart />}
        </button>
      </h2>
      <p className="m-0 max-w-[30ch] text-sm opacity-50">
        {product.description}
      </p>
    </div>
  );
}

export default function Home() {
  const products = useProduct();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
