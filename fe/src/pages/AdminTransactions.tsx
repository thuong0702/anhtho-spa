import { useMemo, useState, type FormEvent } from 'react'
import { Icon } from '../components/Icon'
import { products, type Product } from './Products'
import './AdminDashboard.css'
import './AdminTransactions.css'

type Service = { id: string; name: string; category: string; duration: number; price: number; image: string }
type Payment = 'Tiền mặt' | 'Chuyển khoản' | 'Thẻ ngân hàng' | 'Ví điện tử'
type Transaction = { id: string; customer: string; total: number; date: string; payment: Payment; status: string }

const services: Service[] = [
  { id: 'massage-body', name: 'Massage body', category: 'Massage thư giãn', duration: 60, price: 850000, image: '/home/service-body.png' },
  { id: 'facial', name: 'Chăm sóc da mặt', category: 'Chăm sóc da', duration: 60, price: 680000, image: '/home/service-facial.png' },
  { id: 'head-spa', name: 'Gội đầu dưỡng sinh', category: 'Chăm sóc da', duration: 45, price: 450000, image: '/home/service-headspa.png' },
  { id: 'acne', name: 'Trị mụn chuyên sâu', category: 'Chăm sóc da', duration: 90, price: 1200000, image: '/home/service-acne.png' },
]
const staffList = ['Nguyễn Văn Tuấn', 'Trần Thị Bích', 'Lê Thị Dung', 'Hoàng Minh Anh']
const customers = ['Nguyễn Thị Lan', 'Trần Thị Mai', 'Lê Hoàng Mai', 'Phạm Thu Hà', 'Vũ Thị Hồng', 'Khách lẻ']
const stockById: Record<string, number> = { serum: 18, cream: 7, cleanser: 26, 'body-oil': 12, 'hair-serum': 15, collagen: 9, 'gift-set': 6, 'body-cream': 3 }
const payments: { label: Payment; icon: string }[] = [
  { label: 'Tiền mặt', icon: '♧' }, { label: 'Chuyển khoản', icon: '▣' }, { label: 'Thẻ ngân hàng', icon: '▤' }, { label: 'Ví điện tử', icon: '▣' },
]

const navItems = [
  ['⌂', 'Tổng quan', '/admin'], ['♙', 'Quản lý người dùng', '/admin/users'], ['▧', 'Quản lý sản phẩm', '/admin/products'], ['❋', 'Quản lý dịch vụ', '/admin/services'], ['🛒', 'Quản lý đơn hàng', '/admin/orders'], ['calendar', 'Quản lý đặt lịch', '/admin/bookings'], ['◇', 'Quản lý khuyến mãi', '/admin/promotions'], ['▤', 'Quản lý kho', '/admin/inventory'], ['☆', 'Quản lý đánh giá', '/admin/reviews'], ['▣', 'Giao dịch tại cửa hàng', '/admin/transactions'],
]

function money(value: number) { return `${new Intl.NumberFormat('vi-VN').format(value)}đ` }
function localDate() { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }

function QuantityControl({ quantity, onChange, max }: { quantity: number; onChange: (next: number) => void; max?: number }) {
  return <div className="transaction-quantity"><button type="button" onClick={() => onChange(Math.max(0, quantity - 1))} aria-label="Giảm số lượng">−</button><span>{quantity}</span><button type="button" onClick={() => onChange(max === undefined ? quantity + 1 : Math.min(max, quantity + 1))} aria-label="Tăng số lượng" disabled={max !== undefined && quantity >= max}>＋</button></div>
}

export default function AdminTransactions() {
  const [date, setDate] = useState(localDate)
  const [customer, setCustomer] = useState('')
  const [staff, setStaff] = useState('')
  const [serviceQuery, setServiceQuery] = useState('')
  const [productQuery, setProductQuery] = useState('')
  const [serviceQty, setServiceQty] = useState<Record<string, number>>({})
  const [productQty, setProductQty] = useState<Record<string, number>>({})
  const [discount, setDiscount] = useState('')
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('amount')
  const [payment, setPayment] = useState<Payment>('Tiền mặt')
  const [status, setStatus] = useState('Hoàn thành')
  const [note, setNote] = useState('')
  const [notice, setNotice] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [profileOpen, setProfileOpen] = useState(false)

  const visibleServices = useMemo(() => services.filter((service) => `${service.name} ${service.category}`.toLocaleLowerCase('vi').includes(serviceQuery.trim().toLocaleLowerCase('vi'))), [serviceQuery])
  const visibleProducts = useMemo(() => products.filter((product) => `${product.name.vi} ${product.categoryName.vi}`.toLocaleLowerCase('vi').includes(productQuery.trim().toLocaleLowerCase('vi'))), [productQuery])
  const selectedServices = services.filter((service) => (serviceQty[service.id] ?? 0) > 0)
  const selectedProducts = products.filter((product) => (productQty[product.id] ?? 0) > 0)
  const serviceTotal = selectedServices.reduce((sum, service) => sum + service.price * serviceQty[service.id], 0)
  const productTotal = selectedProducts.reduce((sum, product) => sum + product.price * productQty[product.id], 0)
  const subtotal = serviceTotal + productTotal
  const parsedDiscount = Math.max(0, Number(discount) || 0)
  const discountAmount = discountType === 'percent' ? Math.min(subtotal, Math.round(subtotal * Math.min(parsedDiscount, 100) / 100)) : Math.min(subtotal, parsedDiscount)
  const total = Math.max(0, subtotal - discountAmount)

  function resetForm() {
    setDate(localDate()); setCustomer(''); setStaff(''); setServiceQty({}); setProductQty({}); setDiscount(''); setDiscountType('amount'); setPayment('Tiền mặt'); setStatus('Hoàn thành'); setNote(''); setNotice('')
  }

  function submitTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (subtotal <= 0) { setNotice('Hãy chọn ít nhất một dịch vụ hoặc sản phẩm trước khi lưu.'); return }
    if (!customer || !staff) { setNotice('Vui lòng chọn khách hàng và nhân viên thực hiện.'); return }
    const transaction: Transaction = { id: `GD${String(Date.now()).slice(-6)}`, customer, total, date: new Date(`${date}T12:00:00`).toLocaleDateString('vi-VN'), payment, status }
    setTransactions((current) => [transaction, ...current])
    setNotice(`Đã ghi nhận giao dịch ${transaction.id} với tổng tiền ${money(total)}.`)
    setServiceQty({}); setProductQty({}); setDiscount(''); setNote('')
  }

  return <div className="admin-page admin-transactions-page">
    <aside className="admin-sidebar"><a className="admin-brand" href="/admin" aria-label="Anh Thơ Admin"><span className="admin-brand-mark"><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></span></a><nav className="admin-nav" aria-label="Điều hướng quản trị">{navItems.map(([icon, label, href]) => <a key={label} className={label === 'Giao dịch tại cửa hàng' ? 'active' : ''} href={href}><span aria-hidden="true">{icon === 'calendar' ? <Icon name="calendar" size={20} /> : icon}</span>{label}</a>)}</nav><div className="admin-sidebar-bottom"><a href="/admin/settings"><span>⚙</span>Cài đặt</a><a href="/login"><span>⇥</span>Đăng xuất <b>→</b></a></div></aside>

    <div className="admin-workspace"><header className="admin-topbar"><a className="admin-transaction-menu" href="/admin" aria-label="Tổng quan admin">☰</a><label className="admin-search"><span aria-hidden="true">⌕</span><input placeholder="Tìm kiếm giao dịch, khách hàng, dịch vụ, sản phẩm..." /></label><div className="admin-topbar-actions"><button className="admin-notification" type="button" aria-label="Thông báo">♧<i>3</i></button><div className="admin-popover-wrap"><button className="admin-profile" type="button" onClick={() => setProfileOpen((value) => !value)}><span className="admin-avatar">A</span><span><b>admin</b><small>Quản trị viên</small></span><i>⌄</i></button>{profileOpen && <div className="admin-popover admin-profile-popover"><b>Quản trị viên</b><a href="/admin/settings">Cài đặt tài khoản</a><a className="admin-profile-site-link" href="/">Về website người dùng <span aria-hidden="true">↗</span></a><a href="/login">Đăng xuất</a></div>}</div></div></header>

      <main className="admin-transaction-main"><header className="admin-transaction-heading"><div><a href="/admin" aria-label="Quay lại tổng quan">←</a><div><h1>Thêm giao dịch tại cửa hàng</h1><p>Ghi nhận giao dịch phát sinh trực tiếp tại spa, bao gồm dịch vụ và sản phẩm.</p></div></div><div className="transaction-banner-note">Chăm sóc sắc đẹp<br />là yêu thương bản thân <span>♡</span></div></header>
        {notice && <p className="admin-transaction-notice" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Đóng">×</button></p>}
        <form className="admin-transaction-layout" onSubmit={submitTransaction}>
          <div className="admin-transaction-main-column">
            <section className="admin-panel transaction-selection-panel"><div className="transaction-meta-grid"><label><span><Icon name="calendar" size={18} />Ngày giao dịch <b>*</b></span><div className="transaction-date-input"><input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /><Icon name="calendar" size={16} /></div></label><label><span><i>♙</i>Khách hàng <b>*</b></span><select value={customer} onChange={(event) => setCustomer(event.target.value)} required><option value="">Tìm kiếm khách hàng...</option>{customers.map((name) => <option key={name}>{name}</option>)}</select></label><label><span><i>♙</i>Nhân viên thực hiện <b>*</b></span><select value={staff} onChange={(event) => setStaff(event.target.value)} required><option value="">Chọn nhân viên</option>{staffList.map((name) => <option key={name}>{name}</option>)}</select></label></div>
              <div className="transaction-type-tabs"><span>Loại giao dịch</span><a href="#transaction-services" className={selectedServices.length || !selectedProducts.length ? 'active' : ''} onClick={() => document.getElementById('transaction-services')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>♧　Dịch vụ</a><a href="#transaction-products" className={selectedProducts.length ? 'active' : ''} onClick={() => document.getElementById('transaction-products')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>◇　Sản phẩm</a></div>

              <section className="transaction-picker" id="transaction-services"><h2><span>♧</span> Chọn dịch vụ</h2><label className="transaction-picker-search"><span>⌕</span><input value={serviceQuery} onChange={(event) => setServiceQuery(event.target.value)} placeholder="Tìm kiếm dịch vụ..." /></label><div className="transaction-item-list"><div className="transaction-list-heading"><span /><span /><span>Tên dịch vụ</span><span>Thời gian</span><span>Giá</span><span /></div>{visibleServices.map((service) => { const quantity = serviceQty[service.id] ?? 0; return <div className={`transaction-list-row${quantity ? ' selected' : ''}`} key={service.id}><input type="checkbox" checked={quantity > 0} onChange={(event) => setServiceQty((current) => ({ ...current, [service.id]: event.target.checked ? 1 : 0 }))} aria-label={`Chọn ${service.name}`} /><img src={service.image} alt="" /><div className="transaction-item-title"><b>{service.name}</b><small>{service.category}</small></div><span className="transaction-duration">{service.duration} phút</span><strong>{money(service.price)}</strong><QuantityControl quantity={quantity} onChange={(next) => setServiceQty((current) => ({ ...current, [service.id]: next }))} /></div>})}{visibleServices.length === 0 && <p className="transaction-no-items">Không tìm thấy dịch vụ.</p>}</div></section>

              <section className="transaction-picker" id="transaction-products"><h2><span>◇</span> Chọn sản phẩm</h2><label className="transaction-picker-search"><span>⌕</span><input value={productQuery} onChange={(event) => setProductQuery(event.target.value)} placeholder="Tìm kiếm sản phẩm..." /></label><div className="transaction-item-list"><div className="transaction-list-heading transaction-product-heading"><span /><span /><span>Sản phẩm</span><span>Đơn giá</span><span>Tồn kho</span><span>Số lượng</span></div>{visibleProducts.map((product: Product) => { const quantity = productQty[product.id] ?? 0; const stock = stockById[product.id] ?? 0; return <div className={`transaction-list-row transaction-product-row${quantity ? ' selected' : ''}`} key={product.id}><input type="checkbox" checked={quantity > 0} onChange={(event) => setProductQty((current) => ({ ...current, [product.id]: event.target.checked ? Math.min(1, stock) : 0 }))} aria-label={`Chọn ${product.name.vi}`} disabled={!stock} /><img src={product.image} alt="" /><div className="transaction-item-title"><b>{product.name.vi}</b><small>{product.categoryName.vi}</small></div><strong>{money(product.price)}</strong><span className={stock <= 5 ? 'transaction-stock-low' : 'transaction-stock'}>{stock}</span><QuantityControl quantity={quantity} max={stock} onChange={(next) => setProductQty((current) => ({ ...current, [product.id]: next }))} /></div>})}{visibleProducts.length === 0 && <p className="transaction-no-items">Không tìm thấy sản phẩm.</p>}</div></section>

              <label className="transaction-note-label">Ghi chú<textarea rows={2} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Nhập ghi chú (nếu có)..." /></label>
            </section>
          </div>

          <aside className="admin-panel transaction-summary-panel"><h2><span>▧</span> Thông tin đơn hàng</h2><section><h3>Dịch vụ ({selectedServices.reduce((sum, item) => sum + serviceQty[item.id], 0)})</h3>{selectedServices.length ? selectedServices.map((service) => <div className="transaction-summary-line" key={service.id}><img src={service.image} alt="" /><span><b>{service.name}</b><small>{service.category}</small></span><strong>{money(service.price * serviceQty[service.id])} <small>× {serviceQty[service.id]}</small></strong></div>) : <p className="transaction-empty-summary">Chưa chọn dịch vụ nào</p>}</section><section><h3>Sản phẩm ({selectedProducts.reduce((sum, item) => sum + productQty[item.id], 0)})</h3>{selectedProducts.length ? selectedProducts.map((product) => <div className="transaction-summary-line" key={product.id}><img src={product.image} alt="" /><span><b>{product.name.vi}</b><small>{product.categoryName.vi}</small></span><strong>{money(product.price * productQty[product.id])} <small>× {productQty[product.id]}</small></strong></div>) : <p className="transaction-empty-summary">Chưa chọn sản phẩm nào</p>}</section><div className="transaction-subtotal"><span>Tạm tính</span><strong>{money(subtotal)}</strong></div><label className="transaction-discount-label">Giảm giá<div><select value={discountType} onChange={(event) => setDiscountType(event.target.value as 'amount' | 'percent')}><option value="amount">₫</option><option value="percent">%</option></select><input type="number" min="0" max={discountType === 'percent' ? 100 : subtotal} value={discount} onChange={(event) => setDiscount(event.target.value)} placeholder="Nhập số tiền hoặc %" /></div></label><div className="transaction-grand-total"><span>Tổng tiền</span><strong>{money(total)}</strong></div>
            <fieldset className="transaction-payment"><legend>♧　Phương thức thanh toán</legend><div>{payments.map((method) => <label className={payment === method.label ? 'active' : ''} key={method.label}><input type="radio" name="payment" value={method.label} checked={payment === method.label} onChange={() => setPayment(method.label)} /><span>{method.icon}</span>{method.label}</label>)}</div></fieldset>
            <label className="transaction-status-label">Trạng thái<select value={status} onChange={(event) => setStatus(event.target.value)}><option>Hoàn thành</option><option>Chờ thanh toán</option><option>Đã hủy</option></select></label><div className="transaction-submit-actions"><button type="button" onClick={resetForm}>Hủy</button><button type="submit" disabled={!subtotal}>▣　Lưu giao dịch</button></div>
          </aside>
        </form>
        {transactions.length > 0 && <section className="admin-panel transaction-recent-panel"><h2>Giao dịch vừa ghi nhận</h2><div className="transaction-recent-table"><table><thead><tr><th>Mã giao dịch</th><th>Khách hàng</th><th>Ngày</th><th>Thanh toán</th><th>Trạng thái</th><th>Tổng tiền</th></tr></thead><tbody>{transactions.map((transaction) => <tr key={transaction.id}><td>#{transaction.id}</td><td>{transaction.customer}</td><td>{transaction.date}</td><td>{transaction.payment}</td><td>{transaction.status}</td><td>{money(transaction.total)}</td></tr>)}</tbody></table></div></section>}
      </main>
      <footer className="admin-footer"><a className="admin-footer-brand" href="/admin"><span>❋</span><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></a><span>♧ Số 8386 - Nam Đàn, Nghệ An</span><a href="tel:08686868686">☎ 08686868686</a><div className="admin-social"><a href="https://www.tiktok.com" aria-label="TikTok">♪</a><a href="https://www.instagram.com" aria-label="Instagram">◎</a><a href="https://www.facebook.com" aria-label="Facebook">f</a><a href="mailto:hello@anhthobeauty.vn" aria-label="Email">✉</a></div><small>© {new Date().getFullYear()} Anh Thơ Beauty &amp; Spa. All rights reserved.</small></footer>
    </div>
  </div>
}
