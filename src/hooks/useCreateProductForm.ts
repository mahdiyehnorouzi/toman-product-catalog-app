import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type UseFormRegister, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createProduct } from "../api/products";
import { productSchema, type ProductFormValues } from "../types";
import type { ApiError } from "../api/client";
import type { BackendFieldError, BackendErrorResponse } from "../types";

interface UseCreateProductFormResult {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  isSubmitting: boolean;
  formError: string | null;
  handleFormSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function useCreateProductForm(): UseCreateProductFormResult {
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { status: "Active" },
  });

  const onSubmit = useCallback(
    async (values: ProductFormValues) => {
      setFormError(null);

      if (Number.isNaN(values.price)) {
        setError("price", { type: "manual", message: "قیمت را وارد کنید" });
        return;
      }
      if (Number.isNaN(values.stock_quantity)) {
        setError("stock_quantity", { type: "manual", message: "موجودی را وارد کنید" });
        return;
      }

      const sanitizedValues: ProductFormValues = {
        ...values,
        cost_price: Number.isNaN(values.cost_price!) ? undefined : values.cost_price,
        reorder_level: Number.isNaN(values.reorder_level!) ? undefined : values.reorder_level,
      };

      try {
        await createProduct(sanitizedValues);
        alert("محصول با موفقیت ایجاد شد");
        reset({ status: "Active" });
        navigate("/", { replace: true });
      } catch (error) {
        const apiErr = error as ApiError;
        const details: BackendErrorResponse | undefined = apiErr.details;

        let hasFieldError = false;
        const globalMessages: string[] = [];

        if (details?.errors?.length) {
          details.errors.forEach((err: BackendFieldError) => {
            const fieldName = err.path as keyof ProductFormValues | undefined;

            if (err.type === "field" && fieldName) {
              hasFieldError = true;
              setError(fieldName, {
                type: "server",
                message: err.msg,
              });
            } else if (err.msg) {
              globalMessages.push(err.msg);
            }
          });
        }

        if (details?.message) {
          globalMessages.push(details.message);
        }

        if (globalMessages.length) {
          setFormError(globalMessages.join("، "));
        } else if (!hasFieldError) {
          setFormError("خطای ناشناخته‌ای رخ داد");
        }
      }
    },
    [navigate, reset, setError],
  );

  const handleFormSubmit = handleSubmit(onSubmit);

  return {
    register,
    errors,
    isSubmitting,
    formError,
    handleFormSubmit,
  };
}
