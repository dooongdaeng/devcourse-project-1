"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { components } from "@/lib/backend/apiV1/schema";
import { useProduct, ProductsProvider } from "@/context/ProductsContext";
import Link from "next/link";
import {useWishListContext, WishListProvider} from "@/context/WishListContext";
import {getUserId} from "@/util/auth";
import {useRouter} from "next/navigation";

export default function ProductsWrapper() {
    const userId =getUserId();

    return (
        <ProductsProvider>
            <WishListProvider userId={userId}>
                <Products />
            </WishListProvider>
        </ProductsProvider>
    );
}

type Product = components['schemas']['ProductWithImageUrlDto'];

function ProductCard({ product }: { product: Product }) {
    const userId = getUserId();
    const router = useRouter();
    const wishListContext = useWishListContext();


    const handleHeartClick = async () => {
        if(!userId){
          alert("로그인 후 찜 기능을 이용할 수 있습니다.");
          router.push('/products');
          return;
        }
        
        try {
          await wishListContext.toggleWishList(product.id);
        } catch (error) {
          console.error('찜 토글 실패:', error);
        }

    };
  return (
    <Link href={`/products/detail/${product.id}`} className="relative block group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
      <div>
        <img src={product.imageUrl} alt={product.name} className="mb-3 h-50 w-full object-cover rounded"/>
        {/*<button onClick={() => toggleFavorite(product.id)} className="cursor-pointer">*/}
        {/*  {favoriteProducts[product.id] ? <FaHeart color="red" /> : <FaRegHeart />}*/}
        {/*</button>*/}
        <button onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleHeartClick();
        }} className="absolute top-46 right-7 p-1 cursor-pointer" disabled={wishListContext?.isLoading || false}>
            {userId && wishListContext?.isInWishList(product.id) ? <FaHeart className="text-red-500 hover:text-red-400" /> : <FaRegHeart className="text-black hover:text-gray-500" />}
        </button>
        <h2 className="mb-3 text-xl font-semibold">
          {product.name}
        </h2>
      </div>
    </Link>
  );
}

export function Products() {
  const {products} = useProduct();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="mb-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-center lg:text-left max-w-5xl mx-auto">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
