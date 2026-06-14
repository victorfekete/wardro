import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailsPage from "./pages/ProductDetailsPage"
import CartPage from "./pages/CartPage"
import OrderDetailsPage from "./pages/OrderDetailsPage"
import AdminOrdersPage from "./pages/AdminOrdersPage"
import AdminProductsPage from "./pages/AdminProductsPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import MyOrdersPage from "./pages/MyOrdersPage"
import HomePage from "./pages/HomePage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App