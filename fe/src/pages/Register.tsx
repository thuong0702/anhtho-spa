import { useEffect, useState, type FormEvent } from 'react'
import { Footer } from '../components/Footer'
import { Icon } from '../components/Icon'
import { Navbar, type SiteLanguage } from '../components/Navbar'
import './Login.css'

export default function Register() {
  const [language, setLanguage] = useState<SiteLanguage>('vi')
  const [highContrast, setHighContrast] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
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
    const formData = new FormData(event.currentTarget)
    if (formData.get('password') !== formData.get('confirmPassword')) {
      setNotice(en ? 'The passwords do not match.' : 'Mật khẩu xác nhận chưa khớp.')
      return
    }
    setNotice(en
      ? 'Account registration is not connected yet. Your information has not been sent.'
      : 'Tính năng tạo tài khoản chưa được kết nối. Thông tin của bạn chưa được gửi đi.')
  }

  return (
    <main className={`site-shell login-page${highContrast ? ' high-contrast' : ''}`}>
      <Navbar
        page="register"
        language={language}
        highContrast={highContrast}
        onLanguageChange={setLanguage}
        onContrastChange={setHighContrast}
        onOpenCart={() => { window.location.href = '/products' }}
        onOpenAccount={() => { window.location.href = '/login' }}
      />

      <section className="login-stage register-stage">
        <div className="login-card register-card">
          <p className="login-kicker">ANH THƠ BEAUTY &amp; SPA</p>
          <h1>{en ? 'Create account' : 'Đăng ký'}</h1>
          <span className="login-heading-rule" />

          <form className="register-form" onSubmit={handleSubmit}>
            <label className="login-input-wrap">
              <svg className="login-lock-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-3.5 2.5-5.5 6.5-5.5 1.5 0 2.7.3 3.7.9M18 13v7M14.5 16.5h7"/></svg>
              <input name="name" autoComplete="name" placeholder={en ? 'Full name' : 'Họ và tên'} minLength={2} required />
            </label>
            <label className="login-input-wrap">
              <svg className="login-lock-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5 9 3l2 4.5-2 1.7a15 15 0 0 0 5.8 5.8l1.7-2 4.5 2-.5 2.4a3 3 0 0 1-3.3 2.4C10 19 5 14 4.2 6.8a3 3 0 0 1 2.4-3.3Z"/></svg>
              <input name="phone" type="tel" autoComplete="tel" placeholder={en ? 'Phone number' : 'Số điện thoại'} pattern="[+0-9 ().-]{9,20}" required />
            </label>
            <label className="login-input-wrap register-email">
              <svg className="login-lock-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
              <input name="email" type="email" autoComplete="email" placeholder="Email" required />
            </label>
            <label className="login-input-wrap">
              <svg className="login-lock-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>
              <input name="password" type={showPasswords ? 'text' : 'password'} autoComplete="new-password" placeholder={en ? 'Password' : 'Mật khẩu'} minLength={8} required />
            </label>
            <label className="login-input-wrap">
              <svg className="login-lock-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="3"/><path d="m3 3 18 18"/></svg>
              <input name="confirmPassword" type={showPasswords ? 'text' : 'password'} autoComplete="new-password" placeholder={en ? 'Confirm password' : 'Nhập lại mật khẩu'} minLength={8} required />
              <button className="password-toggle" onClick={() => setShowPasswords(!showPasswords)} type="button" aria-label={showPasswords ? (en ? 'Hide passwords' : 'Ẩn mật khẩu') : (en ? 'Show passwords' : 'Hiện mật khẩu')}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="3"/>{!showPasswords && <path d="m3 3 18 18"/>}</svg>
              </button>
            </label>

            <label className="register-terms">
              <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} required />
              <span>{en ? 'I agree to the terms of use and privacy policy of Anh Tho Beauty & Spa.' : <>Tôi đồng ý với <a href="/#footer">điều khoản sử dụng</a> và <a href="/#footer">chính sách bảo mật</a> của Anh Thơ Beauty &amp; Spa.</>}</span>
            </label>

            {notice && <p className="login-notice" role="status">{notice}</p>}
            <button className="login-submit" type="submit">{en ? 'Create account' : 'Đăng ký'} <span aria-hidden="true">→</span></button>
          </form>

          <div className="login-divider"><span />{en ? 'Or sign up with' : 'Hoặc đăng ký với'}<span /></div>
          <div className="social-login">
            <button type="button" onClick={() => setNotice(en ? 'Google sign-up is not configured yet.' : 'Đăng ký Google chưa được kết nối.')}><b className="google-mark">G</b> Google</button>
            <button type="button" onClick={() => setNotice(en ? 'Facebook sign-up is not configured yet.' : 'Đăng ký Facebook chưa được kết nối.')}><b className="facebook-mark">f</b> Facebook</button>
          </div>
          <p className="login-switch">{en ? 'Already have an account?' : 'Đã có tài khoản?'} <a href="/login">{en ? 'Sign in' : 'Đăng nhập ngay'} →</a></p>
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
