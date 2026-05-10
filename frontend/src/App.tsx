import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailsPage from "./pages/ProductDetailsPage"
import CartPage from "./pages/CartPage"
import OrderDetailsPage from "./pages/OrderDetailsPage"
import AdminOrdersPage from "./pages/AdminOrdersPage"
import AdminProductsPage from "./pages/AdminProductsPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App