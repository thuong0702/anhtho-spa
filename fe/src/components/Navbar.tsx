import { useState, type FormEvent } from 'react'
import { Icon } from './Icon'
import './Navbar.css'

export type SiteLanguage = 'vi' | 'en'

type NavbarProps = {
  page?: 'home' | 'about' | 'services' | 'products' | 'login' | 'register' | 'booking'
  activeHref?: string
  language?: SiteLanguage
  highContrast?: boolean
  cartCount?: number
  onSearch?: (query: string) => void
  onLanguageChange?: (language: SiteLanguage) => void
  onContrastChange?: (enabled: boolean) => void
  onOpenCart?: () => void
  onOpenAccount?: () => void
}

export function Navbar({
  page = 'home',
  activeHref = '#home',
  language = 'vi',
  highContrast = false,
  cartCount = 0,
  onSearch,
  onLanguageChange,
  onContrastChange,
  onOpenCart,
  onOpenAccount,
}: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const isEnglish = language === 'en'
  const isHomePage = page === 'home'
  const navigationLinks = isEnglish
    ? [
        { label: 'Home', href: isHomePage ? '#home' : '/' },
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Products', href: '/products' },
        { label: 'Booking', href: '/booking' },
      ]
    : [
        { label: 'Trang chủ', href: isHomePage ? '#home' : '/' },
        { label: 'Giới Thiệu', href: '/about' },
        { label: 'Dịch Vụ', href: '/services' },
        { label: 'Sản phẩm', href: '/products' },
        { label: 'Đặt lịch', href: '/booking' },
      ]

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch?.(searchTerm.trim())
    if (onSearch) return
    if (!isHomePage) window.location.href = '/#services'
    else document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="site-header">
      <div className="topbar">
        <a className="brand-mark" href={isHomePage ? '#home' : '/'} aria-label="Anh Thơ Beauty & Spa">
          <span>ANH THƠ</span>
          <small>BEAUTY &amp; SPA</small>
        </a>
        <a className="home-link icon-button" href={isHomePage ? '#home' : '/'} aria-label="Trang chủ">
          <Icon name="home" size={27} />
        </a>
        <form className="search-control" role="search" onSubmit={submitSearch}>
          <button className="icon-button" type="submit" aria-label={isEnglish ? 'Search' : 'Tìm kiếm'}>
            <Icon name="search" />
          </button>
          <input
            aria-label={isEnglish ? 'Search services' : 'Tìm kiếm dịch vụ'}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={isEnglish ? 'Find a treatment' : ''}
            value={searchTerm}
          />
        </form>
        <a className="top-booking" href="/booking">
          <Icon name="calendar" size={16} /> {isEnglish ? 'Book now' : 'Đặt lịch ngay'} <Icon name="whatsapp" size={16} />
        </a>
        <div className="header-menu-wrap">
          <button
            aria-expanded={languageMenuOpen}
            aria-label={isEnglish ? 'Choose language' : 'Chọn ngôn ngữ'}
            className="language-picker"
            onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
            type="button"
          >
            <Icon name="chevron" size={18} /> {isEnglish ? 'EN' : 'VN'}
          </button>
          {languageMenuOpen && (
            <div className="header-popover language-popover">
              <button type="button" onClick={() => { onLanguageChange?.('vi'); setLanguageMenuOpen(false) }}>Tiếng Việt</button>
              <button type="button" onClick={() => { onLanguageChange?.('en'); setLanguageMenuOpen(false) }}>English</button>
            </div>
          )}
        </div>
        <div className="header-menu-wrap settings-wrap">
          <button
            className="icon-button settings-button"
            aria-label={isEnglish ? 'Display settings' : 'Tùy chỉnh giao diện'}
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen(!settingsOpen)}
            type="button"
          >
            <Icon name="sliders" size={27} />
          </button>
          {settingsOpen && (
            <div className="header-popover settings-popover">
              <label>
                <input
                  checked={highContrast}
                  onChange={(event) => onContrastChange?.(event.target.checked)}
                  type="checkbox"
                />
                {isEnglish ? 'High contrast' : 'Tăng độ tương phản'}
              </label>
            </div>
          )}
        </div>
      </div>

      <nav className="main-nav" aria-label="Điều hướng chính">
        {navigationLinks.map((link) => (
          <a
            className={(!isHomePage ? link.href === `/${page}` : link.href === activeHref) ? 'active' : undefined}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </a>
        ))}
        <button className="nav-icon nav-action" onClick={onOpenCart} type="button" aria-label={isEnglish ? 'Shopping bag' : 'Giỏ dịch vụ'}>
          <Icon name="bag" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
        <button className="nav-icon account-link nav-action" onClick={onOpenAccount} type="button" aria-label={isEnglish ? 'Customer information' : 'Thông tin khách hàng'}>
          <Icon name="user" />
        </button>
      </nav>
    </header>
  )
}
