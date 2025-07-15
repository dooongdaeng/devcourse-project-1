"use client";

import Link from "next/link";

export default function Order() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row text-gray-700">
          {/* Product List Section */}
          <div className="md:w-2/3 p-4 md:p-6 flex flex-col items-start">
            <h5 className="text-2xl font-bold mb-4">상품 목록</h5>
            <ul className="w-full">
              {/* Product Item 1 */}
              <li className="flex items-center mt-3 p-2 border-b border-gray-200">
                <div className="w-1/5 md:w-1/6 flex-shrink-0">
                  <img className="w-14 h-14 object-cover rounded" src="https://i.imgur.com/HKOFQYa.jpeg" alt="Product Image" />
                </div>
                <div className="flex-grow ml-4">
                  <div className="text-sm text-gray-500">커피콩</div>
                  <div className="font-semibold">Columbia Nariñó</div>
                </div>
                <div className="text-center font-medium w-1/5 md:w-1/6">5000원</div>
                <div className="text-right w-1/5 md:w-1/6">
                  <button className="px-3 py-1 border border-gray-800 text-gray-800 rounded hover:bg-gray-800 hover:text-white text-sm cursor-pointer">
                    추가
                  </button>
                </div>
              </li>
              {/* Product Item 2 */}
              <li className="flex items-center mt-3 p-2 border-b border-gray-200">
                <div className="w-1/5 md:w-1/6 flex-shrink-0">
                  <img className="w-14 h-14 object-cover rounded" src="https://i.imgur.com/HKOFQYa.jpeg" alt="Product Image" />
                </div>
                <div className="flex-grow ml-4">
                  <div className="text-sm text-gray-500">커피콩</div>
                  <div className="font-semibold">Brazil Serra Do Caparaó</div>
                </div>
                <div className="text-center font-medium w-1/5 md:w-1/6">6000원</div>
                <div className="text-right w-1/5 md:w-1/6">
                  <button className="px-3 py-1 border border-gray-800 text-gray-800 rounded hover:bg-gray-800 hover:text-white text-sm cursor-pointer">
                    추가
                  </button>
                </div>
              </li>
              {/* Product Item 3 */}
              <li className="flex items-center mt-3 p-2 border-b border-gray-200">
                <div className="w-1/5 md:w-1/6 flex-shrink-0">
                  <img className="w-14 h-14 object-cover rounded" src="https://i.imgur.com/HKOFQYa.jpeg" alt="Product Image" />
                </div>
                <div className="flex-grow ml-4">
                  <div className="text-sm text-gray-500">커피콩</div>
                  <div className="font-semibold">Ethiopia Yirgacheffe</div>
                </div>
                <div className="text-center font-medium w-1/5 md:w-1/6">7000원</div>
                <div className="text-right w-1/5 md:w-1/6">
                  <button className="px-3 py-1 border border-gray-800 text-gray-800 rounded hover:bg-gray-800 hover:text-white text-sm cursor-pointer">
                    추가
                  </button>
                </div>
              </li>
            </ul>
          </div>

          {/* Summary Section */}
          <div className="md:w-1/3 bg-gray-100 p-4 md:p-6 rounded-b-xl md:rounded-r-xl md:rounded-bl-none text-gray-700">
            <h5 className="text-2xl font-bold mb-4">Summary</h5>
            <hr className="my-4 border-gray-300" />

            {/* Order Items */}
            <div className="mb-4">
              <h6 className="text-base mb-2">
                Columbia Nariñó <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full ml-2">2개</span>
              </h6>
              <h6 className="text-base mb-2">
                Brazil Serra Do Caparaó <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full ml-2">1개</span>
              </h6>
              <h6 className="text-base mb-2">
                Ethiopia Yirgacheffe <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full ml-2">1개</span>
              </h6>
            </div>

            {/* Form */}
            <form className="space-y-4 mb-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  주소
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
                  우편번호
                </label>
                <input
                  type="text"
                  id="postcode"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-sm text-gray-600">당일 오후 2시 이후의 주문은 다음날 배송을 시작합니다.</p>
            </form>

            {/* Total and Checkout */}
            <div className="flex justify-between items-center pt-4 pb-2 border-t border-gray-300">
              <h5 className="text-lg font-bold">총금액</h5>
              <h5 className="text-lg font-bold">23000원</h5>
            </div>
            <button className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer">
              결제하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
