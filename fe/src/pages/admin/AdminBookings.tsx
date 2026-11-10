import { useMemo, useState } from 'react'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'
import '../../css/AdminDashboard.css'
import '../../css/AdminBookings.css'

type BookingStatus = 'Chờ xác nhận' | 'Đã xác nhận' | 'Đã đến' | 'Đã hủy'
type Appointment = { id: string; name: string; phone: string; service: string; date: string; time: string; status: BookingStatus; note?: string }

const sampleAppointments: Appointment[] = [
  { id: 'LS00112', name: 'Nguyễn Thị Lan', phone: '0987 654 321', service: 'Chăm sóc da mặt', date: '2026-11-10', time: '10:00', status: 'Đã đến' },
  { id: 'LS00111', name: 'Trần Thị Mai', phone: '0965 432 100', service: 'Massage body', date: '2026-11-10', time: '11:30', status: 'Chờ xác nhận', note: 'Khách muốn kỹ thuật viên nữ.' },
  { id: 'LS00110', name: 'Lê Hoàng Mai', phone: '0912 345 678', service: 'Chăm sóc da mụn', date: '2026-11-10', time: '14:00', status: 'Đã xác nhận' },
  { id: 'LS00109', name: 'Phạm Thu Hà', phone: '0988 776 655', service: 'Gội đầu dưỡng sinh', date: '2026-11-10', time: '16:30', status: 'Đã đến' },
  { id: 'LS00108', name: 'Vũ Thị Hồng', phone: '0975 321 987', service: 'Trị mụn chuyên sâu', date: '2026-11-10', time: '18:00', status: 'Chờ xác nhận' },
  { id: 'LS00107', name: 'Đỗ Phương Anh', phone: '0986 654 321', service: 'Massage mặt', date: '2026-11-11', time: '09:00', status: 'Đã xác nhận' },
  { id: 'LS00106', name: 'Nguyễn Thị Vân', phone: '0901 234 567', service: 'Chăm sóc body', date: '2026-11-11', time: '13:30', status: 'Đã hủy' },
  { id: 'LS00105', name: 'Trần Thu Trang', phone: '0933 222 111', service: 'Chăm sóc da mặt', date: '2026-11-12', time: '15:00', status: 'Chờ xác nhận' },
]

const sideMenu = [
  ['⌂', 'Tổng quan', '/admin'], ['♙', 'Quản lý người dùng', '/admin/users'], ['▧', 'Quản lý sản phẩm', '/admin/products'], ['❋', 'Quản lý dịch vụ', '/admin/services'], ['🛒', 'Quản lý đơn hàng', '/admin/orders'], ['calendar', 'Quản lý đặt lịch', '/admin/bookings'], ['◇', 'Quản lý khuyến mãi', '/admin/promotions'], ['▤', 'Quản lý kho', '/admin/inventory'], ['☆', 'Quản lý đánh giá', '/admin/reviews'], ['▣', 'Giao dịch tại cửa hàng', '/admin/transactions'],
]
function statusStyle(status: BookingStatus) { return status === 'Đã đến' ? 'arrived' : status === 'Đã xác nhận' ? 'confirmed' : status === 'Đã hủy' ? 'cancelled' : 'pending' }
function displayDate(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString('vi-VN') }

export default function AdminBookings() {
  const [appointments, setAppointments] = useState(sampleAppointments)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái')
  const [dateFilter, setDateFilter] = useState('')
  const [selected, setSelected] = useState<Appointment | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const filtered = useMemo(() => appointments.filter((appointment) => {
    const matchesQuery = `${appointment.id} ${appointment.name} ${appointment.phone} ${appointment.service}`.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'))
    return matchesQuery && (statusFilter === 'Tất cả trạng thái' || appointment.status === statusFilter) && (!dateFilter || appointment.date === dateFilter)
  }).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)), [appointments, query, statusFilter, dateFilter])
  const todayCount = appointments.filter((appointment) => appointment.date === todayKey && appointment.status !== 'Đã hủy').length
  const pendingCount = appointments.filter((appointment) => appointment.status === 'Chờ xác nhận').length
  const confirmedCount = appointments.filter((appointment) => appointment.status === 'Đã xác nhận').length
  const arrivedCount = appointments.filter((appointment) => appointment.status === 'Đã đến').length

  function updateStatus(id: string, nextStatus: BookingStatus) {
    setAppointments((current) => current.map((appointment) => appointment.id === id ? { ...appointment, status: nextStatus } : appointment))
    setSelected((current) => current?.id === id ? { ...current, status: nextStatus } : current)
    setNotice(`Đã cập nhật lịch hẹn #${id}.`)
  }

  return <div className="admin-page admin-bookings-page">
    <aside className={`admin-sidebar${menuOpen ? ' admin-sidebar--open' : ''}`}><a className="admin-brand" href="/admin" aria-label="Anh Thơ Admin"><span className="admin-brand-mark"><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></span></a><nav className="admin-nav" aria-label="Điều hướng quản trị">{sideMenu.map(([icon, label, href]) => <a key={label} className={label === 'Quản lý đặt lịch' ? 'active' : ''} href={href}><span aria-hidden="true">{icon === 'calendar' ? <Icon name="calendar" size={20} /> : icon}</span>{label}</a>)}</nav><div className="admin-sidebar-bottom"><a href="/admin/settings"><span>⚙</span>Cài đặt</a><a href="/login"><span>⇥</span>Đăng xuất <b>→</b></a></div></aside>
    <div className="admin-workspace"><header className="admin-topbar"><button className="admin-menu-toggle" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Mở menu">☰</button><label className="admin-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã lịch, khách hàng, dịch vụ..." /></label><div className="admin-topbar-actions"><button className="admin-notification" type="button" aria-label="Thông báo">♧<i>3</i></button><div className="admin-popover-wrap"><button className="admin-profile" type="button" onClick={() => setProfileOpen((value) => !value)}><span className="admin-avatar">A</span><span><b>admin</b><small>Quản trị viên</small></span><i>⌄</i></button>{profileOpen && <div className="admin-popover admin-profile-popover"><b>Quản trị viên</b><a href="/admin/settings">Cài đặt tài khoản</a><a className="admin-profile-site-link" href="/">Về website người dùng <span aria-hidden="true">↗</span></a><a href="/login">Đăng xuất</a></div>}</div></div></header>

      <main className="admin-bookings-main"><header className="admin-bookings-heading"><div><h1>Quản lý đặt lịch</h1><p>Theo dõi lịch hẹn, xác nhận dịch vụ và chăm sóc khách hàng tại spa.</p></div><time>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</time></header>
        <section className="admin-booking-stats">{[
          ['calendar', 'Lịch hẹn hôm nay', todayCount, 'today'], ['◷', 'Chờ xác nhận', pendingCount, 'pending'], ['✓', 'Đã xác nhận', confirmedCount, 'confirmed'], ['♙', 'Khách đã đến', arrivedCount, 'arrived'],
        ].map(([icon, label, value, tone]) => <article className="admin-panel admin-booking-stat" key={label}><span className={`admin-booking-stat-icon admin-booking-stat-icon--${tone}`}>{icon === 'calendar' ? <Icon name="calendar" size={21} /> : icon}</span><div><p>{label}</p><strong>{value}</strong><small>{tone === 'pending' ? 'Cần liên hệ xác nhận' : 'Tình hình lịch hẹn'}</small></div></article>)}</section>

        <section className="admin-panel admin-bookings-panel"><div className="admin-bookings-toolbar"><label className="admin-booking-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo mã lịch, tên khách hàng, số điện thoại..." /></label><label className="admin-booking-date"><Icon name="calendar" size={17} /><input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} aria-label="Lọc theo ngày" />{dateFilter && <button type="button" onClick={() => setDateFilter('')} aria-label="Xóa lọc ngày">×</button>}</label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Lọc trạng thái"><option>Tất cả trạng thái</option><option>Chờ xác nhận</option><option>Đã xác nhận</option><option>Đã đến</option><option>Đã hủy</option></select></div>
          {notice && <p className="admin-bookings-notice" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Đóng">×</button></p>}
          <div className="admin-bookings-table-scroll"><table className="admin-bookings-table"><thead><tr><th>Mã lịch</th><th>Khách hàng</th><th>Dịch vụ</th><th>Ngày hẹn</th><th>Giờ</th><th>Số điện thoại</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{filtered.map((appointment) => <tr key={appointment.id}><td><b className="admin-booking-id">#{appointment.id}</b></td><td><b className="admin-booking-customer">{appointment.name}</b></td><td>{appointment.service}</td><td>{displayDate(appointment.date)}</td><td><b className="admin-booking-time">{appointment.time}</b></td><td>{appointment.phone}</td><td><select className={`admin-booking-status admin-booking-status--${statusStyle(appointment.status)}`} value={appointment.status} onChange={(event) => updateStatus(appointment.id, event.target.value as BookingStatus)} aria-label={`Trạng thái lịch ${appointment.id}`}><option>Chờ xác nhận</option><option>Đã xác nhận</option><option>Đã đến</option><option>Đã hủy</option></select></td><td><div className="admin-booking-actions"><button type="button" title="Xem chi tiết" onClick={() => setSelected(appointment)}>◉</button><a href={`tel:${appointment.phone.replaceAll(' ', '')}`} title="Gọi khách hàng">☎</a></div></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="admin-no-results">Không tìm thấy lịch hẹn phù hợp.</p>}</div>
          <div className="admin-bookings-pagination"><span>Hiển thị {filtered.length ? 1 : 0} - {filtered.length} trong tổng {appointments.length} lịch hẹn</span><div><button type="button" disabled>‹</button><button className="active" type="button">1</button><button type="button" disabled>2</button><button type="button" disabled>›</button></div></div>
        </section>
      </main>
      <footer className="admin-footer"><a className="admin-footer-brand" href="/admin"><span>❋</span><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></a><span>♧ Số 8386 - Nam Đàn, Nghệ An</span><a href="tel:08686868686">☎ 08686868686</a><div className="admin-social"><a href="https://www.tiktok.com" aria-label="TikTok">♪</a><a href="https://www.instagram.com" aria-label="Instagram">◎</a><a href="https://www.facebook.com" aria-label="Facebook">f</a><a href="mailto:hello@anhthobeauty.vn" aria-label="Email">✉</a></div><small>© {new Date().getFullYear()} Anh Thơ Beauty &amp; Spa. All rights reserved.</small></footer>
    </div>
    {selected && <Modal title={`Chi tiết lịch hẹn #${selected.id}`} onClose={() => setSelected(null)}><div className="admin-booking-detail"><div><span>Khách hàng</span><b>{selected.name}</b></div><div><span>Số điện thoại</span><a href={`tel:${selected.phone.replaceAll(' ', '')}`}>{selected.phone}</a></div><div><span>Dịch vụ</span><b>{selected.service}</b></div><div><span>Thời gian hẹn</span><b>{displayDate(selected.date)} · {selected.time}</b></div>{selected.note && <div><span>Ghi chú</span><b>{selected.note}</b></div>}<label>Trạng thái<select value={selected.status} onChange={(event) => updateStatus(selected.id, event.target.value as BookingStatus)}><option>Chờ xác nhận</option><option>Đã xác nhận</option><option>Đã đến</option><option>Đã hủy</option></select></label></div></Modal>}
  </div>
}
