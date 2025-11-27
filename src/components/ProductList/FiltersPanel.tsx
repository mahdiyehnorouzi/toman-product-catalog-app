import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/products";
import useDebounce from "../../hooks/useDebounce";
import type { ProductStatus } from "../../types";
import type { Category } from "../../api/products";

const productStatuses: ProductStatus[] = ["Active", "Inactive", "Discontinued"];

export function FiltersPanel() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchText, setSearchText] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [statuses, setStatuses] = useState<ProductStatus[]>(
    (searchParams.getAll("status") as ProductStatus[]) ?? [],
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [minStock, setMinStock] = useState(searchParams.get("minStock") ?? "");
  const [maxStock, setMaxStock] = useState(searchParams.get("maxStock") ?? "");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: ({ signal }) => getCategories(signal),
  });

  const debouncedSearchText = useDebounce(searchText, 500);
  const debouncedMinPrice = useDebounce(minPrice, 800);
  const debouncedMaxPrice = useDebounce(maxPrice, 800);
  const debouncedMinStock = useDebounce(minStock, 800);
  const debouncedMaxStock = useDebounce(maxStock, 800);

  const searchParamsString = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    const next = new URLSearchParams();

    if (debouncedSearchText.trim()) next.set("search", debouncedSearchText.trim());
    if (category) next.set("category", category);

    statuses.forEach((s) => next.append("status", s));

    if (debouncedMinPrice) next.set("minPrice", debouncedMinPrice);
    if (debouncedMaxPrice) next.set("maxPrice", debouncedMaxPrice);
    if (debouncedMinStock) next.set("minStock", debouncedMinStock);
    if (debouncedMaxStock) next.set("maxStock", debouncedMaxStock);

    const nextString = next.toString();
    if (nextString !== searchParamsString) {
      setSearchParams(next, { replace: true });
    }
  }, [
    debouncedSearchText,
    category,
    statuses,
    debouncedMinPrice,
    debouncedMaxPrice,
    debouncedMinStock,
    debouncedMaxStock,
    searchParamsString,
    setSearchParams,
  ]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setStatuses((prev) =>
      checked
        ? [...prev, value as ProductStatus]
        : prev.filter((s) => s !== value),
    );
  };

  const handleClearFilters = () => {
    setSearchText("");
    setCategory("");
    setStatuses([]);
    setMinPrice("");
    setMaxPrice("");
    setMinStock("");
    setMaxStock("");
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-bold">فیلتر محصولات</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            جستجو (نام محصول، SKU)
          </label>
          <input
            id="search"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="جستجو..."
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            دسته‌بندی
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option value="">همه</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">وضعیت</label>
          <div className="mt-1 space-y-2">
            {productStatuses.map((s) => (
              <div key={s} className="flex items-center">
                <input
                  id={`status-${s}`}
                  type="checkbox"
                  value={s}
                  checked={statuses.includes(s)}
                  onChange={handleStatusChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={`status-${s}`}
                  className="mr-2 block text-sm text-gray-900"
                >
                  {s}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
            حداقل قیمت
          </label>
          <input
            id="minPrice"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
            حداکثر قیمت
          </label>
          <input
            id="maxPrice"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="999999.99"
          />
        </div>

        <div>
          <label htmlFor="minStock" className="block text-sm font-medium text-gray-700">
            حداقل موجودی
          </label>
          <input
            id="minStock"
            type="number"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="maxStock" className="block text-sm font-medium text-gray-700">
            حداکثر موجودی
          </label>
          <input
            id="maxStock"
            type="number"
            value={maxStock}
            onChange={(e) => setMaxStock(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="999999"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleClearFilters}
          className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          پاک کردن فیلترها
        </button>
      </div>
    </div>
  );
}
