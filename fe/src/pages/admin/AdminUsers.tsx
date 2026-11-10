import { useMemo, useState, type FormEvent } from 'react'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'
import '../../css/AdminDashboard.css'
import '../../css/AdminUsers.css'

type AccountRole = 'Khách hàng' | 'Nhân viên' | 'Quản trị viên'
type AccountStatus = 'Hoạt động' | 'Đã khóa'
type User = { id: number; name: string; phone: string; email: string; role: AccountRole; status: AccountStatus; created: string }

const initialUsers: User[] = [
  { id: 1, name: 'Nguyễn Thị Lan', phone: '0987 654 321', email: 'lannguyen@gmail.com', role: 'Khách hàng', status: 'Hoạt động', created: '12/09/2025' },
  { id: 2, name: 'Trần Thị Mai', phone: '0965 432 100', email: 'maitrn@gmail.com', role: 'Khách hàng', status: 'Hoạt động', created: '10/09/2025' },
  { id: 3, name: 'Lê Hoàng Mai', phone: '0912 345 678', email: 'maile@gmail.com', role: 'Khách hàng', status: 'Hoạt động', created: '08/09/2025' },
  { id: 4, name: 'Phạm Thu Hà', phone: '0988 776 655', email: 'hapham@gmail.com', role: 'Khách hàng', status: 'Hoạt động', created: '05/09/2025' },
  { id: 5, name: 'Vũ Thị Hồng', phone: '0975 321 987', email: 'hongvu@gmail.com', role: 'Khách hàng', status: 'Hoạt động', created: '03/09/2025' },
  { id: 6, name: 'Nguyễn Văn Tuấn', phone: '0909 888 777', email: 'tuannguyen@spa.com', role: 'Nhân viên', status: 'Hoạt động', created: '01/09/2025' },
  { id: 7, name: 'Trần Thị Bích', phone: '0936 555 444', email: 'bichtran@spa.com', role: 'Nhân viên', status: 'Hoạt động', created: '28/08/2025' },
  { id: 8, name: 'Lê Thị Dung', phone: '0977 222 333', email: 'dung.le@spa.com', role: 'Nhân viên', status: 'Đã khóa', created: '20/08/2025' },
  { id: 9, name: 'Hoàng Minh Anh', phone: '0922 111 000', email: 'anhhoang@gmail.com', role: 'Quản trị viên', status: 'Hoạt động', created: '15/08/2025' },
  { id: 10, name: 'Đỗ Phương Anh', phone: '0986 654 321', email: 'anhdo@spa.com', role: 'Khách hàng', status: 'Hoạt động', created: '10/08/2025' },
]

const adminMenu = [
  ['⌂', 'Tổng quan', '/admin'], ['♙', 'Quản lý người dùng', '/admin/users'], ['▧', 'Quản lý sản phẩm', '/admin/products'], ['❋', 'Quản lý dịch vụ', '/admin/services'], ['🛒', 'Quản lý đơn hàng', '/admin/orders'], ['calendar', 'Quản lý đặt lịch', '/admin/bookings'], ['◇', 'Quản lý khuyến mãi', '/admin/promotions'], ['▤', 'Quản lý kho', '/admin/inventory'], ['☆', 'Quản lý đánh giá', '/admin/reviews'], ['▣', 'Giao dịch tại cửa hàng', '/admin/transactions'],
]

function RoleTag({ role }: { role: AccountRole }) {
  const style = role === 'Quản trị viên' ? 'admin' : role === 'Nhân viên' ? 'staff' : 'customer'
  return <span className={`user-role-tag user-role-tag--${style}`}>{role}</span>
}

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('Tất cả vai trò')
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái')
  const [selected, setSelected] = useState<number[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', role: 'Nhân viên' as AccountRole })

  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesSearch = `${user.name} ${user.phone} ${user.email}`.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'))
    const matchesRole = roleFilter === 'Tất cả vai trò' || user.role === roleFilter
    const matchesStatus = statusFilter === 'Tất cả trạng thái' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  }), [users, query, roleFilter, statusFilter])
  const customerCount = users.filter((user) => user.role === 'Khách hàng').length
  const staffCount = users.filter((user) => user.role === 'Nhân viên').length
  const lockedCount = users.filter((user) => user.status === 'Đã khóa').length
  const allVisibleSelected = filteredUsers.length > 0 && filteredUsers.every((user) => selected.includes(user.id))

  function addUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (users.some((user) => user.id !== editingId && (user.email.toLowerCase() === form.email.trim().toLowerCase() || user.phone.replace(/\D/g, '') === form.phone.replace(/\D/g, '')))) {
      setNotice('Email hoặc số điện thoại này đã được sử dụng.')
      return
    }
    if (editingId !== null) {
      setUsers((current) => current.map((user) => user.id === editingId ? { ...user, ...form } : user))
      setNotice(`Đã cập nhật tài khoản ${form.name}.`)
      setEditingId(null)
      setFormOpen(false)
      return
    }
    const nextUser: User = { ...form, id: Date.now(), status: 'Hoạt động', created: new Date().toLocaleDateString('vi-VN') }
    setUsers((current) => [nextUser, ...current])
    setSelected([])
    setForm({ name: '', phone: '', email: '', role: 'Nhân viên' })
    setFormOpen(false)
    setNotice(`Đã thêm ${nextUser.name} với quyền ${nextUser.role}. Bản xem trước chưa gửi lời mời đăng nhập.`)
  }

  function toggleStatus(user: User) {
    setUsers((current) => current.map((item) => item.id === user.id ? { ...item, status: item.status === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động' } : item))
  }

  function deleteSelected() {
    setUsers((current) => current.filter((user) => !selected.includes(user.id)))
    setSelected([])
    setNotice('Đã xóa các tài khoản được chọn khỏi danh sách xem trước.')
  }

  return <div className="admin-page admin-users-page">
    <aside className="admin-sidebar">
      <a className="admin-brand" href="/admin" aria-label="Anh Thơ Admin"><span className="admin-brand-mark"><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></span></a>
      <nav className="admin-nav" aria-label="Điều hướng quản trị">{adminMenu.map(([icon, label, href]) => <a key={label} className={label === 'Quản lý người dùng' ? 'active' : ''} href={href}><span aria-hidden="true">{icon === 'calendar' ? <Icon name="calendar" size={20} /> : icon}</span>{label}</a>)}</nav>
      <div className="admin-sidebar-bottom"><a href="/admin/settings"><span>⚙</span>Cài đặt</a><a href="/login"><span>⇥</span>Đăng xuất <b>→</b></a></div>
    </aside>

    <div className="admin-workspace">
      <header className="admin-topbar"><a className="admin-users-home" href="/admin" aria-label="Tổng quan admin">☰</a><label className="admin-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm theo tên, số điện thoại, email..." /></label><div className="admin-topbar-actions"><button className="admin-notification" type="button" aria-label="Thông báo">♧<i>3</i></button><div className="admin-popover-wrap"><button className="admin-profile" type="button" onClick={() => setProfileOpen((value) => !value)}><span className="admin-avatar">A</span><span><b>admin</b><small>Quản trị viên</small></span><i>⌄</i></button>{profileOpen && <div className="admin-popover admin-profile-popover"><b>Quản trị viên</b><a href="/admin/settings">Cài đặt tài khoản</a><a className="admin-profile-site-link" href="/">Về website người dùng <span aria-hidden="true">↗</span></a><a href="/login">Đăng xuất</a></div>}</div></div></header>

      <main className="admin-users-main">
        <header className="admin-users-heading"><div><h1>Quản lý người dùng</h1><p>Quản lý danh sách khách hàng và tài khoản dùng trong hệ thống</p></div><time>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</time></header>

        <section className="admin-user-stats">{[
          ['♙', 'Tổng số người dùng', users.length, '↑ 12%', 'rose'], ['♧', 'Khách hàng', customerCount, '↑ 15%', 'pink'], ['♙', 'Nhân viên', staffCount, '↑ 7%', 'blue'], ['▣', 'Tài khoản bị khóa', lockedCount, '↓ 2%', 'orange'],
        ].map(([icon, label, value, trend, tone]) => <article className="admin-panel admin-user-stat" key={label}><span className={`admin-stat-icon admin-stat-icon--${tone}`}>{icon}</span><div><p>{label}</p><strong>{value}</strong><small className={String(trend).startsWith('↓') ? 'negative' : ''}>{trend} <i>so với tháng trước</i></small></div></article>)}</section>

        <section className="admin-panel admin-user-table-panel">
          <div className="admin-user-toolbar"><label className="admin-user-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm theo tên, SĐT, email..." /></label><select aria-label="Lọc theo vai trò" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}><option>Tất cả vai trò</option><option>Khách hàng</option><option>Nhân viên</option><option>Quản trị viên</option></select><select aria-label="Lọc theo trạng thái" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>Tất cả trạng thái</option><option>Hoạt động</option><option>Đã khóa</option></select>{selected.length > 0 && <button className="admin-bulk-delete" type="button" onClick={deleteSelected}>Xóa đã chọn ({selected.length})</button>}<button className="admin-add-user" type="button" onClick={() => { setEditingId(null); setForm({ name: '', phone: '', email: '', role: 'Nhân viên' }); setFormOpen(true) }}><span>＋</span>Thêm người dùng</button></div>
          {notice && <p className="admin-user-notice" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Đóng">×</button></p>}
          <div className="admin-users-table-scroll"><table className="admin-users-table"><thead><tr><th><input type="checkbox" aria-label="Chọn tất cả người dùng" checked={allVisibleSelected} onChange={(event) => setSelected(event.target.checked ? [...new Set([...selected, ...filteredUsers.map((user) => user.id)])] : selected.filter((id) => !filteredUsers.some((user) => user.id === id)))} /></th><th>STT</th><th>Tên người dùng</th><th>SĐT</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Ngày tạo</th><th>Thao tác</th></tr></thead><tbody>{filteredUsers.map((user, index) => <tr key={user.id}><td><input type="checkbox" aria-label={`Chọn ${user.name}`} checked={selected.includes(user.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, user.id] : current.filter((id) => id !== user.id))} /></td><td>{index + 1}</td><td><span className="admin-user-person"><i>{user.name.split(' ').slice(-1)[0].charAt(0)}</i><b>{user.name}</b></span></td><td>{user.phone}</td><td>{user.email}</td><td><RoleTag role={user.role} /></td><td><button className={`admin-user-status${user.status === 'Đã khóa' ? ' locked' : ''}`} type="button" onClick={() => toggleStatus(user)}>{user.status}</button></td><td>{user.created}</td><td><div className="admin-user-actions"><button type="button" title="Xem thông tin" onClick={() => setNotice(`${user.name} · ${user.email} · ${user.phone}`)}>◉</button><button type="button" title="Chỉnh sửa quyền" onClick={() => { setEditingId(user.id); setForm({ name: user.name, phone: user.phone, email: user.email, role: user.role }); setFormOpen(true) }}>✎</button><button type="button" title="Xóa người dùng" onClick={() => { setUsers((current) => current.filter((item) => item.id !== user.id)); setSelected((current) => current.filter((id) => id !== user.id)) }}>♲</button></div></td></tr>)}</tbody></table>{filteredUsers.length === 0 && <p className="admin-no-results">Không tìm thấy người dùng phù hợp.</p>}</div>
          <div className="admin-users-pagination"><span>Hiển thị {filteredUsers.length ? 1 : 0} - {filteredUsers.length} trong tổng {users.length} người dùng</span><div><button type="button" disabled>‹</button><button className="active" type="button">1</button><button type="button" disabled>2</button><button type="button" disabled>3</button><button type="button" disabled>›</button></div></div>
        </section>
      </main>

      <footer className="admin-footer"><a className="admin-footer-brand" href="/admin"><span>❋</span><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></a><span>♧ Số 8386 - Nam Đàn, Nghệ An</span><a href="tel:08686868686">☎ 08686868686</a><div className="admin-social"><a href="https://www.tiktok.com" aria-label="TikTok">♪</a><a href="https://www.instagram.com" aria-label="Instagram">◎</a><a href="https://www.facebook.com" aria-label="Facebook">f</a><a href="mailto:hello@anhthobeauty.vn" aria-label="Email">✉</a></div><small>© {new Date().getFullYear()} Anh Thơ Beauty &amp; Spa. All rights reserved.</small></footer>
    </div>

    {formOpen && <Modal title={editingId === null ? 'Thêm người dùng' : 'Chỉnh sửa người dùng'} onClose={() => { setFormOpen(false); setEditingId(null) }}><form className="admin-user-form" onSubmit={addUser}><label>Họ và tên<input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nhập họ tên" /></label><label>Số điện thoại<input required type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Nhập số điện thoại" /></label><label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="name@example.com" /></label><label>Phân quyền<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as AccountRole })}><option>Nhân viên</option><option>Quản trị viên</option><option>Khách hàng</option></select></label><p>Quyền được lưu trong tài khoản và phải được máy chủ xác minh. Không chia sẻ mật khẩu quản trị.</p><div className="admin-user-form-actions"><button type="button" onClick={() => { setFormOpen(false); setEditingId(null) }}>Hủy</button><button type="submit">{editingId === null ? 'Tạo tài khoản' : 'Lưu thay đổi'}</button></div></form></Modal>}
  </div>
}
