import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../../components/Icon'
import '../../css/AdminDashboard.css'

const stats = [
  { icon: '₫', label: 'Tổng doanh thu', value: '15.680.000đ', trend: '18%', note: 'so với tháng trước', tone: 'pink' },
  { icon: '🛒', label: 'Doanh thu online', value: '10.320.000đ', trend: '12%', note: 'so với tháng trước', tone: 'purple' },
  { icon: '▣', label: 'Doanh thu tại cửa hàng', value: '5.360.000đ', trend: '25%', note: 'so với tháng trước', tone: 'coral' },
  { icon: '◇', label: 'Đơn hàng', value: '12', trend: '9%', note: 'so với tháng trước', tone: 'amber' },
  { icon: 'calendar', label: 'Lịch đặt hôm nay', value: '7', trend: '40%', note: 'so với hôm qua', tone: 'rose' },
  { icon: '♙', label: 'Khách hàng mới', value: '5', trend: '6%', note: 'so với tháng trước', tone: 'blue' },
]

const orders = [
  ['#DH00125', 'Nguyễn Thị Lan', '680.000đ', 'Chờ xác nhận', '10/11 09:24'],
  ['#DH00124', 'Trần Minh Anh', '1.250.000đ', 'Đang giao', '10/11 08:17'],
  ['#DH00123', 'Lê Hoàng Mai', '920.000đ', 'Đã giao', '09/11 16:32'],
  ['#DH00122', 'Phạm Thu Hà', '430.000đ', 'Chờ xác nhận', '09/11 14:21'],
  ['#DH00121', 'Vũ Thị Hồng', '1.080.000đ', 'Đã giao', '09/11 11:03'],
]

const bookings = [
  ['#LS00112', 'Nguyễn Thị Lan', 'Chăm sóc da', '10:00 · 10/11', 'Đã đến'],
  ['#LS00111', 'Trần Thị Mai', 'Massage body', '11:30 · 10/11', 'Chưa đến'],
  ['#LS00110', 'Lê Hoàng Mai', 'Facial', '14:00 · 10/11', 'Chưa đến'],
  ['#LS00109', 'Phạm Thu Hà', 'Gội đầu dưỡng sinh', '16:30 · 10/11', 'Đã đến'],
  ['#LS00108', 'Vũ Thị Hồng', 'Trị mụn', '18:00 · 10/11', 'Chưa đến'],
]

const transactions = [
  ['#GD001', 'Dịch vụ', 'Nguyễn Thị Lan', '850.000đ', '10/11 10:15'],
  ['#GD002', 'Sản phẩm', 'Khách lẻ', '680.000đ', '10/11 09:42'],
  ['#GD003', 'Dịch vụ', 'Trần Thị Mai', '1.200.000đ', '10/11 08:50'],
  ['#GD004', 'Sản phẩm', 'Lê Hoàng Mai', '450.000đ', '09/11 15:30'],
  ['#GD005', 'Dịch vụ', 'Phạm Thu Hà', '980.000đ', '09/11 13:12'],
]

const menu = [
  { icon: '⌂', label: 'Tổng quan', href: '#overview' },
  { icon: '♙', label: 'Quản lý người dùng', href: '/admin/users' },
  { icon: '▧', label: 'Quản lý sản phẩm', href: '/admin/products' },
  { icon: '❋', label: 'Quản lý dịch vụ', href: '/admin/services' },
  { icon: '▦', label: 'Quản lý danh mục', href: '/admin/categories' },
  { icon: '🛒', label: 'Quản lý đơn hàng', href: '/admin/orders' },
  { icon: 'calendar', label: 'Quản lý đặt lịch', href: '/admin/bookings' },
  { icon: '◇', label: 'Quản lý khuyến mãi', href: '/admin/promotions' },
  { icon: '▤', label: 'Quản lý kho', href: '/admin/inventory' },
  { icon: '☆', label: 'Quản lý đánh giá', href: '/admin/reviews' },
  { icon: '▣', label: 'Giao dịch tại cửa hàng', href: '/admin/transactions' },
]

function TrendChart() {
  return <div className="admin-chart" role="img" aria-label="Biểu đồ doanh thu bảy ngày gần nhất">
    <div className="chart-y-labels"><span>20tr</span><span>15tr</span><span>10tr</span><span>5tr</span><span>0</span></div>
    <svg viewBox="0 0 700 210" preserveAspectRatio="none" aria-hidden="true">
      {[20, 58, 96, 134, 172].map((y) => <line key={y} x1="8" x2="692" y1={y} y2={y} className="chart-gridline" />)}
      <path d="M10 158 C60 145 90 120 124 115 S192 90 228 86 S298 105 334 112 S402 91 444 83 S514 108 550 103 S628 72 690 54 L690 172 L10 172 Z" className="chart-area chart-area-main" />
      <path d="M10 158 C60 145 90 120 124 115 S192 90 228 86 S298 105 334 112 S402 91 444 83 S514 108 550 103 S628 72 690 54" className="chart-line chart-line-main" />
      <path d="M10 166 C64 157 90 150 124 145 S197 130 228 127 S298 143 334 145 S410 132 444 128 S514 145 550 141 S635 119 690 110" className="chart-line chart-line-online" />
      <path d="M10 174 C65 169 94 162 124 158 S194 151 228 151 S298 162 334 163 S408 153 444 150 S512 163 550 161 S628 145 690 138" className="chart-line chart-line-store" />
      {[['10', '158'], ['124', '115'], ['228', '86'], ['334', '112'], ['444', '83'], ['550', '103'], ['690', '54']].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.5" className="chart-point" />)}
    </svg>
    <div className="chart-x-labels"><span>04/11</span><span>05/11</span><span>06/11</span><span>07/11</span><span>08/11</span><span>09/11</span><span>10/11</span></div>
  </div>
}

function StatusPill({ value }: { value: string }) {
  const tone = value === 'Đã giao' || value === 'Đã đến' ? 'green' : value === 'Đang giao' ? 'blue' : value === 'Chưa đến' ? 'pink' : 'orange'
  return <span className={`admin-status admin-status--${tone}`}>{value}</span>
}

export default function AdminDashboard() {
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState('Hôm nay')
  const [now, setNow] = useState(() => new Date())
  const [active, setActive] = useState('Tổng quan')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const filterRows = (rows: string[][]) => rows.filter((row) => row.join(' ').toLocaleLowerCase('vi').includes(search.trim().toLocaleLowerCase('vi')))
  const visibleOrders = useMemo(() => filterRows(orders), [search])
  const visibleBookings = useMemo(() => filterRows(bookings), [search])
  const visibleTransactions = useMemo(() => filterRows(transactions), [search])

  return <div className="admin-page" id="overview">
    <aside className={`admin-sidebar${sidebarOpen ? ' admin-sidebar--open' : ''}`}>
      <a className="admin-brand" href="/admin" aria-label="Anh Thơ Admin"><span className="admin-brand-mark"><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></span></a>
      <nav className="admin-nav" aria-label="Điều hướng quản trị">
        {menu.map((item) => <a key={item.label} className={active === item.label ? 'active' : ''} href={item.href} onClick={() => { setActive(item.label); setSidebarOpen(false) }}><span aria-hidden="true">{item.icon === 'calendar' ? <Icon name="calendar" size={20} /> : item.icon}</span>{item.label}</a>)}
      </nav>
      <div className="admin-sidebar-bottom"><a href="/admin/settings" onClick={() => setActive('Cài đặt')}><span>⚙</span>Cài đặt</a><a href="/login"><span>⇥</span>Đăng xuất <b>→</b></a></div>
    </aside>

    <div className="admin-workspace">
      <header className="admin-topbar">
        <button className="admin-menu-toggle" type="button" onClick={() => setSidebarOpen((value) => !value)} aria-label="Mở menu">☰</button>
        <label className="admin-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm kiếm đơn hàng, khách hàng..." /></label>
        <div className="admin-topbar-actions">
          <div className="admin-popover-wrap"><button className="admin-notification" type="button" onClick={() => setNotificationsOpen((value) => !value)} aria-label="Thông báo">♧<i>3</i></button>{notificationsOpen && <div className="admin-popover"><b>Thông báo mới</b><p>3 đơn hàng đang chờ xác nhận.</p><p>2 lịch hẹn sắp diễn ra hôm nay.</p></div>}</div>
          <div className="admin-popover-wrap"><button className="admin-profile" type="button" onClick={() => setProfileOpen((value) => !value)}><span className="admin-avatar">A</span><span><b>admin</b><small>Quản trị viên</small></span><i>⌄</i></button>{profileOpen && <div className="admin-popover admin-profile-popover"><b>Quản trị viên</b><a href="/admin/settings">Cài đặt tài khoản</a><a className="admin-profile-site-link" href="/">Về website người dùng <span aria-hidden="true">↗</span></a><a href="/login">Đăng xuất</a></div>}</div>
        </div>
      </header>

      <main className="admin-main">
        <section className="admin-welcome-row">
          <div><p className="admin-eyebrow">ANH THƠ BEAUTY &amp; SPA</p><h1>Tổng quan</h1><p className="admin-welcome">Chào mừng bạn trở lại!<br />Dưới đây là tình hình hoạt động của spa.</p></div>
          <div className="admin-date-control"><Icon name="calendar" size={26} /><label><small>Khoảng thời gian</small><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Hôm nay</option><option>7 ngày gần nhất</option><option>30 ngày gần nhất</option></select></label><b>⌄</b></div>
          <time className="admin-clock" dateTime={now.toISOString()}>{now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</time>
        </section>

        <section className="admin-stat-grid" aria-label="Chỉ số tổng quan">{stats.map((stat) => <article className="admin-stat-card" key={stat.label}><span className={`admin-stat-icon admin-stat-icon--${stat.tone}`}>{stat.icon === 'calendar' ? <Icon name="calendar" size={22} /> : stat.icon}</span><div className="admin-stat-copy"><p>{stat.label}</p><strong>{stat.value}</strong><small><b>↑ {stat.trend}</b> {stat.note}</small></div><span className="admin-stat-info" title={stat.label}>i</span></article>)}</section>

        <section className="admin-analytics-grid" id="sales-summary">
          <article className="admin-panel admin-revenue-panel"><div className="admin-panel-heading"><div><h2>Doanh thu</h2><p>{period} · so sánh các kênh</p></div><div className="admin-legend"><span><i className="legend-total" />Tổng doanh thu</span><span><i className="legend-online" />Online</span><span><i className="legend-store" />Tại cửa hàng</span></div></div><TrendChart /></article>
          <article className="admin-panel admin-share-panel"><div className="admin-panel-heading"><div><h2>Tỷ lệ doanh thu</h2><p>Phân bổ theo kênh bán</p></div><button type="button" aria-label="Tùy chọn biểu đồ">•••</button></div><div className="admin-donut-layout"><div className="admin-donut"><div><strong>15.680.000đ</strong><small>Tổng doanh thu</small></div></div><div className="admin-donut-legend"><p><i className="legend-total"/><span><b>Online</b><small>10.320.000đ</small></span><strong>65%</strong></p><p><i className="legend-online"/><span><b>Tại cửa hàng</b><small>5.360.000đ</small></span><strong>35%</strong></p></div></div></article>
        </section>

        <section className="admin-tables-grid">
          <article className="admin-panel admin-table-panel" id="recent-orders"><div className="admin-panel-heading"><div><h2>Đơn hàng gần đây</h2><p>Cập nhật mới nhất</p></div><a href="#recent-orders">Xem tất cả →</a></div><div className="admin-table-scroll"><table><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thời gian</th></tr></thead><tbody>{visibleOrders.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={index}>{index === 3 ? <StatusPill value={cell} /> : cell}</td>)}</tr>)}</tbody></table>{!visibleOrders.length && <p className="admin-no-results">Không tìm thấy đơn hàng phù hợp.</p>}</div></article>
          <article className="admin-panel admin-table-panel" id="recent-bookings"><div className="admin-panel-heading"><div><h2>Lịch hẹn gần đây</h2><p>Lịch chăm sóc khách hàng</p></div><a href="/admin/bookings">Xem tất cả →</a></div><div className="admin-table-scroll"><table><thead><tr><th>Mã lịch</th><th>Khách hàng</th><th>Dịch vụ</th><th>Thời gian</th><th>Trạng thái</th></tr></thead><tbody>{visibleBookings.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={index}>{index === 4 ? <StatusPill value={cell} /> : cell}</td>)}</tr>)}</tbody></table>{!visibleBookings.length && <p className="admin-no-results">Không tìm thấy lịch hẹn phù hợp.</p>}</div></article>
          <article className="admin-panel admin-table-panel" id="store-transactions"><div className="admin-panel-heading"><div><h2>Giao dịch tại cửa hàng</h2><p>Các giao dịch gần nhất</p></div><a href="#store-transactions">Xem tất cả →</a></div><div className="admin-table-scroll"><table><thead><tr><th>Mã GD</th><th>Loại</th><th>Khách hàng</th><th>Tổng tiền</th><th>Thời gian</th></tr></thead><tbody>{visibleTransactions.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={index}>{index === 1 ? <span className={`admin-type admin-type--${cell === 'Dịch vụ' ? 'service' : 'product'}`}>{cell}</span> : cell}</td>)}</tr>)}</tbody></table>{!visibleTransactions.length && <p className="admin-no-results">Không tìm thấy giao dịch phù hợp.</p>}</div></article>
        </section>
      </main>

      <footer className="admin-footer"><a className="admin-footer-brand" href="/admin"><span>❋</span><b>ANH THƠ</b><small>BEAUTY &amp; SPA</small></a><span>♧ Số 8386 - Nam Đàn, Nghệ An</span><a href="tel:08686868686">☎ 08686868686</a><div className="admin-social"><a href="https://www.tiktok.com" aria-label="TikTok">♪</a><a href="https://www.instagram.com" aria-label="Instagram">◎</a><a href="https://www.facebook.com" aria-label="Facebook">f</a><a href="mailto:hello@anhthobeauty.vn" aria-label="Email">✉</a></div><small>© {now.getFullYear()} Anh Thơ Beauty &amp; Spa. All rights reserved.</small></footer>
    </div>
  </div>
}
