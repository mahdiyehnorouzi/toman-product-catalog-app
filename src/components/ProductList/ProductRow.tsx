import { memo, useCallback, useState } from "react";
import type { Product, ProductStatus } from "../../types";
import { Modal } from "../ui/Modal";

interface ProductRowProps {
  product: Product;
  onDelete: (id: number) => void;
  onEdit?: (product: Product) => void;
}

function getStatusBadgeClasses(status: ProductStatus): string {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Inactive":
      return "bg-yellow-100 text-yellow-800";
    case "Discontinued":
    default:
      return "bg-red-100 text-red-800";
  }
}

export const ProductRow = memo(function ProductRow({
  product,
  onDelete,
  onEdit,
}: ProductRowProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    onDelete(product.id);
    setIsDeleteModalOpen(false);
  }, [onDelete, product.id]);

  const statusClasses = getStatusBadgeClasses(product.status);

  return (
    <>
      <tr>
        <td className="whitespace-nowrap px-6 py-4">
          <div className="text-sm font-medium text-gray-900">
            {product.product_name}
          </div>
        </td>

        <td className="whitespace-nowrap px-6 py-4">
          <div className="text-sm text-gray-500">{product.sku}</div>
        </td>

        <td className="whitespace-nowrap px-6 py-4">
          <div className="text-sm text-gray-500">{product.category}</div>
        </td>

        <td className="whitespace-nowrap px-6 py-4">
          <div className="text-sm text-gray-500">
            {product.price.toFixed(2)}
          </div>
        </td>

        <td className="whitespace-nowrap px-6 py-4">
          <div className="text-sm text-gray-500">
            {product.stock_quantity}
          </div>
        </td>

        <td className="whitespace-nowrap px-6 py-4">
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusClasses}`}
          >
            {product.status}
          </span>
        </td>

        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-2 space-x-reverse">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              ویرایش
            </button>
          )}
          <button
            type="button"
            onClick={openDeleteModal}
            className="text-red-600 hover:text-red-900"
            aria-label={`حذف ${product.product_name}`}
          >
            حذف
          </button>
        </td>
      </tr>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="تایید حذف محصول"
      >
        <p className="text-sm text-gray-700">
          آیا از حذف محصول &quot;{product.product_name}&quot; مطمئن هستید؟
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            لغو
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            حذف
          </button>
        </div>
      </Modal>
    </>
  );
});
