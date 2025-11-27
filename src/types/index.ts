import { z } from "zod";

export type ProductStatus = "Active" | "Inactive" | "Discontinued";

export interface Product {
  id: number;
  product_name: string;
  sku: string;
  category: string;
  description?: string;
  price: number;
  cost_price?: number;
  stock_quantity: number;
  reorder_level?: number;
  status: ProductStatus;
  tags?: string[];
  supplier?: string;
  notes?: string;
  last_updated: string;
  created_at: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

const skuRegex = /^[A-Z]{3}-\d{4}$/;

export const productSchema = z
  .object({
    product_name: z.string().min(3, "نام باید حداقل ۳ کاراکتر باشد"),
    sku: z
      .string()
      .regex(skuRegex, "SKU باید در فرمت XXX-#### باشد (مثال: ABC-1234)"),
    category: z.string().min(1, "دسته بندی الزامی است"),
    description: z
      .string()
      .max(500, "توضیحات نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد")
      .optional(),
    price: z
      .number()
      .min(0.01, "قیمت باید حداقل ۰.۰۱ باشد")
      .max(999999.99, "قیمت نمی‌تواند بیشتر از ۹۹۹۹۹۹.۹۹ باشد"),

    cost_price: z
      .number()
      .optional()
      .refine((val) => val === undefined || !Number.isNaN(val), {
        message: "قیمت تمام شده نامعتبر است",
      }),

    stock_quantity: z.number().int().min(0, "موجودی باید حداقل ۰ باشد"),

    reorder_level: z
      .number()
      .optional()
      .refine((val) => val === undefined || !Number.isNaN(val), {
        message: "سطح سفارش مجدد نامعتبر است",
      }),

    status: z.enum(["Active", "Inactive", "Discontinued"], {
      message: "وضعیت نامعتبر است",
    }),
    tags: z.array(z.string()).optional(),
    supplier: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      typeof data.cost_price === "number" &&
      !Number.isNaN(data.cost_price) &&
      data.cost_price >= data.price
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cost_price"],
        message: "قیمت تمام شده باید کمتر از قیمت فروش باشد",
      });
    }

    if (
      typeof data.reorder_level === "number" &&
      !Number.isNaN(data.reorder_level) &&
      data.reorder_level >= data.stock_quantity
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reorder_level"],
        message: "سطح سفارش مجدد باید کمتر از موجودی باشد",
      });
    }
  });


export type ProductFormValues = z.infer<typeof productSchema>;


export interface BackendFieldError {
  type: "field" | string;
  msg: string;
  path?: string;
  value?: unknown;
  location?: string;
}

export interface BackendErrorResponse {
  errors?: BackendFieldError[];
  message?: string;
}