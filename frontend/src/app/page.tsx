"use client";

import { useState } from "react";

export default function Home() {
  type ProductKey = 'product1' | 'product2' | 'product3' | 'product4';

  type LikedProducts = Record<ProductKey, boolean>;

  const [likedProducts, setLikedProducts] = useState<LikedProducts>({
    product1: false,
    product2: false,
    product3: false,
    product4: false,
  });

  const toggleLike = (productName: ProductKey) => {
    setLikedProducts((prev) => ({
      ...prev,
      [productName]: !prev[productName],
    }));
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">제품 소개</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Product 1 */}
        <div className="flex flex-col items-center p-4 border rounded-lg shadow-md">
          <img src="/image1.png" alt="Product 1" className="w-full h-48 object-cover mb-4 rounded" />
          <h2 className="text-xl font-semibold mb-2 flex items-center justify-center">
            <span>제품 1</span>
            <button
              onClick={() => toggleLike('product1')}
              className="ml-2 text-gray-500 text-2xl focus:outline-none cursor-pointer"
            >
              {likedProducts.product1 ? '❤️' : '♡'}
            </button>
          </h2>
          <p className="text-center text-gray-600">이것은 제품 1에 대한 설명입니다. 이 제품은 매우 훌륭합니다.</p>
        </div>

        {/* Product 2 */}
        <div className="flex flex-col items-center p-4 border rounded-lg shadow-md">
          <img src="/image2.png" alt="Product 2" className="w-full h-48 object-cover mb-4 rounded" />
          <h2 className="text-xl font-semibold mb-2 flex items-center justify-center">
            <span>제품 2</span>
            <button
              onClick={() => toggleLike('product2')}
              className="ml-2 text-gray-500 text-2xl focus:outline-none cursor-pointer"
            >
              {likedProducts.product2 ? '❤️' : '♡'}
            </button>
          </h2>
          <p className="text-center text-gray-600">이것은 제품 2에 대한 설명입니다. 이 제품은 혁신적입니다.</p>
        </div>

        {/* Product 3 */}
        <div className="flex flex-col items-center p-4 border rounded-lg shadow-md">
          <img src="/image3.png" alt="Product 3" className="w-full h-48 object-cover mb-4 rounded" />
          <h2 className="text-xl font-semibold mb-2 flex items-center justify-center">
            <span>제품 3</span>
            <button
              onClick={() => toggleLike('product3')}
              className="ml-2 text-gray-500 text-2xl focus:outline-none cursor-pointer"
            >
              {likedProducts.product3 ? '❤️' : '♡'}
            </button>
          </h2>
          <p className="text-center text-gray-600">이것은 제품 3에 대한 설명입니다. 이 제품은 당신의 삶을 변화시킬 것입니다.</p>
        </div>

        {/* Product 4 */}
        <div className="flex flex-col items-center p-4 border rounded-lg shadow-md">
          <img src="/image4.png" alt="Product 4" className="w-full h-48 object-cover mb-4 rounded" />
          <h2 className="text-xl font-semibold mb-2 flex items-center justify-center">
            <span>제품 4</span>
            <button
              onClick={() => toggleLike('product4')}
              className="ml-2 text-gray-500 text-2xl focus:outline-none cursor-pointer"
            >
              {likedProducts.product4 ? '❤️' : '♡'}
            </button>
          </h2>
          <p className="text-center text-gray-600">이것은 제품 4에 대한 설명입니다. 이 제품은 꼭 필요합니다.</p>
        </div>
      </div>
    </main>
  );
}