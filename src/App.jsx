import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireCustomerAuth from "./components/Auth/RequireCustomerAuth";
import Layout from "./components/Layout/Layout";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
//import OrdersHistory from "./pages/OrdersHistory";
//import Account from "./pages/Account";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import DeliveryZones from "./pages/admin/DeliveryZones";
import AdminUsers from "./pages/admin/AdminUsers";
import "./styles/tokens.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/home"
              element={
                <RequireCustomerAuth>
                  <Layout><Home /></Layout>
                </RequireCustomerAuth>
              }
            />
            <Route
              path="/shop"
              element={
                <RequireCustomerAuth>
                  <Layout><Shop /></Layout>
                </RequireCustomerAuth>
              }
            />
            <Route
              path="/product/:id"
              element={
                <RequireCustomerAuth>
                  <Layout><ProductDetail /></Layout>
                </RequireCustomerAuth>
              }
            />
            <Route
              path="/cart"
              element={
                <RequireCustomerAuth>
                  <Layout><Cart /></Layout>
                </RequireCustomerAuth>
              }
            />
            <Route
              path="/checkout"
              element={
                <RequireCustomerAuth>
                  <Layout><Checkout /></Layout>
                </RequireCustomerAuth>
              }
            />
            <Route
              path="/order-confirmation/:id"
              element={
                <RequireCustomerAuth>
                  <Layout><OrderConfirmation /></Layout>
                </RequireCustomerAuth>
              }
            />
            <Route
              path="/order/:id"
              element={
                <RequireCustomerAuth>
                  <Layout><OrderTracking /></Layout>
                </RequireCustomerAuth>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireCustomerAuth>
                  <Layout>{/*<OrdersHistory/>*/}</Layout>
                </RequireCustomerAuth>
              }
            />
            <Route
              path="/account"
              element={
                <RequireCustomerAuth>
                  <Layout>{/*Account*/}</Layout>
                </RequireCustomerAuth>
              }
            />

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