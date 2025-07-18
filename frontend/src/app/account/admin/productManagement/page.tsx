"use client";

import { useState, ChangeEvent, useRef } from 'react';
import { useProductItem, useProduct, ProductsProvider, useProductImage, useProductImageItem } from '@/context/ProductsContext';
import type { components } from '@/lib/backend/apiV1/schema';

export default function ProductManagementWrapper() {
  return (
    <ProductsProvider>
      <ProductManagement />
    </ProductsProvider>
  );
}

type Product = components['schemas']['ProductWithImageUrlDto'];
type ProductImageDto = components['schemas']['ProductImageDto'];

type ProductImage = {
  id?: number; // 기존 이미지의 경우 ID 존재
  url: string;
  isNew: boolean; // 새로 추가된 이미지인지 여부
  toDelete: boolean; // 삭제 예정인지 여부
};

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  productImages: ProductImage[]; // 이미지 객체 배열로 변경
};

type ProductFormProps = {
  editingProduct: Product | null;
  onCancel: () => void;
  onSubmit: () => void;
};

function ProductForm({ editingProduct, onCancel, onSubmit }: ProductFormProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const stockInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const { productImages, addProductImage } = useProductImage((editingProduct != null) ? editingProduct.id : -1);

  const initialProductFormState: ProductFormState = {
    name: '',
    description: '',
    price: '',
    stock: '',
    productImages: [{ url: '', isNew: true, toDelete: false }] // 초기값으로 새 이미지 하나
  };

  const [formState, setFormState] = useState<ProductFormState>(
    editingProduct
      ? {
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price.toString(),
          stock: editingProduct.stock.toString(),
          // 기존 상품의 이미지들을 ProductImage 형태로 변환
          // editingProduct.productImages가 있다면 사용, 없다면 imageUrl 사용
          productImages: productImages 
            ? productImages.map((img: ProductImageDto) => ({
                id: img.id,
                url: img.url,
                isNew: false,
                toDelete: false
              }))
            : [{ url: editingProduct.imageUrl, isNew: false, toDelete: false }]
        }
      : initialProductFormState
  );

  const { addProduct, products, setProducts } = useProduct();
  const { modifyProduct } = useProductItem((editingProduct != null) ? editingProduct.id : 1);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 URL 변경 핸들러
  const handleImageUrlChange = (index: number, value: string) => {
    setFormState((prev) => ({
      ...prev,
      productImages: prev.productImages.map((img, i) => 
        i === index ? { ...img, url: value } : img
      )
    }));
  };

  // 새 이미지 URL 필드 추가
  const addImageUrlField = () => {
    setFormState((prev) => ({
      ...prev,
      productImages: [...prev.productImages, { url: '', isNew: true, toDelete: false }]
    }));
  };

  // 이미지 삭제 처리 (실제 삭제가 아닌 삭제 예정으로 마킹)
  const markImageForDeletion = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      productImages: prev.productImages.map((img, i) => 
        i === index ? { ...img, toDelete: true } : img
      )
    }));
  };

  // 삭제 예정인 이미지를 복원
  const restoreImage = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      productImages: prev.productImages.map((img, i) => 
        i === index ? { ...img, toDelete: false } : img
      )
    }));
  };

  // 새로 추가된 이미지를 완전히 제거
  const removeNewImage = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index)
    }));
  };

  // 활성 이미지 개수 계산 (삭제 예정이 아닌 이미지들)
  const getActiveImageCount = () => {
    return formState.productImages.filter(img => !img.toDelete).length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = formState.name;
    const description = formState.description;
    const price = parseInt(formState.price, 10);
    const stock = parseInt(formState.stock, 10);
    
    // 활성 이미지들 (삭제 예정이 아닌 것들)
    const activeImages = formState.productImages.filter(img => !img.toDelete);
    
    // 첫 번째 이미지 URL (대표 이미지)
    const imageUrl = (activeImages.length > 0 && activeImages[0].url.length > 0) 
      ? activeImages[0].url 
      : "http://localhost:8080/images/coffee_default.jpg";

    // 이미지 처리 로직
    const imagesToAdd = formState.productImages.filter(img => img.isNew && !img.toDelete && img.url.trim() !== '');
    const imagesToDelete = formState.productImages.filter(img => img.id && img.toDelete);
    const imagesToUpdate = formState.productImages.filter(img => !img.isNew && !img.toDelete && img.id);

    if (name.length < 2 || name.length > 100) {
      alert("상품명은 2자 이상 100자 이하로 입력해주세요.");
      nameInputRef.current?.focus();
      return;
    }

    if (description.length < 2 || description.length > 500) {
      alert("상품 설명은 2자 이상 500자 이하로 입력해주세요.");
      descriptionInputRef.current?.focus();
      return;
    }

    if (isNaN(price) ) {
      alert("상품 가격은 숫자로만 입력해주세요.");
      priceInputRef.current?.focus();
      return;
    }

    if (price < 100 || price > 1000000) {
      alert("상품 가격은 100원 이상 1,000,000원 이하로 입력해주세요.");
      priceInputRef.current?.focus();
      return;
    }

    if (isNaN(stock) ) {
      alert("상품 재고는 숫자로만 입력해주세요.");
      stockInputRef.current?.focus();
      return;
    }

    if (stock < 1 || stock > 10000) {
      alert("상품 재고는 1 이상 10000 이하로 입력해주세요.");
      stockInputRef.current?.focus();
      return;
    }

    if (editingProduct) {
      // 상품 수정 시 이미지 처리 로직
      modifyProduct({
        name, 
        price, 
        description, 
        stock, 
        imageUrl, 
        onSuccess: (res) => {
          alert(res.msg);
          if(products == null) return;
          const updatedProduct = res.data;
          setProducts(products.map((product) => product.id === updatedProduct.id ? updatedProduct : product));
        }
      });

      imagesToAdd.map((img) => {
        const url = img.url;
        addProductImage({url, onSuccess: (res) => alert(res.msg)});
      })

      imagesToDelete.map((img) => {
        DeleteProductImage(editingProduct, (img.id !== undefined) ? img.id : -1);
      })

    } else {
      // 새 상품 추가 시
      addProduct({
        name, 
        price, 
        description, 
        stock, 
        imageUrl, 
        additionalImages: imagesToAdd.slice(1).map(img => img.url), // 첫 번째 제외하고 추가 이미지들
        onSuccess: (res) => {
          alert(res.msg);
          if(products == null) return;
          setProducts([...products, res.data]);
        }
      });
    }

    onSubmit();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-6 mb-6 p-6 bg-gray-50 rounded-md border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-700 mb-4">
          {editingProduct ? '상품 정보 수정' : '새 상품 정보 입력'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
            <input type="text" name="name" id="name" ref={nameInputRef} autoFocus
              value={formState.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">가격 (원)</label>
            <input type="number" name="price" id="price" ref={priceInputRef}
              value={formState.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">재고</label>
            <input type="number" name="stock" id="stock" ref={stockInputRef}
              value={formState.stock}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
            />
          </div>
          <div>
            <div className="flex items-center mb-2">
              <label className="text-sm font-medium text-gray-700">상품 이미지 URL</label>
              <button 
                type="button" 
                onClick={addImageUrlField} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold w-6 h-6 ml-2 rounded-full cursor-pointer flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
            {formState.productImages.map((image, index) => (
              <div key={index} className={`flex items-center mb-2 ${image.toDelete ? 'opacity-50' : ''}`}>
                <div className="flex-1 flex items-center">
                  {index === 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                      대표
                    </span>
                  )}
                  <input 
                    type="text" 
                    placeholder="https://example.com/image.png"
                    value={image.url}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    disabled={image.toDelete}
                    className={`flex-1 p-2 border border-gray-300 rounded-md text-gray-900 bg-white ${
                      image.toDelete ? 'bg-gray-100' : ''
                    }`}
                  />
                </div>
                <div className="ml-2 flex items-center">
                  {image.toDelete ? (
                    <button 
                      type="button" 
                      onClick={() => restoreImage(index)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-2 py-1 rounded text-xs cursor-pointer"
                    >
                      복원
                    </button>
                  ) : (
                    <>
                      {/* 첫 번째 이미지(대표 이미지)가 아니거나, 활성 이미지가 2개 이상일 때만 삭제 버튼 표시 */}
                      {(index !== 0 || getActiveImageCount() > 1) && (
                        <button 
                          type="button" 
                          onClick={() => image.isNew ? removeNewImage(index) : markImageForDeletion(index)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold w-6 h-6 rounded-full cursor-pointer flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            {/* 삭제 예정인 이미지들 안내 */}
            {formState.productImages.some(img => img.toDelete) && (
              <div className="text-xs text-gray-500 mt-2">
                * 회색으로 표시된 이미지는 저장 시 삭제됩니다.
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">상품 설명</label>
            <textarea
              name="description" id="description" rows={3} ref={descriptionInputRef}
              value={formState.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
            {editingProduct ? '수정 완료' : '저장'}
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
            취소
          </button>
        </div>
      </form>
    </>
  );
}

function DeleteProductImage( editingProduct: Product, id: number ) {
  const { deleteProductImage } = useProductImageItem(editingProduct?.id, id);
  deleteProductImage((res) => alert(res.msg))
}

function ProductList({ onEditClick }: { onEditClick: (product: Product) => void }) {
  const { products } = useProduct();
  
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">상품명</th>
              <th className="py-3 px-6 text-left">가격</th>
              <th className="py-3 px-6 text-left">재고</th>
              <th className="py-3 px-6 text-center">액션</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {products?.map(product => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left whitespace-nowrap">{product.id}</td>
                <td className="py-3 px-6 text-left">{product.name}</td>
                <td className="py-3 px-6 text-left">{product.price}원</td>
                <td className="py-3 px-6 text-left">{product.stock}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => onEditClick(product)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2 cursor-pointer"
                  >
                    수정
                  </button>
                  <DeleteButton productId={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DeleteButton({ productId }: { productId: number }) {
  const { deleteProduct } = useProductItem(productId);
  const { products, setProducts } = useProduct();

  const handleDelete = () => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      deleteProduct((res) => {
        alert(res.msg);
        if(products == null) return;
        setProducts(products.filter((product) => product.id !== productId));
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs cursor-pointer"
    >
      삭제
    </button>
  );
}

export function ProductManagement() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmitSuccess = () => {
    setEditingProduct(null);
    setShowForm(false);
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">상품 관리</h2>

        {showForm && (
          <ProductForm
            editingProduct={editingProduct}
            onCancel={handleCancel}
            onSubmit={handleSubmitSuccess}
          />
        )}

        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-700">상품 목록</h3>
            <button
              onClick={handleAddNewClick}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              새 상품 추가
            </button>
          </div>

          <ProductList onEditClick={handleEditClick} />
        </section>
      </div>
    </main>
  );
}