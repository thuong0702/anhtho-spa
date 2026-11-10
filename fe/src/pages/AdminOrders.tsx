import { useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'
import './AdminDashboard.css'
import './AdminOrders.css'

type OrderStatus = 'Chờ xác nhận' | 'Đang giao' | 'Đã giao' | 'Đã hủy'
type Order = { id: string; customer: string; phone: string; items: { name: string; quantity: number; price: number; image: string }[]; total: number; payment: string; status: OrderStatus; date: string; address: string }

const seedOrders: Order[] = [
  { id: 'DH00125', customer: 'Nguyễn Thị Lan', phone: '0987 654 321', items: [{ name: 'Serum phục hồi da Anh Thơ Glow', quantity: 1, price: 680000, image: '/products/serum.svg' }], total: 680000, payment: 'COD', status: 'Chờ xác nhận', date: '10/11/2026 · 09:24', address: 'Nam Đàn, Nghệ An' },
  { id: 'DH00124', customer: 'Trần Minh Anh', phone: '0965 432 100', items: [{ name: 'Kem dưỡng ẩm chuyên sâu', quantity: 1, price: 520000, image: '/products/cream.svg' }, { name: 'Sữa rửa mặt dịu nhẹ', quantity: 1, price: 320000, image: '/products/cleanser.svg' }], total: 1250000, payment: 'Chuyển khoản', status: 'Đang giao', date: '10/11/2026 · 08:17', address: 'TP Vinh, Nghệ An' },
  { id: 'DH00123', customer: 'Lê Hoàng Mai', phone: '0912 345 678', items: [{ name: 'Bộ quà chăm sóc da', quantity: 1, price: 980000, image: '/products/serum.svg' }], total: 920000, payment: 'COD', status: 'Đã giao', date: '09/11/2026 · 16:32', address: 'Cửa Lò, Nghệ An' },
  { id: 'DH00122', customer: 'Phạm Thu Hà', phone: '0988 776 655', items: [{ name: 'Tinh dầu dưỡng thể hoa cỏ', quantity: 1, price: 450000, image: '/products/serum.svg' }], total: 430000, payment: 'COD', status: 'Chờ xác nhận', date: '09/11/2026 · 14:21', address: 'Hưng Nguyên, Nghệ An' },
  { id: 'DH00121', customer: 'Vũ Thị Hồng', phone: '0975 321 987', items: [{ name: 'Serum phục hồi da Anh Thơ Glow', quantity: 1, price: 680000, image: '/products/serum.svg' }, { name: 'Kem dưỡng thể mềm mịn', quantity: 1, price: 420000, image: '/products/cream.svg' }], total: 1080000, payment: 'Thẻ ngân hàng', status: 'Đã giao', date: '09/11/2026 · 11:03', address: 'Diễn Châu, Nghệ An' },
  { id: 'DH00120', customer: 'Đỗ Phương Anh', phone: '0986 654 321', items: [{ name: 'Sữa rửa mặt dịu nhẹ', quantity: 2, price: 320000, image: '/products/cleanser.svg' }], total: 640000, payment: 'COD', status: 'Đã hủy', date: '08/11/2026 · 15:42', address: 'Nam Đàn, Nghệ An' },
  { id: 'DH00119', customer: 'Nguyễn Thị Vân', phone: '0901 234 567', items: [{ name: 'Kem dưỡng ẩm chuyên sâu', quantity: 2, price: 520000, image: '/products/cream.svg' }], total: 1040000, payment: 'Chuyển khoản', status: 'Đang giao', date: '08/11/2026 · 10:16', address: 'TP Vinh, Nghệ An' },
  { id: 'DH00118', customer: 'Trần Thu Trang', phone: '0933 222 111', items: [{ name: 'Serum phục hồi da Anh Thơ Glow', quantity: 1, price: 680000, image: '/products/serum.svg' }], total: 680000, payment: 'COD', status: 'Chờ xác nhận', date: '07/11/2026 · 17:08', address: 'Quỳnh Lưu, Nghệ An' },
]
const orderMenu = [
  ['⌂', 'Tổng quan', '/admin'], ['♙', 'Quản lý người dùng', '/admin/users'], ['▧', 'Quản lý sản phẩm', '/admin/products'], ['❋', 'Quản lý dịch vụ', '/admin/services'], ['🛒', 'Quản lý đơn hàng', '/admin/orders'], ['calendar', 'Quản lý đặt lịch', '/admin/bookings'], ['◇', 'Quản lý khuyến mãi', '/admin/promotions'], ['▤', 'Quản lý kho', '/admin/inventory'], ['☆', 'Quản lý đánh giá', '/admin/reviews'], ['▣', 'Giao dịch tại cửa hàng', '/admin/transactions'],
]
function formatMoney(value: number) { return `${new Intl.NumberFormat('vi-VN').format(value)}đ` }

function statusClass(status: OrderStatus) { return status === 'Đã giao' ? 'delivered' : status === 'Đang giao' ? 'shipping' : status === 'Đã hủy' ? 'cancelled' : 'pending' }

export default function AdminOrders() {
  const [orders, setOrders] = useState(seedOrders)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái')
  const [paymentFilter, setPaymentFilter] = useState('Tất cả thanh toán')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const filtered = useMemo(() => orders.filter((order) => {
    const matchesQuery = `${order.id} ${order.customer} ${order.phone} ${order.items.map((item) => item.name).join(' ')}`.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'))
    return matchesQuery && (statusFilter === 'Tất cả trạng thái' || order.status === statusFilter) && (paymentFilter === 'Tất cả thanh toán' || order.payment === paymentFilter)
  }), [orders, query, statusFilter, paymentFilter])
  const pendingCount = orders.filter((order) => order.status === 'Chờ xác nhận').length
  const shippingCount = orders.filter((order) => order.status === 'Đang giao').length
  const deliveredCount = orders.filter((order) => order.status === 'Đã giao').length
  const cancelledCount = orders.filter((order) => order.status === 'Đã hủy').length
  const allSelected = filtered.length > 0 && filtered.every((order) => selectedIds.includes(order.id))

  function changeStatus(id: string, next: OrderStatus) {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status: next } : order))
    setSelectedOrder((current) => current?.id === id ? { ...current, status: next } : current)
    setNotice(`Đã cập nhật trạng thái đơn #${id}.`)
  }

  function removeSelected() {
    setOrders((current) => current.filter((order) => !selectedIds.includes(order.id)))
    setSelectedIds([])
    setNotice('Đã xóa các đơn được chọn khỏi danh sách xem trước.')
  }

  return <div className="admin-page admin-orders-page">
    <aside className="admin-sidebar"><a className="admin-brand" href="/admin" aria-label="Anh Thơ Admin"><span className="admin-brand-mark"><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></span></a><nav className="admin-nav" aria-label="Điều hướng quản trị">{orderMenu.map(([icon, label, href]) => <a key={label} className={label === 'Quản lý đơn hàng' ? 'active' : ''} href={href}><span aria-hidden="true">{icon === 'calendar' ? <Icon name="calendar" size={20} /> : icon}</span>{label}</a>)}</nav><div className="admin-sidebar-bottom"><a href="/admin/settings"><span>⚙</span>Cài đặt</a><a href="/login"><span>⇥</span>Đăng xuất <b>→</b></a></div></aside>
    <div className="admin-workspace"><header className="admin-topbar"><a className="admin-orders-home" href="/admin" aria-label="Tổng quan admin">☰</a><label className="admin-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã đơn, khách hàng, sản phẩm..." /></label><div className="admin-topbar-actions"><button className="admin-notification" type="button" aria-label="Thông báo">♧<i>3</i></button><div className="admin-popover-wrap"><button className="admin-profile" type="button" onClick={() => setProfileOpen((value) => !value)}><span className="admin-avatar">A</span><span><b>admin</b><small>Quản trị viên</small></span><i>⌄</i></button>{profileOpen && <div className="admin-popover admin-profile-popover"><b>Quản trị viên</b><a href="/admin/settings">Cài đặt tài khoản</a><a className="admin-profile-site-link" href="/">Về website người dùng <span aria-hidden="true">↗</span></a><a href="/login">Đăng xuất</a></div>}</div></div></header>

      <main className="admin-orders-main"><header className="admin-orders-heading"><div><h1>Quản lý đơn hàng</h1><p>Theo dõi đơn trực tuyến, trạng thái giao hàng và thông tin thanh toán.</p></div><time>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</time></header>
        <section className="admin-order-stats">{[
          ['▣', 'Tổng đơn hàng', orders.length, 'total'], ['◷', 'Chờ xác nhận', pendingCount, 'pending'], ['↗', 'Đang giao', shippingCount, 'shipping'], ['✓', 'Đã hoàn thành', deliveredCount, 'delivered'],
        ].map(([icon, label, value, tone]) => <article className="admin-panel admin-order-stat" key={label}><span className={`admin-order-stat-icon admin-order-stat-icon--${tone}`}>{icon}</span><div><p>{label}</p><strong>{value}</strong><small>{tone === 'pending' ? `${cancelledCount} đơn đã hủy` : 'Cập nhật theo danh sách'}</small></div></article>)}</section>

        <section className="admin-panel admin-orders-panel"><div className="admin-orders-toolbar"><label className="admin-orders-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm theo mã đơn, tên khách hàng..." /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Lọc trạng thái"><option>Tất cả trạng thái</option><option>Chờ xác nhận</option><option>Đang giao</option><option>Đã giao</option><option>Đã hủy</option></select><select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)} aria-label="Lọc thanh toán"><option>Tất cả thanh toán</option><option>COD</option><option>Chuyển khoản</option><option>Thẻ ngân hàng</option></select>{selectedIds.length > 0 && <button className="admin-order-delete-selected" type="button" onClick={removeSelected}>Xóa đã chọn ({selectedIds.length})</button>}</div>
          {notice && <p className="admin-orders-notice" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Đóng">×</button></p>}
          <div className="admin-orders-table-scroll"><table className="admin-orders-table"><thead><tr><th><input type="checkbox" aria-label="Chọn tất cả đơn hàng" checked={allSelected} onChange={(event) => setSelectedIds(event.target.checked ? [...new Set([...selectedIds, ...filtered.map((order) => order.id)])] : selectedIds.filter((id) => !filtered.some((order) => order.id === id)))} /></th><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Thanh toán</th><th>Trạng thái</th><th>Ngày đặt</th><th>Thao tác</th></tr></thead><tbody>{filtered.map((order) => <tr key={order.id}><td><input type="checkbox" aria-label={`Chọn đơn ${order.id}`} checked={selectedIds.includes(order.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, order.id] : current.filter((id) => id !== order.id))} /></td><td><b className="admin-order-id">#{order.id}</b></td><td><span className="admin-order-customer"><b>{order.customer}</b><small>{order.phone}</small></span></td><td><span className="admin-order-product-preview"><img src={order.items[0].image} alt="" />{order.items[0].name}{order.items.length > 1 && <small>+{order.items.length - 1} sản phẩm</small>}</span></td><td><strong className="admin-order-total">{formatMoney(order.total)}</strong></td><td>{order.payment}</td><td><select className={`admin-order-status admin-order-status--${statusClass(order.status)}`} value={order.status} onChange={(event) => changeStatus(order.id, event.target.value as OrderStatus)} aria-label={`Trạng thái đơn ${order.id}`}><option>Chờ xác nhận</option><option>Đang giao</option><option>Đã giao</option><option>Đã hủy</option></select></td><td>{order.date}</td><td><div className="admin-order-actions"><button type="button" title="Xem chi tiết" onClick={() => setSelectedOrder(order)}>◉</button><button type="button" title="Xóa đơn" onClick={() => { setOrders((current) => current.filter((item) => item.id !== order.id)); setSelectedIds((current) => current.filter((id) => id !== order.id)) }}>♲</button></div></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="admin-no-results">Không tìm thấy đơn hàng phù hợp.</p>}</div>
          <div className="admin-orders-pagination"><span>Hiển thị {filtered.length ? 1 : 0} - {filtered.length} trong tổng {orders.length} đơn hàng</span><div><button type="button" disabled>‹</button><button className="active" type="button">1</button><button type="button" disabled>2</button><button type="button" disabled>›</button></div></div>
        </section>
      </main>
      <footer className="admin-footer"><a className="admin-footer-brand" href="/admin"><span>❋</span><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></a><span>♧ Số 8386 - Nam Đàn, Nghệ An</span><a href="tel:08686868686">☎ 08686868686</a><div className="admin-social"><a href="https://www.tiktok.com" aria-label="TikTok">♪</a><a href="https://www.instagram.com" aria-label="Instagram">◎</a><a href="https://www.facebook.com" aria-label="Facebook">f</a><a href="mailto:hello@anhthobeauty.vn" aria-label="Email">✉</a></div><small>© {new Date().getFullYear()} Anh Thơ Beauty &amp; Spa. All rights reserved.</small></footer>
    </div>
    {selectedOrder && <Modal title={`Chi tiết đơn hàng #${selectedOrder.id}`} onClose={() => setSelectedOrder(null)}><div className="admin-order-detail"><div className="admin-order-detail-customer"><b>{selectedOrder.customer}</b><span>{selectedOrder.phone}</span><small>{selectedOrder.address}</small></div><h3>Sản phẩm</h3>{selectedOrder.items.map((item) => <div className="admin-order-detail-item" key={item.name}><img src={item.image} alt="" /><span>{item.name}<small>Số lượng: {item.quantity}</small></span><strong>{formatMoney(item.price * item.quantity)}</strong></div>)}<div className="admin-order-detail-total"><span>Thanh toán {selectedOrder.payment}</span><strong>{formatMoney(selectedOrder.total)}</strong></div><label>Trạng thái<select value={selectedOrder.status} onChange={(event) => changeStatus(selectedOrder.id, event.target.value as OrderStatus)}><option>Chờ xác nhận</option><option>Đang giao</option><option>Đã giao</option><option>Đã hủy</option></select></label><p>Ngày đặt: {selectedOrder.date}</p></div></Modal>}
  </div>
}
