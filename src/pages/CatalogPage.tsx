import { useCallback, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct, type ProductsQueryParams } from "../api/products";
import useDebounce from "../hooks/useDebounce";
import { ProductList } from "../components/ProductList/ProductList";
import { FiltersPanel } from "../components/ProductList/FiltersPanel";
import type { ProductsResponse, ProductStatus } from "../types";

const PAGE_LIMIT = 20;

function buildQueryFromParams(params: URLSearchParams): ProductsQueryParams {
  const query: ProductsQueryParams = {
    limit: PAGE_LIMIT,
  };

  const search = params.get("search");
  const category = params.get("category");
  const rawStatuses = params.getAll("status");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const minStock = params.get("minStock");
  const maxStock = params.get("maxStock");
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");

  if (search) query.search = search;
  if (category) query.category = category;

  const statuses = rawStatuses.filter(
    (s): s is ProductStatus =>
      s === "Active" || s === "Inactive" || s === "Discontinued",
  );
  if (statuses.length) query.status = statuses;

  if (minPrice) query.minPrice = parseFloat(minPrice);
  if (maxPrice) query.maxPrice = parseFloat(maxPrice);
  if (minStock) query.minStock = parseInt(minStock, 10);
  if (maxStock) query.maxStock = parseInt(maxStock, 10);
  if (startDate) query.startDate = startDate;
  if (endDate) query.endDate = endDate;

  return query;
}

export default function CatalogPage() {
  const [searchParams] = useSearchParams();

  const paramQuery = useMemo(
    () => buildQueryFromParams(searchParams),
    [searchParams],
  );

  const debouncedSearch = useDebounce(paramQuery.search ?? "", 300);

  const queryKey = useMemo(
    () => ["products", { ...paramQuery, search: debouncedSearch }],
    [paramQuery, debouncedSearch],
  );

  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1, signal }) => {
      const query: ProductsQueryParams = {
        ...paramQuery,
        search: debouncedSearch || undefined,
        page: Number(pageParam),
        limit: PAGE_LIMIT,
      };

      return getProducts(query, signal);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: ProductsResponse) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      alert("محصول با موفقیت حذف شد.");
    },
    onError: (err: Error) => {
      alert(err.message || "خطا در حذف محصول.");
    },
  });

  const handleDelete = useCallback(
    (id: number) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  const allProducts =
    data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Product Catalog</h1>
        <Link
          to="/create-product"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          + ایجاد محصول جدید
        </Link>
      </div>
      <FiltersPanel />
      <ProductList
        products={allProducts}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        status={status}
        error={error ?? null}
        onDelete={handleDelete}
      />
    </div>
  );
}
