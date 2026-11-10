import { useEffect, useState, type FormEvent } from 'react'
import { Footer } from '../components/Footer'
import { Icon } from '../components/Icon'
import { Navbar, type SiteLanguage } from '../components/Navbar'
import './Login.css'

type LoginMode = 'login' | 'register' | 'forgot'

export default function Login() {
  const [language, setLanguage] = useState<SiteLanguage>('vi')
  const [highContrast, setHighContrast] = useState(false)
  const [mode, setMode] = useState<LoginMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [notice, setNotice] = useState('')
  const en = language === 'en'

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger]')
    if (!('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' })

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice(en
      ? 'Account access is not connected yet. Your information has not been sent.'
      : 'Tính năng tài khoản chưa được kết nối. Thông tin của bạn chưa được gửi đi.')
  }

  function switchMode(nextMode: LoginMode) {
    setMode(nextMode)
    setNotice('')
  }

  const heading = mode === 'register'
    ? (en ? 'Create account' : 'Đăng ký tài khoản')
    : mode === 'forgot'
      ? (en ? 'Reset password' : 'Quên mật khẩu')
      : (en ? 'Sign in' : 'Đăng Nhập')

  return (
    <main className={`site-shell login-page${highContrast ? ' high-contrast' : ''}`}>
      <Navbar
        page="login"
        language={language}
        highContrast={highContrast}
        onLanguageChange={setLanguage}
        onContrastChange={setHighContrast}
        onOpenCart={() => { window.location.href = '/products' }}
        onOpenAccount={() => { setMode('login'); setNotice('') }}
      />

      <section className="login-stage">
        <div className="login-card">
          <p className="login-kicker">ANH THƠ BEAUTY &amp; SPA</p>
          <h1>{heading}</h1>
          <span className="login-heading-rule" />

          <form className="login-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <label className="login-input-wrap">
                <span aria-hidden="true">♙</span>
                <input name="name" autoComplete="name" placeholder={en ? 'Full name' : 'Họ và tên'} minLength={2} required />
              </label>
            )}
            <label className="login-input-wrap">
              <span aria-hidden="true">♙</span>
              <input name="identity" type="text" autoComplete="username" placeholder={en ? 'Phone number or email' : 'Số điện thoại hoặc email'} required />
            </label>

            {mode !== 'forgot' && (
              <label className="login-input-wrap">
                <svg className="login-lock-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg>
                <input name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} placeholder={en ? 'Password' : 'Mật khẩu'} minLength={8} required />
                <button className="password-toggle" onClick={() => setShowPassword(!showPassword)} type="button" aria-label={showPassword ? (en ? 'Hide password' : 'Ẩn mật khẩu') : (en ? 'Show password' : 'Hiện mật khẩu')}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" />
                    <circle cx="12" cy="12" r="3" />
                    {!showPassword && <path d="m3 3 18 18" />}
                  </svg>
                </button>
              </label>
            )}

            {mode === 'register' && (
              <label className="login-input-wrap">
                <svg className="login-lock-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg>
                <input name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder={en ? 'Confirm password' : 'Nhập lại mật khẩu'} minLength={8} required />
              </label>
            )}

            {mode === 'login' && (
              <div className="login-options">
                <label><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> {en ? 'Remember me' : 'Ghi nhớ đăng nhập'}</label>
                <button type="button" onClick={() => switchMode('forgot')}>{en ? 'Forgot password?' : 'Quên mật khẩu?'}</button>
              </div>
            )}

            {notice && <p className="login-notice" role="status">{notice}</p>}
            <button className="login-submit" type="submit">
              {mode === 'register' ? (en ? 'Create account' : 'Đăng ký ngay') : mode === 'forgot' ? (en ? 'Send reset request' : 'Gửi yêu cầu') : (en ? 'Sign in' : 'Đăng nhập')} <span aria-hidden="true">→</span>
            </button>
          </form>

          {mode === 'login' && (
            <>
              <div className="login-divider"><span />{en ? 'Or continue with' : 'Hoặc đăng nhập với'}<span /></div>
              <div className="social-login">
                <button type="button" onClick={() => setNotice(en ? 'Google sign-in is not configured yet.' : 'Đăng nhập Google chưa được kết nối.') }><b className="google-mark">G</b> Google</button>
                <button type="button" onClick={() => setNotice(en ? 'Facebook sign-in is not configured yet.' : 'Đăng nhập Facebook chưa được kết nối.') }><b className="facebook-mark">f</b> Facebook</button>
              </div>
            </>
          )}

          <p className="login-switch">
            {mode === 'login' ? (en ? 'New here?' : 'Chưa có tài khoản?') : mode === 'forgot' ? (en ? 'Remembered it?' : 'Bạn đã nhớ mật khẩu?') : (en ? 'Already have an account?' : 'Đã có tài khoản?')}
            <button type="button" onClick={() => { if (mode === 'login') window.location.href = '/register'; else switchMode('login') }}>
              {mode === 'login' ? (en ? 'Create an account' : 'Đăng ký ngay') : (en ? 'Sign in' : 'Đăng nhập')} <span aria-hidden="true">→</span>
            </button>
          </p>
        </div>
      </section>

      <div className="login-floating-links">
        <a className="floating-call" href="tel:08686868686" aria-label={en ? 'Call Anh Tho Spa' : 'Gọi Anh Thơ Spa'}><Icon name="phone" size={22} /></a>
        <a className="floating-message" href="https://wa.me/8486868686" target="_blank" rel="noreferrer" aria-label={en ? 'Message on WhatsApp' : 'Nhắn tin WhatsApp'}><Icon name="whatsapp" size={24} /></a>
      </div>
      <Footer year={2026} language={language} />
    </main>
  )
}
