"use client";

import { useProductItem, useProductImage } from "@/context/ProductsContext";
import {useParams, useRouter} from "next/navigation";
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react"
// import { useProducts } from "@/context/ProductContext"; // Assuming this is for favorites
import Link from "next/link";
import {useWishListContext, WishListProvider} from "@/context/WishListContext";
import {getUserId} from "@/util/auth";

export default function ProductDetailWrapper() {
  const userId = getUserId();

  return (
      <>
        <WishListProvider userId={userId}>
          <ProductDetail />
        </WishListProvider>
      </>

  );
}

function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const userId = getUserId();

  const { product } = useProductItem(id);
  // const { favoriteProducts, toggleFavorite } = useProducts(); // For favorite button
  const wishListContext = useWishListContext();
  const { productImages } = useProductImage(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if(!product) {
      alert("상품을 불러올 수 없습니다.")
      return;
    }

    if(!userId) {
        alert("로그인 후 찜 기능을 이용할 수 있습니다.");
        router.push('/products/detail/' + product.id);
        return;
    }

    try {
      await wishListContext.toggleWishList(product.id);
    } catch (error) {
      console.error('찜 토글 실패:', error);
    }
  };
  
  if (!product || !productImages) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div>Loading...</div>
      </main>
    );
  }

  const goToPrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-4xl rounded-lg border bg-white p-8 shadow-lg dark:border-neutral-700">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="relative">
            {productImages.length > 0 && (
              <>
                <img
                  src={productImages[currentImageIndex].url}
                  alt={`${product.name} - 이미지 ${currentImageIndex + 1}`}
                  className="h-auto w-full rounded-lg object-cover shadow-md text-gray-700"
                />
                
                {/* 이미지가 2개 이상일 때만 네비게이션 버튼 표시 */}
                {productImages.length > 1 && (
                  <>
                    {/* 이전 버튼 */}
                    <button
                      onClick={goToPrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors cursor-pointer"
                      aria-label="이전 이미지"
                    >
                      <FaChevronLeft size={16} />
                    </button>
                    
                    {/* 다음 버튼 */}
                    <button
                      onClick={goToNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors cursor-pointer"
                      aria-label="다음 이미지"
                    >
                      <FaChevronRight size={16} />
                    </button>
                    
                    {/* 이미지 인디케이터 */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {productImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex 
                              ? 'bg-white' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`이미지 ${index + 1}로 이동`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
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
                  onClick={handleHeartClick}
                    disabled={wishListContext?.isLoading || false}
                  className = "ml-4 cursor-pointer text-2xl text-gray-700 disabled:opacity-50"
                  >
                  {userId && wishListContext?.isInWishList(product.id) ? (
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
