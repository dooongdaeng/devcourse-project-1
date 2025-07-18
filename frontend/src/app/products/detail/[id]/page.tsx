"use client";

import { useProductItem } from "@/context/ProductsContext";
import { useParams } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useProducts } from "@/context/ProductContext"; // Assuming this is for favorites
import Link from "next/link";

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
      <div className="w-full max-w-4xl rounded-lg border bg-white p-8 shadow-lg dark:border-neutral-700">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-auto w-full rounded-lg object-cover shadow-md text-gray-700"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="mb-2 text-3xl text-gray-700 font-bold">
                {product.name}
              </h1>
              <div className="mb-4 flex items-center">
                <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                  {product.price.toLocaleString()}원
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="ml-4 cursor-pointer text-2xl text-gray-700"
                >
                  {favoriteProducts[product.id] ? (
                    <FaHeart color="red" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>
              <p className="mb-4 text-gray-700">
                {product.description}
              </p>
            </div>
            <Link href="/order" className="mt-6 flex gap-4">
              <button className="text-white flex-1 rounded-md px-6 py-3 transition bg-blue-800 hover:bg-blue-950 cursor-pointer">
                구매하기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
