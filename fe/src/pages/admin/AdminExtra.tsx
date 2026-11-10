import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Modal } from '../../components/Modal'
import '../../css/AdminDashboard.css'
import '../../css/AdminExtra.css'

type ExtraKind = 'promotions' | 'inventory' | 'reviews' | 'settings'
type NavRow = [string, string, string]
const navigation: NavRow[] = [
  ['⌂', 'Tổng quan', '/admin'], ['♙', 'Quản lý người dùng', '/admin/users'], ['▧', 'Quản lý sản phẩm', '/admin/products'], ['❋', 'Quản lý dịch vụ', '/admin/services'], ['🛒', 'Quản lý đơn hàng', '/admin/orders'], ['▦', 'Quản lý đặt lịch', '/admin/bookings'], ['◇', 'Quản lý khuyến mãi', '/admin/promotions'], ['▤', 'Quản lý kho', '/admin/inventory'], ['☆', 'Quản lý đánh giá', '/admin/reviews'], ['▣', 'Giao dịch tại cửa hàng', '/admin/transactions'],
]
const configs: Record<ExtraKind, { title: string; subtitle: string; active: string }> = {
  promotions: { title: 'Quản lý khuyến mãi', subtitle: 'Tạo chương trình ưu đãi và theo dõi thời gian áp dụng.', active: 'Quản lý khuyến mãi' },
  inventory: { title: 'Quản lý kho', subtitle: 'Theo dõi tồn kho sản phẩm và cập nhật số lượng nhập xuất.', active: 'Quản lý kho' },
  reviews: { title: 'Quản lý đánh giá', subtitle: 'Theo dõi phản hồi của khách hàng và quản lý câu trả lời.', active: 'Quản lý đánh giá' },
  settings: { title: 'Cài đặt quản trị', subtitle: 'Cập nhật thông tin cửa hàng và tùy chọn hệ thống.', active: 'Cài đặt' },
}
type Promotion = { code: string; name: string; discount: string; period: string; uses: number; active: boolean }
type StockItem = { sku: string; name: string; category: string; stock: number; minimum: number; price: number }
type Review = { name: string; service: string; date: string; stars: number; text: string; replied: boolean }

const initialPromotions: Promotion[] = [
  { code: 'WELCOME10', name: 'Ưu đãi khách hàng mới', discount: 'Giảm 10%', period: '01/11/2026 – 30/11/2026', uses: 36, active: true },
  { code: 'SPA150', name: 'Ưu đãi chăm sóc da', discount: 'Giảm 150.000đ', period: '05/11/2026 – 20/11/2026', uses: 18, active: true },
  { code: 'BODY20', name: 'Thư giãn cùng liệu trình body', discount: 'Giảm 20%', period: '01/10/2026 – 31/10/2026', uses: 52, active: false },
]
const initialStock: StockItem[] = [
  { sku: 'SP001', name: 'Serum phục hồi da Anh Thơ Glow', category: 'Chăm sóc da', stock: 18, minimum: 5, price: 680000 },
  { sku: 'SP002', name: 'Kem dưỡng ẩm chuyên sâu', category: 'Chăm sóc da', stock: 7, minimum: 5, price: 450000 },
  { sku: 'SP003', name: 'Sữa rửa mặt dịu nhẹ', category: 'Làm sạch', stock: 3, minimum: 5, price: 280000 },
  { sku: 'SP004', name: 'Tinh dầu dưỡng thể', category: 'Chăm sóc body', stock: 12, minimum: 4, price: 420000 },
  { sku: 'SP005', name: 'Mặt nạ collagen', category: 'Chăm sóc da', stock: 0, minimum: 6, price: 320000 },
]
const initialReviews: Review[] = [
  { name: 'Nguyễn Thị Lan', service: 'Chăm sóc da mặt', date: '10/11/2026', stars: 5, text: 'Dịch vụ tốt, nhân viên nhiệt tình. Da mình dịu hơn sau liệu trình, chắc chắn sẽ quay lại.', replied: false },
  { name: 'Trần Thị Mai', service: 'Massage body', date: '09/11/2026', stars: 5, text: 'Không gian thư giãn, kỹ thuật viên nhẹ nhàng và chu đáo.', replied: true },
  { name: 'Lê Hoàng Mai', service: 'Gội đầu dưỡng sinh', date: '08/11/2026', stars: 4, text: 'Trải nghiệm dễ chịu, muốn có thêm khung giờ buổi tối.', replied: false },
  { name: 'Phạm Thu Hà', service: 'Trị mụn chuyên sâu', date: '07/11/2026', stars: 5, text: 'Được tư vấn kỹ và chăm sóc cẩn thận trong suốt liệu trình.', replied: true },
]
const money = (amount: number) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`

function AdminExtraShell({ kind, children }: { kind: ExtraKind; children: ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  return <div className="admin-page admin-extra-page">
    <aside className={`admin-sidebar${menuOpen ? ' admin-sidebar--open' : ''}`}><a className="admin-brand" href="/admin" aria-label="Anh Thơ Admin"><span className="admin-brand-mark"><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></span></a><nav className="admin-nav" aria-label="Điều hướng quản trị">{navigation.map(([icon, label, href]) => <a key={label} className={configs[kind].active === label ? 'active' : ''} href={href}><span aria-hidden="true">{icon}</span>{label}</a>)}</nav><div className="admin-sidebar-bottom"><a className={kind === 'settings' ? 'active' : ''} href="/admin/settings"><span>⚙</span>Cài đặt</a><a href="/login"><span>⇥</span>Đăng xuất <b>→</b></a></div></aside>
    <div className="admin-workspace"><header className="admin-topbar"><button className="admin-menu-toggle" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Mở menu">☰</button><label className="admin-search"><span>⌕</span><input placeholder={`Tìm kiếm ${configs[kind].title.toLocaleLowerCase('vi')}...`} /></label><div className="admin-topbar-actions"><button className="admin-notification" type="button" aria-label="Thông báo">♧<i>3</i></button><div className="admin-popover-wrap"><button className="admin-profile" type="button" onClick={() => setProfileOpen((value) => !value)}><span className="admin-avatar">A</span><span><b>admin</b><small>Quản trị viên</small></span><i>⌄</i></button>{profileOpen && <div className="admin-popover admin-profile-popover"><b>Quản trị viên</b><a href="/admin/settings">Cài đặt tài khoản</a><a className="admin-profile-site-link" href="/">Về website người dùng <span>↗</span></a><a href="/login">Đăng xuất</a></div>}</div></div></header>
      <main className="admin-extra-main"><header className="admin-extra-heading"><div><h1>{configs[kind].title}</h1><p>{configs[kind].subtitle}</p></div><time>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</time></header>{children}</main>
      <footer className="admin-footer"><a className="admin-footer-brand" href="/admin"><span>❋</span><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></a><span>♧ Số 8386 - Nam Đàn, Nghệ An</span><a href="tel:08686868686">☎ 08686868686</a><div className="admin-social"><a href="https://www.tiktok.com" aria-label="TikTok">♪</a><a href="https://www.instagram.com" aria-label="Instagram">◎</a><a href="https://www.facebook.com" aria-label="Facebook">f</a><a href="mailto:hello@anhthobeauty.vn" aria-label="Email">✉</a></div><small>© {new Date().getFullYear()} Anh Thơ Beauty &amp; Spa. All rights reserved.</small></footer>
    </div>
  </div>
}

function StatCards({ values }: { values: [string, string | number, string][] }) {
  return <section className="admin-extra-stats">{values.map(([label, value, note]) => <article className="admin-panel" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</section>
}

export function AdminPromotions() {
  const [items, setItems] = useState(initialPromotions)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [notice, setNotice] = useState('')
  const filtered = useMemo(() => items.filter((item) => `${item.code} ${item.name}`.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi'))), [items, query])
  function addPromotion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const code = String(data.get('code')).trim().toUpperCase()
    const name = String(data.get('name')).trim()
    const discount = String(data.get('discount')).trim()
    if (!code || !name || !discount) return
    setItems((current) => [{ code, name, discount, period: `${String(data.get('start'))} – ${String(data.get('end'))}`, uses: 0, active: true }, ...current])
    setShowForm(false)
    setNotice(`Đã tạo mã ưu đãi ${code}.`)
  }
  return <AdminExtraShell kind="promotions"><StatCards values={[["Chương trình", items.length, 'Tổng số ưu đãi'], ['Đang áp dụng', items.filter((item) => item.active).length, 'Có thể sử dụng'], ['Lượt sử dụng', items.reduce((sum, item) => sum + item.uses, 0), 'Tổng lượt ghi nhận'], ['Đã kết thúc', items.filter((item) => !item.active).length, 'Đang tạm ẩn']]} /><section className="admin-panel admin-extra-panel"><div className="admin-extra-toolbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã hoặc tên chương trình..." /><button className="admin-extra-primary" type="button" onClick={() => setShowForm((value) => !value)}>{showForm ? 'Đóng biểu mẫu' : '+ Tạo khuyến mãi'}</button></div>{notice && <p className="admin-extra-notice">{notice}<button onClick={() => setNotice('')} type="button">×</button></p>}{showForm && <form className="admin-promo-form" onSubmit={addPromotion}><label>Mã ưu đãi<input name="code" required placeholder="VD: SPA20" /></label><label>Tên chương trình<input name="name" required placeholder="Tên chương trình" /></label><label>Mức giảm<input name="discount" required placeholder="VD: Giảm 15%" /></label><label>Bắt đầu<input name="start" type="date" required /></label><label>Kết thúc<input name="end" type="date" required /></label><button className="admin-extra-primary" type="submit">Lưu chương trình</button></form>}<div className="admin-extra-table-wrap"><table className="admin-extra-table"><thead><tr><th>Mã ưu đãi</th><th>Chương trình</th><th>Mức giảm</th><th>Thời gian</th><th>Lượt dùng</th><th>Trạng thái</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.code}><td><b>{item.code}</b></td><td>{item.name}</td><td>{item.discount}</td><td>{item.period}</td><td>{item.uses}</td><td><button className={`admin-extra-pill ${item.active ? 'is-active' : 'is-off'}`} type="button" onClick={() => setItems((current) => current.map((row) => row.code === item.code ? { ...row, active: !row.active } : row))}>{item.active ? 'Đang áp dụng' : 'Đã kết thúc'}</button></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="admin-no-results">Không tìm thấy chương trình phù hợp.</p>}</div></section></AdminExtraShell>
}

export function AdminInventory() {
  const [items, setItems] = useState(initialStock)
  const [query, setQuery] = useState('')
  const filtered = items.filter((item) => `${item.sku} ${item.name} ${item.category}`.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')))
  const lowStock = items.filter((item) => item.stock <= item.minimum).length
  function adjust(sku: string, amount: number) { setItems((current) => current.map((item) => item.sku === sku ? { ...item, stock: Math.max(0, item.stock + amount) } : item)) }
  return <AdminExtraShell kind="inventory"><StatCards values={[["Sản phẩm trong kho", items.length, 'Mặt hàng đang quản lý'], ['Tổng tồn kho', items.reduce((sum, item) => sum + item.stock, 0), 'Đơn vị sản phẩm'], ['Sắp hết hàng', lowStock, 'Cần kiểm tra nhập hàng'], ['Hết hàng', items.filter((item) => item.stock === 0).length, 'Tạm không còn tồn']]} /><section className="admin-panel admin-extra-panel"><div className="admin-extra-toolbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã hàng, tên sản phẩm, danh mục..." /><span className="admin-stock-hint">Điều chỉnh tồn kho trực tiếp trong danh sách</span></div><div className="admin-extra-table-wrap"><table className="admin-extra-table"><thead><tr><th>Mã hàng</th><th>Sản phẩm</th><th>Danh mục</th><th>Đơn giá</th><th>Tồn kho</th><th>Mức tối thiểu</th><th>Điều chỉnh</th><th>Trạng thái</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.sku}><td><b>{item.sku}</b></td><td>{item.name}</td><td>{item.category}</td><td>{money(item.price)}</td><td><b>{item.stock}</b></td><td>{item.minimum}</td><td><span className="admin-stock-adjust"><button type="button" onClick={() => adjust(item.sku, -1)} aria-label={`Giảm tồn ${item.name}`}>−</button>{item.stock}<button type="button" onClick={() => adjust(item.sku, 1)} aria-label={`Tăng tồn ${item.name}`}>+</button></span></td><td><span className={`admin-extra-pill ${item.stock === 0 ? 'is-off' : item.stock <= item.minimum ? 'is-low' : 'is-active'}`}>{item.stock === 0 ? 'Hết hàng' : item.stock <= item.minimum ? 'Sắp hết' : 'Còn hàng'}</span></td></tr>)}</tbody></table></div></section></AdminExtraShell>
}

export function AdminReviews() {
  const [reviews, setReviews] = useState(initialReviews)
  const [filter, setFilter] = useState('Tất cả đánh giá')
  const [selected, setSelected] = useState<number | null>(null)
  const [reply, setReply] = useState('')
  const [notice, setNotice] = useState('')
  const visible = reviews.filter((review) => filter === 'Tất cả đánh giá' || (filter === 'Chưa phản hồi' ? !review.replied : review.replied))
  function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (selected === null || !reply.trim()) return
    const review = visible[selected]
    setReviews((current) => current.map((item) => item.name === review.name ? { ...item, replied: true } : item))
    setSelected(null); setReply(''); setNotice('Đã ghi nhận phản hồi cho khách hàng.')
  }
  function deleteReview(review: Review) {
    if (!window.confirm(`Xóa đánh giá của ${review.name}?`)) return
    setReviews((current) => current.filter((item) => item !== review))
    setNotice('Đã xóa đánh giá khỏi danh sách.')
  }
  const average = reviews.length ? `${(reviews.reduce((sum, item) => sum + item.stars, 0) / reviews.length).toFixed(1)} / 5` : '—'
  return <AdminExtraShell kind="reviews"><StatCards values={[["Đánh giá", reviews.length, 'Tổng phản hồi'], ['Điểm trung bình', average, 'Mức hài lòng khách hàng'], ['Chưa phản hồi', reviews.filter((item) => !item.replied).length, 'Cần được chăm sóc'], ['Đã phản hồi', reviews.filter((item) => item.replied).length, 'Đã trả lời khách']]} /><section className="admin-panel admin-extra-panel"><div className="admin-extra-toolbar"><span className="admin-extra-toolbar-title">Phản hồi của khách hàng</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>Tất cả đánh giá</option><option>Chưa phản hồi</option><option>Đã phản hồi</option></select></div>{notice && <p className="admin-extra-notice">{notice}<button onClick={() => setNotice('')} type="button">×</button></p>}<div className="admin-review-list">{visible.map((review, index) => <article className="admin-review-card" key={`${review.name}-${review.date}`}><div className="admin-review-top"><div><b>{review.name}</b><small>{review.service} · {review.date}</small></div><span className="admin-review-stars" aria-label={`${review.stars} trên 5 sao`}>{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</span></div><p>{review.text}</p><div className="admin-review-bottom"><span className={`admin-extra-pill ${review.replied ? 'is-active' : 'is-low'}`}>{review.replied ? 'Đã phản hồi' : 'Chờ phản hồi'}</span><button className="admin-extra-secondary" type="button" onClick={() => { setSelected(index); setReply('') }}>{review.replied ? 'Xem / phản hồi' : 'Trả lời đánh giá'}</button><button className="admin-review-delete" type="button" onClick={() => deleteReview(review)} aria-label={`Xóa đánh giá của ${review.name}`}>Xóa</button></div></article>)}</div>{visible.length === 0 && <p className="admin-no-results">Chưa có đánh giá nào trong mục này.</p>}</section>{selected !== null && visible[selected] && <Modal title={`Phản hồi đánh giá của ${visible[selected].name}`} onClose={() => setSelected(null)}><form className="admin-review-reply" onSubmit={sendReply}><p>“{visible[selected].text}”</p><label>Nội dung phản hồi<textarea value={reply} onChange={(event) => setReply(event.target.value)} required rows={4} placeholder="Viết lời cảm ơn hoặc hỗ trợ khách hàng..." /></label><button className="admin-extra-primary" type="submit">Gửi phản hồi</button></form></Modal>}</AdminExtraShell>
}

export function AdminSettings() {
  const [saved, setSaved] = useState(false)
  function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSaved(true) }
  return <AdminExtraShell kind="settings"><form className="admin-panel admin-settings-form" onSubmit={save}><div className="admin-settings-section"><h2>Thông tin cửa hàng</h2><p>Thông tin liên hệ hiển thị trên website và hóa đơn.</p><div className="admin-settings-grid"><label>Tên cửa hàng<input defaultValue="Anh Thơ Beauty & Spa" /></label><label>Số điện thoại<input defaultValue="08686868686" /></label><label>Email liên hệ<input type="email" defaultValue="hello@anhthobeauty.vn" /></label><label>Địa chỉ<input defaultValue="Số 8386 - Nam Đàn, Nghệ An" /></label><label className="full-width">Mô tả cửa hàng<textarea rows={3} defaultValue="Không gian chăm sóc sắc đẹp và thư giãn tận tâm tại Anh Thơ Beauty & Spa." /></label></div></div><div className="admin-settings-section"><h2>Tùy chọn thông báo</h2><label className="admin-setting-check"><input type="checkbox" defaultChecked /> Nhận thông báo khi có lịch hẹn mới</label><label className="admin-setting-check"><input type="checkbox" defaultChecked /> Nhận thông báo khi sản phẩm sắp hết hàng</label><label className="admin-setting-check"><input type="checkbox" /> Nhận bản tổng hợp hoạt động hàng tuần</label></div><div className="admin-settings-actions">{saved && <span role="status">Đã lưu cài đặt trên giao diện.</span>}<button className="admin-extra-primary" type="submit">Lưu thay đổi</button></div></form></AdminExtraShell>
}
