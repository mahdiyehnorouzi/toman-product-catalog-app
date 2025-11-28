import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/products";
import useDebounce from "../../hooks/useDebounce";
import type { ProductStatus } from "../../types";
import type { Category } from "../../api/products";

const productStatuses: ProductStatus[] = ["Active", "Inactive", "Discontinued"];
const selectBaseClasses =
  "block w-full appearance-none rounded-xl border border-gray-200 bg-gradient-to-br from-white to-indigo-50/40 pr-3 pl-10 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1 focus:ring-offset-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md";

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
          <div className="relative mt-1">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectBaseClasses}
            >
              <option value="">همه</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500 opacity-80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">وضعیت</label>
          <div className="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm">
            <div className="space-y-2">
              {productStatuses.map((s) => (
                <label
                  key={s}
                  htmlFor={`status-${s}`}
                  className="group relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                >
                  <input
                    id={`status-${s}`}
                    type="checkbox"
                    value={s}
                    checked={statuses.includes(s)}
                    onChange={handleStatusChange}
                    className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <span className="flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 text-xs font-semibold text-transparent transition peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 group-hover:border-indigo-400 group-hover:text-indigo-400">
                    ✓
                  </span>
                  <span className="flex-1 pr-3 text-sm font-medium text-gray-800 group-hover:text-indigo-700 peer-checked:text-indigo-700">
                    {s}
                  </span>
                  <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-transparent transition peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2"></span>
                </label>
              ))}
            </div>
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
