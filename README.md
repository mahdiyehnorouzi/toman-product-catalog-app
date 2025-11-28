# 📦 Product Catalog App  
A fully functional **Product Catalog Management** application built with **React + Vite + TypeScript**, implementing advanced filtering, infinite scroll, product creation with validation, and clean API integration.

Built as part of a **Frontend Engineer assignment**.

---

## 🚀 Features

### 🔍 Product Catalog  
- Infinite product loading (Server-side pagination + React Query Infinite Query)  
- Full filter system:
  - Search (debounced)
  - Category filter (fetched from backend)
  - Status filter
  - Price range (min/max)
  - Stock range (min/max)
  - Optional date range (created_at, last_updated)  
- Filters synced with URL query params  
- Debouncing for all numeric filters (prevents excessive requests)

### ➕ Create Product  
- Full product form with:
  - Zod schema validation  
  - React Hook Form integration  
  - Field-level & global server error handling  
  - Real-time validation feedback  
- Dynamic dropdowns for:
  - Categories (from backend)
  - Suppliers (from backend)

### 🗑️ Delete Product  
- Modal confirmation  
- React Query mutation + auto-refetch  

### 🧠 Infrastructure / Utilities  
- Custom `apiFetch` client with:
  - Timeout support  
  - Automatic JSON parsing  
  - Graceful network error handling  
- Custom hooks:
  - `useDebounce`
  - `useInfiniteScroll`
  - `useCreateProductForm`

---

## 🛠️ Tech Stack

- **React 18**
- **TypeScript**
- **Vite**
- **React Router v6**
- **React Query (TanStack Query)**
- **Zod + React Hook Form**
- **TailwindCSS**
- **ESLint + Prettier**
- **Intersection Observer API** for infinite scroll

---

## 📁 Project Structure

```bash
src/
├── api/
│   ├── client.ts            # apiFetch with timeout + error handling
│   └── products.ts          # product APIs (CRUD + categories + suppliers)
│
├── components/
│   ├── ProductForm/         # ProductForm component
│   ├── ProductList/         # ProductRow + ProductList + FiltersPanel
│   └── ui/
│       └── Modal.tsx        # Reusable modal component
│
├── hooks/
│   ├── useCreateProductForm.ts
│   ├── useDebounce.ts
│   └── useInfiniteScroll.ts
│
├── pages/
│   ├── CatalogPage.tsx
│   └── CreateProductPage.tsx
│
├── types/
│   └── index.ts             # Zod schema + type definitions
│
├── routes.tsx
├── App.tsx
└── main.tsx
```

---

## ▶️ Run Locally

### 1. Install dependencies

1. Clone the repo:
```bash
git clone https://github.com/your-username/toman-product-catalog-app.git
cd toman-product-catalog-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the app:
```bash
npm run dev
```
Opens: [http://localhost:5173](http://localhost:5173)


##  Expected endpoints

- GET /products
- GET /categories
- GET /suppliers
- POST /products
- DELETE /products/:id

##  ✅ Requirements Completed
Core App:
- [x] Product catalog page
- [x] Infinite scroll
- [x] Filters with debounced inputs
- [x] URL-synced filters
- [x] Category + Suppliers fetched from backend
- [x] Product creation form
- [x] Zod validation + custom validations
- [x] server validation error handling
- [x] Delete product with modal confirmation
- [x] Responsive design (Mobile + Desktop)

Technical:
- [x] React Query for data fetching
- [x] Fully typed TypeScript
- [x] Clean modular structure
- [x] Tailwind styling
- [x] Custom hooks (debounce + infinite scroll + form)
- [x] Error boundaries (API + validation)
- [x] Query invalidation after mutations
- [x] server validation error handling
- [x] Delete product with modal confirmation

### 👩‍💻 Author
Developed with care and attention to detail ❤️