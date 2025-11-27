import CatalogPage from "./pages/CatalogPage";
import CreateProductPage from "./pages/CreateProductPage";

export const routes = [
  { path: "/", element: <CatalogPage /> },
  { path: "/create-product", element: <CreateProductPage /> },
];
