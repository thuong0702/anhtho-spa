import Home from './pages/user/Home'
import About from './pages/user/About'
import Services from './pages/user/Services'
import Products from './pages/user/Products'
import Login from './pages/user/Login'
import Register from './pages/user/Register'
import Booking from './pages/user/Booking'
import ProductDetail from './pages/user/ProductDetail'
import Cart from './pages/user/Cart'
import Checkout from './pages/user/Checkout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProducts from './pages/admin/AdminProducts'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminServices from './pages/admin/AdminServices'
import AdminOrders from './pages/admin/AdminOrders'
import AdminBookings from './pages/admin/AdminBookings'
import { AdminPromotions, AdminInventory, AdminReviews, AdminSettings, AdminCategories } from './pages/admin/AdminExtra'

function App() {
  const path = window.location.pathname.replace(/\/$/, '')
  if (path === '/about') return <About />
  if (path === '/services') return <Services />
  if (path === '/products') return <Products />
  if (path.startsWith('/products/')) return <ProductDetail productId={decodeURIComponent(path.slice('/products/'.length))} />
  if (path === '/cart') return <Cart />
  if (path === '/checkout' || path === '/dathang') return <Checkout />
  if (path === '/admin') return <AdminDashboard />
  if (path === '/admin/users') return <AdminUsers />
  if (path === '/admin/products') return <AdminProducts />
  if (path === '/admin/transactions') return <AdminTransactions />
  if (path === '/admin/services') return <AdminServices />
  if (path === '/admin/orders') return <AdminOrders />
  if (path === '/admin/bookings') return <AdminBookings />
  if (path === '/admin/promotions') return <AdminPromotions />
  if (path === '/admin/inventory') return <AdminInventory />
  if (path === '/admin/reviews') return <AdminReviews />
  if (path === '/admin/settings') return <AdminSettings />
  if (path === '/admin/categories') return <AdminCategories />
  if (path === '/login') return <Login />
  if (path === '/register') return <Register />
  if (path === '/booking') return <Booking />
  return <Home />
}

export default App
