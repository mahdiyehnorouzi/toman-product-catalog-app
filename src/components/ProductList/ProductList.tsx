import { useCallback, useRef } from "react";
import type { Product } from "../../types";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { ProductRow } from "./ProductRow";

interface ProductListProps {
  products: Product[];
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  status: "idle" | "loading" | "error" | "success" | "pending";
  error: Error | null;
  onDelete: (id: number) => void;
  onEdit?: (product: Product) => void;
}

export function ProductList({
  products,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
  error,
  onDelete,
  onEdit,
}: ProductListProps) {
  const scrollSentinelRef = useRef<HTMLDivElement>(null);
  const canFetchMore = !!(hasNextPage && !isFetchingNextPage);

  const handleIntersect = useCallback(() => {
    if (canFetchMore) {
      fetchNextPage();
    }
  }, [canFetchMore, fetchNextPage]);

  useInfiniteScroll(scrollSentinelRef, handleIntersect, canFetchMore);

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                نام محصول
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                دسته بندی
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                قیمت
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                موجودی
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                وضعیت
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">ویرایش / حذف</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center py-4 text-sm text-gray-600">
        {status === "loading" && <div>در حال بارگذاری...</div>}
        {status === "error" && <div>خطا: {error?.message}</div>}
        {isFetchingNextPage && <p>در حال بارگذاری بیشتر...</p>}
        {!hasNextPage && products.length > 0 && (
          <p>همه محصولات بارگذاری شدند.</p>
        )}
        {!products.length && status === "success" && (
          <p>هیچ محصولی یافت نشد.</p>
        )}
      </div>

      <div ref={scrollSentinelRef} style={{ height: 1 }} />
    </div>
  );
}
