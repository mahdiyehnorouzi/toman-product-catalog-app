import { ProductForm } from "../components/ProductForm/ProductForm";
import { useCreateProductForm } from "../hooks/useCreateProductForm";

export default function CreateProductPage() {
  const { register, errors, isSubmitting, formError, handleFormSubmit } =
    useCreateProductForm();

  return (
    <div className="mx-auto max-w-xl p-4">
      <h1 className="mb-4 text-xl font-bold">ایجاد محصول جدید</h1>

      {formError && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
          {formError}
        </div>
      )}

      <form onSubmit={handleFormSubmit} noValidate>
        <ProductForm register={register} errors={errors} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "در حال ایجاد..." : "ایجاد محصول"}
        </button>
      </form>
    </div>
  );
}
