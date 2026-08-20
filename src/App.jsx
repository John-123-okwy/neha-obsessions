import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import "./styles/tokens.css";
import Categories from "./pages/admin/Categories";

import DeliveryZones from "./pages/admin/DeliveryZones";
import AdminUsers from "./pages/admin/AdminUsers";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/shop" element={<Layout><Shop /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
            <Route path="/order-confirmation/:id" element={<Layout><OrderConfirmation /></Layout>} />
            <Route path="/order/:id" element={<Layout><OrderTracking /></Layout>} />

            <Route path="/admin/login" element={<AdminLogin />} />
            
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
       <Route path="categories" element={<Categories />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="delivery-zones" element={<DeliveryZones />} />
              <Route path="users" element={<AdminUsers />} />
              
              
            </Route>
            
           
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
