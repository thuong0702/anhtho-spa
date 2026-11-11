import { useMemo, useState, type FormEvent } from 'react'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'
import '../../css/AdminDashboard.css'
import '../../css/AdminServices.css'

type ServiceStatus = 'Đang hoạt động' | 'Tạm ngừng'
type ServiceCategory = 'Chăm sóc da' | 'Thư giãn' | 'Công nghệ cao'
type SpaService = { id: string; name: string; category: ServiceCategory; price: number; duration: number; description: string; image: string; status: ServiceStatus; featured: boolean; created: string }
type ServiceForm = Omit<SpaService, 'id' | 'created' | 'price' | 'duration'> & { price: string; duration: string }

const seedServices: SpaService[] = [
  { id: 'facial-basic', name: 'Chăm sóc da mặt cơ bản', category: 'Chăm sóc da', price: 350000, duration: 60, description: 'Làm sạch, cấp ẩm, giúp da mịn màng, tươi sáng.', image: '/home/service-facial.png', status: 'Đang hoạt động', featured: true, created: '12/08/2025' },
  { id: 'facial-deep', name: 'Chăm sóc da chuyên sâu', category: 'Chăm sóc da', price: 680000, duration: 90, description: 'Điều trị chuyên sâu các vấn đề về da, phục hồi làn da.', image: '/home/service-acne.png', status: 'Đang hoạt động', featured: true, created: '10/08/2025' },
  { id: 'body-massage', name: 'Massage body', category: 'Thư giãn', price: 850000, duration: 70, description: 'Giảm căng thẳng, thư giãn cơ bắp, lưu thông máu.', image: '/home/service-body.png', status: 'Đang hoạt động', featured: true, created: '05/08/2025' },
  { id: 'body-scrub', name: 'Tẩy tế bào chết', category: 'Chăm sóc da', price: 450000, duration: 45, description: 'Loại bỏ tế bào chết, giúp da mịn màng, sáng khỏe.', image: '/home/service-body.png', status: 'Đang hoạt động', featured: false, created: '01/08/2025' },
  { id: 'head-spa', name: 'Gội đầu dưỡng sinh', category: 'Thư giãn', price: 320000, duration: 45, description: 'Thư giãn da đầu, giảm stress, nuôi dưỡng tóc.', image: '/home/service-headspa.png', status: 'Đang hoạt động', featured: true, created: '28/07/2025' },
  { id: 'hair-removal', name: 'Triệt lông', category: 'Công nghệ cao', price: 1200000, duration: 60, description: 'Hỗ trợ loại bỏ lông tận gốc, cho làn da mịn màng.', image: '/home/spa-model.png', status: 'Đang hoạt động', featured: false, created: '25/07/2025' },
  { id: 'hot-stone', name: 'Massage đá nóng', category: 'Thư giãn', price: 950000, duration: 75, description: 'Thư giãn sâu, giảm đau nhức cơ bắp.', image: '/home/service-body.png', status: 'Tạm ngừng', featured: false, created: '20/07/2025' },
  { id: 'neck-shoulder', name: 'Chăm sóc da cổ - vai - gáy', category: 'Thư giãn', price: 550000, duration: 60, description: 'Giảm mỏi vai gáy, thư giãn da và cơ vùng cổ.', image: '/home/service-acupressure.png', status: 'Đang hoạt động', featured: false, created: '15/07/2025' },
  { id: 'herbal-steam', name: 'Xông hơi thảo dược', category: 'Thư giãn', price: 200000, duration: 30, description: 'Thanh lọc cơ thể, hỗ trợ tuần hoàn máu.', image: '/home/service-headspa.png', status: 'Đang hoạt động', featured: false, created: '10/07/2025' },
  { id: 'postpartum', name: 'Chăm sóc da sau sinh', category: 'Chăm sóc da', price: 600000, duration: 75, description: 'Phục hồi làn da, cân bằng độ ẩm tự nhiên.', image: '/home/service-facial.png', status: 'Đang hoạt động', featured: false, created: '05/07/2025' },
]
const blankForm: ServiceForm = { name: '', category: 'Chăm sóc da', price: '', duration: '60', description: '', image: '/home/service-facial.png', status: 'Đang hoạt động', featured: false }
const navItems = [
  ['⌂', 'Tổng quan', '/admin'], ['♙', 'Quản lý người dùng', '/admin/users'], ['▧', 'Quản lý sản phẩm', '/admin/products'], ['❋', 'Quản lý dịch vụ', '/admin/services'], ['▦', 'Quản lý danh mục', '/admin/categories'], ['🛒', 'Quản lý đơn hàng', '/admin/orders'], ['calendar', 'Quản lý đặt lịch', '/admin/bookings'], ['◇', 'Quản lý khuyến mãi', '/admin/promotions'], ['▤', 'Quản lý kho', '/admin/inventory'], ['☆', 'Quản lý đánh giá', '/admin/reviews'], ['▣', 'Giao dịch tại cửa hàng', '/admin/transactions'],
]
function formatMoney(value: number) { return `${new Intl.NumberFormat('vi-VN').format(value)}đ` }

function ServiceCategoryTag({ category }: { category: ServiceCategory }) {
  const className = category === 'Chăm sóc da' ? 'skin' : category === 'Thư giãn' ? 'relax' : 'technology'
  return <span className={`admin-service-category admin-service-category--${className}`}>{category}</span>
}

export default function AdminServices() {
  const [services, setServices] = useState(seedServices)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tất cả danh mục')
  const [status, setStatus] = useState('Tất cả trạng thái')
  const [selected, setSelected] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ServiceForm>(blankForm)
  const [notice, setNotice] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)

  const filtered = useMemo(() => services.filter((service) => {
    const matchesQuery = `${service.name} ${service.description} ${service.category}`.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'))
    const matchesCategory = category === 'Tất cả danh mục' || service.category === category
    const matchesStatus = status === 'Tất cả trạng thái' || service.status === status
    return matchesQuery && matchesCategory && matchesStatus
  }), [services, query, category, status])
  const activeCount = services.filter((service) => service.status === 'Đang hoạt động').length
  const stoppedCount = services.length - activeCount
  const featuredCount = services.filter((service) => service.featured).length
  const allSelected = filtered.length > 0 && filtered.every((service) => selected.includes(service.id))

  function openNew() { setEditingId(null); setForm(blankForm); setModalOpen(true) }
  function openEdit(service: SpaService) { setEditingId(service.id); setForm({ name: service.name, category: service.category, price: String(service.price), duration: String(service.duration), description: service.description, image: service.image, status: service.status, featured: service.featured }); setModalOpen(true) }

  function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const price = Number(form.price)
    const duration = Number(form.duration)
    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(duration) || duration <= 0) { setNotice('Vui lòng nhập giá và thời lượng hợp lệ.'); return }
    if (services.some((service) => service.id !== editingId && service.name.toLocaleLowerCase('vi') === form.name.trim().toLocaleLowerCase('vi'))) { setNotice('Tên dịch vụ này đã có trong danh sách.'); return }
    const saved: SpaService = { ...form, id: editingId ?? `service-${Date.now()}`, name: form.name.trim(), description: form.description.trim(), price, duration, image: form.image.trim() || '/home/service-facial.png', created: editingId ? services.find((item) => item.id === editingId)!.created : new Date().toLocaleDateString('vi-VN') }
    setServices((current) => editingId ? current.map((service) => service.id === editingId ? saved : service) : [saved, ...current])
    setNotice(editingId ? `Đã cập nhật dịch vụ ${saved.name}.` : `Đã thêm dịch vụ ${saved.name} vào danh sách xem trước.`)
    setModalOpen(false); setEditingId(null)
  }

  function toggleStatus(service: SpaService) {
    setServices((current) => current.map((item) => item.id === service.id ? { ...item, status: item.status === 'Đang hoạt động' ? 'Tạm ngừng' : 'Đang hoạt động' } : item))
  }

  function deleteSelected() {
    setServices((current) => current.filter((service) => !selected.includes(service.id)))
    setSelected([]); setNotice('Đã xóa các dịch vụ được chọn khỏi danh sách xem trước.')
  }

  return <div className="admin-page admin-services-page">
    <aside className="admin-sidebar"><a className="admin-brand" href="/admin" aria-label="Anh Thơ Admin"><span className="admin-brand-mark"><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></span></a><nav className="admin-nav" aria-label="Điều hướng quản trị">{navItems.map(([icon, label, href]) => <a key={label} className={label === 'Quản lý dịch vụ' ? 'active' : ''} href={href}><span aria-hidden="true">{icon === 'calendar' ? <Icon name="calendar" size={20} /> : icon}</span>{label}</a>)}</nav><div className="admin-sidebar-bottom"><a href="/admin/settings"><span>⚙</span>Cài đặt</a><a href="/login"><span>⇥</span>Đăng xuất <b>→</b></a></div></aside>
    <div className="admin-workspace"><header className="admin-topbar"><a className="admin-services-home" href="/admin" aria-label="Tổng quan admin">☰</a><label className="admin-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm dịch vụ..." /></label><div className="admin-topbar-actions"><button className="admin-notification" type="button" aria-label="Thông báo">♧<i>3</i></button><div className="admin-popover-wrap"><button className="admin-profile" type="button" onClick={() => setProfileOpen((value) => !value)}><span className="admin-avatar">A</span><span><b>admin</b><small>Quản trị viên</small></span><i>⌄</i></button>{profileOpen && <div className="admin-popover admin-profile-popover"><b>Quản trị viên</b><a href="/admin/settings">Cài đặt tài khoản</a><a className="admin-profile-site-link" href="/">Về website người dùng <span aria-hidden="true">↗</span></a><a href="/login">Đăng xuất</a></div>}</div></div></header>

      <main className="admin-services-main"><header className="admin-services-heading"><div><h1>Quản lý dịch vụ</h1><p>Quản lý danh sách dịch vụ, cập nhật thông tin, giá cả, thời gian và trạng thái dịch vụ.</p></div><time>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</time></header>
        <section className="admin-service-stats">{[
          ['✿', 'Tổng số dịch vụ', services.length, 'total'], ['♧', 'Đang hoạt động', activeCount, 'active'], ['◷', 'Tạm ngừng', stoppedCount, 'paused'], ['☆', 'Dịch vụ nổi bật', featuredCount, 'featured'],
        ].map(([icon, label, value, tone]) => <article className="admin-panel admin-service-stat" key={label}><span className={`admin-service-stat-icon admin-service-stat-icon--${tone}`}>{icon}</span><div><p>{label}</p><strong>{value}</strong><small>{tone === 'paused' ? 'Đang ẩn khỏi danh sách đặt lịch' : 'Danh mục chăm sóc tại spa'}</small></div></article>)}</section>

        <section className="admin-panel admin-service-panel"><div className="admin-service-toolbar"><label className="admin-service-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm dịch vụ (tên dịch vụ, danh mục...)" /></label><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Lọc theo danh mục"><option>Tất cả danh mục</option><option>Chăm sóc da</option><option>Thư giãn</option><option>Công nghệ cao</option></select><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Lọc theo trạng thái"><option>Tất cả trạng thái</option><option>Đang hoạt động</option><option>Tạm ngừng</option></select>{selected.length > 0 && <button className="admin-services-bulk-delete" type="button" onClick={deleteSelected}>Xóa đã chọn ({selected.length})</button>}<button className="admin-service-add" type="button" onClick={openNew}><span>＋</span>Thêm dịch vụ</button></div>
          {notice && <p className="admin-services-notice" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Đóng">×</button></p>}
          <div className="admin-services-table-scroll"><table className="admin-services-table"><thead><tr><th><input type="checkbox" aria-label="Chọn tất cả dịch vụ" checked={allSelected} onChange={(event) => setSelected(event.target.checked ? [...new Set([...selected, ...filtered.map((service) => service.id)])] : selected.filter((id) => !filtered.some((service) => service.id === id)))} /></th><th>STT</th><th>Hình ảnh</th><th>Tên dịch vụ</th><th>Danh mục</th><th>Giá (VNĐ)</th><th>Thời gian</th><th>Mô tả ngắn</th><th>Trạng thái</th><th>Ngày tạo</th><th>Thao tác</th></tr></thead><tbody>{filtered.map((service, index) => <tr key={service.id}><td><input type="checkbox" aria-label={`Chọn ${service.name}`} checked={selected.includes(service.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, service.id] : current.filter((id) => id !== service.id))} /></td><td>{index + 1}</td><td><span className="admin-service-thumb"><img src={service.image} alt={service.name} /></span></td><td><b className="admin-service-name">{service.name}</b>{service.featured && <small className="admin-service-featured">Nổi bật</small>}</td><td><ServiceCategoryTag category={service.category} /></td><td>{formatMoney(service.price)}</td><td>{service.duration} phút</td><td><span className="admin-service-description">{service.description}</span></td><td><button className={`admin-service-status${service.status === 'Tạm ngừng' ? ' paused' : ''}`} type="button" onClick={() => toggleStatus(service)}>{service.status}</button></td><td>{service.created}</td><td><div className="admin-service-actions"><button type="button" title="Xem trên website" onClick={() => { window.location.href = '/services' }}>◉</button><button type="button" title="Chỉnh sửa" onClick={() => openEdit(service)}>✎</button><button type="button" title="Xóa dịch vụ" onClick={() => { setServices((current) => current.filter((item) => item.id !== service.id)); setSelected((current) => current.filter((id) => id !== service.id)) }}>♲</button></div></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="admin-no-results">Không tìm thấy dịch vụ phù hợp.</p>}</div>
          <div className="admin-services-pagination"><span>Hiển thị {filtered.length ? 1 : 0} - {filtered.length} trong tổng {services.length} dịch vụ</span><div><button type="button" disabled>‹</button><button className="active" type="button">1</button><button type="button" disabled>2</button><button type="button" disabled>›</button></div></div>
        </section>
      </main>
      <footer className="admin-footer"><a className="admin-footer-brand" href="/admin"><span>❋</span><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></a><span>♧ Số 8386 - Nam Đàn, Nghệ An</span><a href="tel:08686868686">☎ 08686868686</a><div className="admin-social"><a href="https://www.tiktok.com" aria-label="TikTok">♪</a><a href="https://www.instagram.com" aria-label="Instagram">◎</a><a href="https://www.facebook.com" aria-label="Facebook">f</a><a href="mailto:hello@anhthobeauty.vn" aria-label="Email">✉</a></div><small>© {new Date().getFullYear()} Anh Thơ Beauty &amp; Spa. All rights reserved.</small></footer>
    </div>

    {modalOpen && <Modal title={editingId ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'} onClose={() => { setModalOpen(false); setEditingId(null) }}><form className="admin-service-form" onSubmit={saveService}><label>Tên dịch vụ<input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ví dụ: Chăm sóc da mặt cơ bản" /></label><div className="admin-service-form-row"><label>Danh mục<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as ServiceCategory })}><option>Chăm sóc da</option><option>Thư giãn</option><option>Công nghệ cao</option></select></label><label>Thời lượng (phút)<input type="number" min="1" step="5" required value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} /></label></div><div className="admin-service-form-row"><label>Giá dịch vụ (đ)<input type="number" min="1" step="1000" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="350000" /></label><label>Trạng thái<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ServiceStatus })}><option>Đang hoạt động</option><option>Tạm ngừng</option></select></label></div><label>Ảnh dịch vụ<input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="/home/service-facial.png" /></label><label>Mô tả<textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Mô tả ngắn về dịch vụ" /></label><label className="admin-service-featured-control"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Đánh dấu dịch vụ nổi bật</label><p>Thông tin hiện chỉ cập nhật trong phiên xem trước; cần kết nối API để lưu vào website.</p><div className="admin-service-form-actions"><button type="button" onClick={() => { setModalOpen(false); setEditingId(null) }}>Hủy</button><button type="submit">{editingId ? 'Lưu thay đổi' : 'Thêm dịch vụ'}</button></div></form></Modal>}
  </div>
}
