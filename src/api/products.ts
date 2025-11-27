import { apiFetch } from "./client";
import type { ProductsResponse, Product, ProductStatus } from "../types";

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: ProductStatus[];
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  startDate?: string;
  endDate?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Supplier {
  id: string;
  name: string;
}

type QueryPrimitive = string | number;

function buildQueryString(
  params: Record<string, QueryPrimitive | QueryPrimitive[] | undefined>,
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null && v !== "") {
          searchParams.append(key, String(v));
        }
      });
    } else {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}

export function getProducts(
  query: ProductsQueryParams,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  const queryString = buildQueryString(
    query as Record<string, QueryPrimitive | QueryPrimitive[]>,
  );
  const path = queryString ? `/products?${queryString}` : "/products";

  return apiFetch<ProductsResponse>(path, { signal });
}

export function createProduct(payload: Partial<Product>): Promise<Product> {
  return apiFetch<Product>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id: number): Promise<void> {
  return apiFetch<void>(`/products/${id}`, { method: "DELETE" });
}

export const getCategories = (signal?: AbortSignal) =>
  apiFetch<{ data: Category[] }>("/categories", { signal }).then(
    (res) => res.data,
  );

export const getSuppliers = (search?: string, signal?: AbortSignal) =>
  apiFetch<{ data: Supplier[] }>(
    `/suppliers${search ? `?search=${encodeURIComponent(search)}` : ""}`,
    { signal },
  ).then((res) => res.data);

