"use client";

import { useProductItem } from "@/context/ProductsContext";
import { useParams } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useProducts } from "@/context/ProductContext"; // Assuming this is for favorites

export default function ProductDetail() {
  const params = useParams();
  const id = Number(params.id);

  const { product } = useProductItem(id);
  const { favoriteProducts, toggleFavorite } = useProducts(); // For favorite button

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-4xl rounded-lg border bg-white p-8 shadow-lg dark:border-neutral-700 dark:bg-neutral-800/30">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-auto w-full rounded-lg object-cover shadow-md"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold">
                {product.name}
              </h1>
              <div className="mb-4 flex items-center">
                <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                  ${product.price.toLocaleString()}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="ml-4 cursor-pointer text-2xl"
                >
                  {favoriteProducts[product.id] ? (
                    <FaHeart color="red" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                {product.description}
              </p>
            </div>
            <div className="mt-6 flex gap-4">
              <button className="flex-1 rounded-md border border-gray-300 px-6 py-3 transition hover:bg-gray-100 dark:border-neutral-600 dark:hover:bg-neutral-700 cursor-pointer">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
