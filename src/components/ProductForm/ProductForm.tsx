import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getSuppliers, type Category, type Supplier } from "../../api/products";
import type { ProductFormValues, ProductStatus } from "../../types";

const PRODUCT_STATUSES: ProductStatus[] = ["Active", "Inactive", "Discontinued"];

interface ProductFormProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export function ProductForm({ register, errors }: ProductFormProps) {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: ({ signal }) => getCategories(signal),
  });
  
  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: ({ signal }) => getSuppliers(undefined, signal),
  });

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="product_name"
          className="block text-sm font-medium text-gray-700"
        >
          نام محصول
        </label>
        <input
          id="product_name"
          type="text"
          {...register("product_name")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        {errors.product_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.product_name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="sku"
          className="block text-sm font-medium text-gray-700"
        >
          SKU
        </label>
        <input
          id="sku"
          type="text"
          placeholder="مثال: ABC-1234"
          {...register("sku")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        {errors.sku && (
          <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
        )}
      </div>

      <div>
  <label
    htmlFor="category"
    className="block text-sm font-medium text-gray-700"
  >
    دسته بندی
  </label>

  <select
    id="category"
    {...register("category")}
    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
  >
    <option value="">انتخاب دسته بندی</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.name}>
        {cat.name}
      </option>
    ))}
  </select>

  {errors.category && (
    <p className="mt-1 text-sm text-red-600">
      {errors.category.message}
    </p>
  )}
</div>



      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          توضیحات (اختیاری)
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          قیمت
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="cost_price"
          className="block text-sm font-medium text-gray-700"
        >
          قیمت تمام شده (اختیاری)
        </label>
        <input
  id="cost_price"
  type="number"
  step="0.01"
  {...register("cost_price", {
    setValueAs: (v) =>
      v === "" || v === null || typeof v === "undefined" ? undefined : Number(v),
  })}
  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
/>
{errors.cost_price && (
  <p className="mt-1 text-sm text-red-600">
    {errors.cost_price.message}
  </p>
)}

      </div>

      <div>
        <label
          htmlFor="stock_quantity"
          className="block text-sm font-medium text-gray-700"
        >
          موجودی
        </label>
        <input
          id="stock_quantity"
          type="number"
          {...register("stock_quantity", { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        {errors.stock_quantity && (
          <p className="mt-1 text-sm text-red-600">
            {errors.stock_quantity.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="reorder_level"
          className="block text-sm font-medium text-gray-700"
        >
          سطح سفارش مجدد (اختیاری)
        </label>
        <input
  id="reorder_level"
  type="number"
  {...register("reorder_level", {
    setValueAs: (v) =>
      v === "" || v === null || typeof v === "undefined" ? undefined : Number(v),
  })}
  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
/>
{errors.reorder_level && (
  <p className="mt-1 text-sm text-red-600">
    {errors.reorder_level.message}
  </p>
)}

      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          وضعیت
        </label>
        <select
          id="status"
          {...register("status")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        >
          <option value="">انتخاب وضعیت</option>
          {PRODUCT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="supplier"
          className="block text-sm font-medium text-gray-700"
        >
          تامین کننده (اختیاری)
        </label>
        <select
          id="supplier"
          {...register("supplier")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        >
          <option value="">انتخاب تامین کننده</option>
          {Array.isArray(suppliers) &&
             suppliers.map((sup) => (
               <option key={sup.id} value={sup.name}>
                  {sup.name}
               </option>
          ))}
        </select>
        {errors.supplier && (
          <p className="mt-1 text-sm text-red-600">
            {errors.supplier.message}
          </p>
        )}
      </div>

    </div>
  );
}
