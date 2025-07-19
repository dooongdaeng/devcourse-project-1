"use client";

import { useProducts } from "@/context/ProductContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { components } from "@/lib/backend/apiV1/schema";
import { useProduct, ProductsProvider } from "@/context/ProductsContext";
import Link from "next/link";
import {useWishListContext, WishListProvider} from "@/context/WishListContext";

export default function ProductsWrapper() {
  return (
    <WishListProvider userId={1}>
        <ProductsProvider>
        <Products />
        </ProductsProvider>
    </WishListProvider>
  );
}

type Product = components['schemas']['ProductWithImageUrlDto'];

function ProductCard({ product }: { product: Product }) {
  //const { favoriteProducts, toggleFavorite } = useProducts();
    const {toggleWishList, isInWishList, isLoading} = useWishListContext();

    const handleHeartClick = async () => {
        try {
            await toggleWishList(product.id);
        } catch (error) {
            console.error('찜 토글 실패:', error);
        }
    };
  return (
    <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
      <Link href={`/products/detail/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} className="mb-3 h-40 w-full object-cover"/>
        <h2 className="mb-3 text-xl font-semibold">
          {product.name}
        </h2>
      </Link>
      {/*<button onClick={() => toggleFavorite(product.id)} className="cursor-pointer">*/}
      {/*  {favoriteProducts[product.id] ? <FaHeart color="red" /> : <FaRegHeart />}*/}
      {/*</button>*/}
        <button onClick={handleHeartClick} className="cursor-pointer" disabled={isLoading}>
            {isInWishList(product.id) ? <FaHeart color="red" /> : <FaRegHeart />}
        </button>
    </div>
  );
}

export function Products() {
  const {products} = useProduct();

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
