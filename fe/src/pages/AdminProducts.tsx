import { useMemo, useState, type FormEvent } from 'react'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'
import { products as shopProducts, type ProductCategory } from './Products'
import './AdminDashboard.css'
import './AdminProducts.css'

type ProductStatus = 'Đang bán' | 'Sắp hết hàng' | 'Ngừng kinh doanh'
type ManagedProduct = Product & { stock: number; status: ProductStatus; created: string }
type ProductForm = { name: string; category: ProductCategory; price: string; oldPrice: string; stock: string; image: string; description: string; status: ProductStatus }

const categories: { id: ProductCategory; label: string }[] = [
  { id: 'face', label: 'Chăm sóc da mặt' }, { id: 'body', label: 'Chăm sóc body' }, { id: 'hair', label: 'Chăm sóc tóc' }, { id: 'wellness', label: 'Thực phẩm chức năng' }, { id: 'gift', label: 'Quà tặng' },
]
const stocks = [18, 12, 25, 15, 10, 8, 20, 5]
const baseProducts: ManagedProduct[] = shopProducts.map((product, index) => ({ ...product, stock: stocks[index] ?? 10, status: index === 7 ? 'Sắp hết hàng' : 'Đang bán', created: new Date(2025, 8, 5 - index * 2).toLocaleDateString('vi-VN') }))
const emptyForm: ProductForm = { name: '', category: 'face', price: '', oldPrice: '', stock: '10', image: '/products/serum.svg', description: '', status: 'Đang bán' }

const sidebar = [
  ['⌂', 'Tổng quan', '/admin'], ['♙', 'Quản lý người dùng', '/admin/users'], ['▧', 'Quản lý sản phẩm', '/admin/products'], ['❋', 'Quản lý dịch vụ', '/admin/services'], ['🛒', 'Quản lý đơn hàng', '/admin/orders'], ['calendar', 'Quản lý đặt lịch', '/admin/bookings'], ['◇', 'Quản lý khuyến mãi', '/admin/promotions'], ['▤', 'Quản lý kho', '/admin/inventory'], ['☆', 'Quản lý đánh giá', '/admin/reviews'], ['▣', 'Giao dịch tại cửa hàng', '/admin/transactions'],
]

function formatMoney(amount: number) { return `${new Intl.NumberFormat('vi-VN').format(amount)}đ` }
function categoryLabel(category: ProductCategory) { return categories.find((item) => item.id === category)?.label ?? category }

export default function AdminProducts() {
  const [items, setItems] = useState<ManagedProduct[]>(baseProducts)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tất cả danh mục')
  const [status, setStatus] = useState('Tất cả trạng thái')
  const [selected, setSelected] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [notice, setNotice] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)

  const filtered = useMemo(() => items.filter((product) => {
    const matchesQuery = `${product.name.vi} ${product.name.en} ${product.description.vi}`.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'))
    const matchesCategory = category === 'Tất cả danh mục' || categoryLabel(product.category) === category
    const matchesStatus = status === 'Tất cả trạng thái' || product.status === status
    return matchesQuery && matchesCategory && matchesStatus
  }), [items, query, category, status])
  const sellingCount = items.filter((item) => item.status === 'Đang bán').length
  const lowStockCount = items.filter((item) => item.stock <= 5 && item.status !== 'Ngừng kinh doanh').length
  const stoppedCount = items.filter((item) => item.status === 'Ngừng kinh doanh').length
  const allSelected = filtered.length > 0 && filtered.every((item) => selected.includes(item.id))

  function openNewProduct() { setEditingId(null); setForm(emptyForm); setModalOpen(true) }
  function openEdit(product: ManagedProduct) {
    setEditingId(product.id)
    setForm({ name: product.name.vi, category: product.category, price: String(product.price), oldPrice: product.oldPrice ? String(product.oldPrice) : '', stock: String(product.stock), image: product.image, description: product.description.vi, status: product.status })
    setModalOpen(true)
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const price = Number(form.price)
    const oldPrice = Number(form.oldPrice) || undefined
    const quantity = Math.max(0, Math.floor(Number(form.stock) || 0))
    if (!Number.isFinite(price) || price <= 0) { setNotice('Vui lòng nhập giá bán hợp lệ.'); return }
    if (items.some((item) => item.id !== editingId && item.name.vi.trim().toLocaleLowerCase('vi') === form.name.trim().toLocaleLowerCase('vi'))) { setNotice('Tên sản phẩm đã tồn tại trong danh sách.'); return }
    const saved: ManagedProduct = {
      ...(editingId ? items.find((item) => item.id === editingId)! : shopProducts[0]),
      id: editingId ?? `product-${Date.now()}`,
      name: { vi: form.name.trim(), en: editingId ? items.find((item) => item.id === editingId)!.name.en : form.name.trim() },
      category: form.category,
      categoryName: { vi: categoryLabel(form.category), en: categories.find((item) => item.id === form.category)?.label ?? form.category },
      description: { vi: form.description.trim(), en: form.description.trim() },
      price,
      oldPrice,
      image: form.image.trim() || '/products/serum.svg',
      badge: editingId ? items.find((item) => item.id === editingId)?.badge : 'new',
      rating: editingId ? items.find((item) => item.id === editingId)!.rating : 5,
      reviews: editingId ? items.find((item) => item.id === editingId)!.reviews : 0,
      stock: quantity,
      status: quantity === 0 && form.status === 'Đang bán' ? 'Sắp hết hàng' : form.status,
      created: editingId ? items.find((item) => item.id === editingId)!.created : new Date().toLocaleDateString('vi-VN'),
    }
    setItems((current) => editingId ? current.map((item) => item.id === editingId ? saved : item) : [saved, ...current])
    setNotice(editingId ? `Đã cập nhật ${saved.name.vi}.` : `Đã thêm ${saved.name.vi} vào danh sách xem trước.`)
    setModalOpen(false)
    setEditingId(null)
  }

  function removeSelected() {
    setItems((current) => current.filter((item) => !selected.includes(item.id)))
    setSelected([])
    setNotice('Đã xóa sản phẩm khỏi danh sách xem trước.')
  }

  function toggleStatus(product: ManagedProduct) {
    setItems((current) => current.map((item) => item.id === product.id ? { ...item, status: item.status === 'Ngừng kinh doanh' ? (item.stock <= 5 ? 'Sắp hết hàng' : 'Đang bán') : 'Ngừng kinh doanh' } : item))
  }

  return <div className="admin-page admin-products-page">
    <aside className="admin-sidebar"><a className="admin-brand" href="/admin" aria-label="Anh Thơ Admin"><span className="admin-brand-mark"><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></span></a><nav className="admin-nav" aria-label="Điều hướng quản trị">{sidebar.map(([icon, label, href]) => <a key={label} className={label === 'Quản lý sản phẩm' ? 'active' : ''} href={href}><span aria-hidden="true">{icon === 'calendar' ? <Icon name="calendar" size={20} /> : icon}</span>{label}</a>)}</nav><div className="admin-sidebar-bottom"><a href="/admin/settings"><span>⚙</span>Cài đặt</a><a href="/login"><span>⇥</span>Đăng xuất <b>→</b></a></div></aside>

    <div className="admin-workspace"><header className="admin-topbar"><a className="admin-products-home" href="/admin" aria-label="Tổng quan admin">☰</a><label className="admin-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm sản phẩm..." /></label><div className="admin-topbar-actions"><button className="admin-notification" type="button" aria-label="Thông báo">♧<i>3</i></button><div className="admin-popover-wrap"><button className="admin-profile" type="button" onClick={() => setProfileOpen((value) => !value)}><span className="admin-avatar">A</span><span><b>admin</b><small>Quản trị viên</small></span><i>⌄</i></button>{profileOpen && <div className="admin-popover admin-profile-popover"><b>Quản trị viên</b><a href="/admin/settings">Cài đặt tài khoản</a><a className="admin-profile-site-link" href="/">Về website người dùng <span aria-hidden="true">↗</span></a><a href="/login">Đăng xuất</a></div>}</div></div></header>

      <main className="admin-products-main"><header className="admin-products-heading"><div><h1>Quản lý sản phẩm</h1><p>Quản lý danh sách sản phẩm, cập nhật thông tin, số lượng tồn kho và phân loại sản phẩm.</p></div><time>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</time></header>
        <section className="admin-product-stats">{[
          ['◇', 'Tổng sản phẩm', items.length, 'products'], ['◆', 'Đang bán', sellingCount, 'selling'], ['⚠', 'Sắp hết hàng', lowStockCount, 'low'], ['⊘', 'Ngừng kinh doanh', stoppedCount, 'stopped'],
        ].map(([icon, label, value, tone]) => <article className="admin-panel admin-product-stat" key={label}><span className={`admin-product-stat-icon admin-product-stat-icon--${tone}`}>{icon}</span><div><p>{label}</p><strong>{value}</strong><small>{tone === 'low' ? 'Cần kiểm tra tồn kho' : tone === 'stopped' ? 'Đã ẩn khỏi cửa hàng' : 'Danh mục cửa hàng'}</small></div></article>)}</section>

        <section className="admin-panel admin-product-panel"><div className="admin-product-toolbar"><label className="admin-product-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm sản phẩm..." /></label><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Lọc danh mục"><option>Tất cả danh mục</option>{categories.map((item) => <option key={item.id}>{item.label}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Lọc trạng thái"><option>Tất cả trạng thái</option><option>Đang bán</option><option>Sắp hết hàng</option><option>Ngừng kinh doanh</option></select>{selected.length > 0 && <button className="admin-products-bulk-delete" type="button" onClick={removeSelected}>Xóa đã chọn ({selected.length})</button>}<button className="admin-product-add" type="button" onClick={openNewProduct}><span>＋</span>Thêm sản phẩm</button></div>
          {notice && <p className="admin-products-notice" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Đóng">×</button></p>}
          <div className="admin-products-table-scroll"><table className="admin-products-table"><thead><tr><th><input type="checkbox" aria-label="Chọn tất cả sản phẩm" checked={allSelected} onChange={(event) => setSelected(event.target.checked ? [...new Set([...selected, ...filtered.map((product) => product.id)])] : selected.filter((id) => !filtered.some((product) => product.id === id)))} /></th><th>STT</th><th>Ảnh sản phẩm</th><th>Tên sản phẩm</th><th>Danh mục</th><th>Giá bán</th><th>Giá gốc</th><th>Tồn kho</th><th>Trạng thái</th><th>Ngày tạo</th><th>Thao tác</th></tr></thead><tbody>{filtered.map((product, index) => <tr key={product.id}><td><input type="checkbox" aria-label={`Chọn ${product.name.vi}`} checked={selected.includes(product.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, product.id] : current.filter((id) => id !== product.id))} /></td><td>{index + 1}</td><td><a className="admin-product-thumb" href={`/products/${product.id}`}><img src={product.image} alt={product.name.vi} /></a></td><td><b className="admin-product-name">{product.name.vi}</b></td><td><span className={`admin-product-category admin-product-category--${product.category}`}>{categoryLabel(product.category)}</span></td><td>{formatMoney(product.price)}</td><td>{product.oldPrice ? formatMoney(product.oldPrice) : '—'}</td><td><span className={product.stock <= 5 ? 'admin-stock-low' : 'admin-stock'}>{product.stock}</span></td><td><button className={`admin-product-status admin-product-status--${product.status === 'Đang bán' ? 'selling' : product.status === 'Sắp hết hàng' ? 'low' : 'stopped'}`} type="button" onClick={() => toggleStatus(product)}>{product.status}</button></td><td>{product.created}</td><td><div className="admin-product-actions"><button type="button" title="Xem trên cửa hàng" onClick={() => { window.location.href = `/products/${product.id}` }}>◉</button><button type="button" title="Chỉnh sửa" onClick={() => openEdit(product)}>✎</button><button type="button" title="Xóa sản phẩm" onClick={() => { setItems((current) => current.filter((item) => item.id !== product.id)); setSelected((current) => current.filter((id) => id !== product.id)) }}>♲</button></div></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="admin-no-results">Không tìm thấy sản phẩm phù hợp.</p>}</div>
          <div className="admin-products-pagination"><span>Hiển thị {filtered.length ? 1 : 0} - {filtered.length} trong tổng {items.length} sản phẩm</span><div><button type="button" disabled>‹</button><button className="active" type="button">1</button><button type="button" disabled>2</button><button type="button" disabled>3</button><button type="button" disabled>›</button></div></div>
        </section>
      </main>
      <footer className="admin-footer"><a className="admin-footer-brand" href="/admin"><span>❋</span><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></a><span>♧ Số 8386 - Nam Đàn, Nghệ An</span><a href="tel:08686868686">☎ 08686868686</a><div className="admin-social"><a href="https://www.tiktok.com" aria-label="TikTok">♪</a><a href="https://www.instagram.com" aria-label="Instagram">◎</a><a href="https://www.facebook.com" aria-label="Facebook">f</a><a href="mailto:hello@anhthobeauty.vn" aria-label="Email">✉</a></div><small>© {new Date().getFullYear()} Anh Thơ Beauty &amp; Spa. All rights reserved.</small></footer>
    </div>

    {modalOpen && <Modal title={editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'} onClose={() => { setModalOpen(false); setEditingId(null) }}><form className="admin-product-form" onSubmit={saveProduct}><label>Tên sản phẩm<input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ví dụ: Serum phục hồi da" /></label><div className="admin-product-form-row"><label>Danh mục<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as ProductCategory })}>{categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label>Tồn kho<input required type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></label></div><div className="admin-product-form-row"><label>Giá bán (đ)<input required type="number" min="1" step="1000" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="680000" /></label><label>Giá gốc (đ)<input type="number" min="0" step="1000" value={form.oldPrice} onChange={(event) => setForm({ ...form, oldPrice: event.target.value })} placeholder="Không bắt buộc" /></label></div><label>Đường dẫn ảnh<input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="/products/serum.svg" /></label><label>Mô tả<textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Mô tả ngắn về sản phẩm" /></label><label>Trạng thái<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProductStatus })}><option>Đang bán</option><option>Sắp hết hàng</option><option>Ngừng kinh doanh</option></select></label><p>Thông tin hiện chỉ cập nhật trong phiên xem trước; cần kết nối API để lưu vào cửa hàng.</p><div className="admin-product-form-actions"><button type="button" onClick={() => { setModalOpen(false); setEditingId(null) }}>Hủy</button><button type="submit">{editingId ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button></div></form></Modal>}
  </div>
}
