import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import Booking from './pages/Booking'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminProducts from './pages/AdminProducts'
import AdminTransactions from './pages/AdminTransactions'
import AdminServices from './pages/AdminServices'
import AdminOrders from './pages/AdminOrders'
import AdminBookings from './pages/AdminBookings'
import { AdminPromotions, AdminInventory, AdminReviews, AdminSettings } from './pages/AdminExtra'

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
  if (path === '/login') return <Login />
  if (path === '/register') return <Register />
  if (path === '/booking') return <Booking />
  return <Home />
}

export default App
