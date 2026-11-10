import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Footer } from '../../components/Footer'
import { Icon } from '../../components/Icon'
import { Navbar, type SiteLanguage } from '../../components/Navbar'
import '../../css/Booking.css'

const services = [
  { id: 'facial', name: { vi: 'Massage mặt', en: 'Facial massage' }, duration: 60, price: 680000, image: '/home/service-facial.png' },
  { id: 'body', name: { vi: 'Chăm sóc body', en: 'Body care' }, duration: 90, price: 890000, image: '/home/service-body.png' },
  { id: 'acupressure', name: { vi: 'Bấm huyệt', en: 'Acupressure' }, duration: 60, price: 590000, image: '/home/service-acupressure.png' },
  { id: 'acne', name: { vi: 'Chăm sóc da mụn', en: 'Acne care' }, duration: 75, price: 680000, image: '/home/service-acne.png' },
  { id: 'headspa', name: { vi: 'Gội đầu thư giãn', en: 'Relaxing head spa' }, duration: 60, price: 390000, image: '/home/service-headspa.png' },
]
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']
const weekdays = { vi: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'], en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] }

function sameDay(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate() }
function dateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }
function money(amount: number, en: boolean) { return `${new Intl.NumberFormat(en ? 'en-US' : 'vi-VN').format(amount)}${en ? ' ₫' : 'đ'}` }
function timesForDate(date: Date) {
  const now = new Date()
  if (!sameDay(date, now)) return timeSlots
  return timeSlots.filter((time) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes > now.getHours() * 60 + now.getMinutes()
  })
}

export default function Booking() {
  const [language, setLanguage] = useState<SiteLanguage>('vi')
  const [highContrast, setHighContrast] = useState(false)
  const [month, setMonth] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1) })
  const [selectedDate, setSelectedDate] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate()) })
  const [selectedTime, setSelectedTime] = useState(() => timesForDate(new Date())[0] ?? '')
  const [selectedService, setSelectedService] = useState('')
  const [bookingState, setBookingState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const en = language === 'en'
  const today = new Date()
  const selected = services.find((service) => service.id === selectedService)
  const calendarCells = useMemo(() => {
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    const offset = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)] as (number | null)[]
  }, [month])
  const availableTimes = timesForDate(selectedDate)

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger]')
    if (!('IntersectionObserver' in window)) { targets.forEach((target) => target.classList.add('is-visible')); return }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: .12, rootMargin: '0px 0px -30px 0px' })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  function chooseDate(day: number) {
    const date = new Date(month.getFullYear(), month.getMonth(), day)
    setSelectedDate(date)
    setSelectedTime(timesForDate(date)[0] ?? '')
    setBookingState('idle')
    setMessage('')
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const service = services.find((item) => item.id === String(data.get('service')))
    if (!service || !selectedTime) {
      setBookingState('error')
      setMessage(en ? 'Please select a treatment and time.' : 'Vui lòng chọn dịch vụ và khung giờ.')
      return
    }
    setBookingState('sending')
    setMessage('')
    try {
      const api = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')
      const response = await fetch(`${api}/bookings`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.get('name'), phone: data.get('phone'), service: service.name[language], appointmentAt: `${dateKey(selectedDate)}T${selectedTime}` }),
      })
      const result = await response.json().catch(() => ({})) as { message?: string | string[] }
      if (!response.ok) throw new Error(Array.isArray(result.message) ? result.message.join(' ') : result.message || (en ? 'Could not send your request.' : 'Chưa gửi được yêu cầu. Vui lòng thử lại.'))
      setBookingState('success')
      setMessage(en ? 'Request received. We will contact you to confirm your appointment.' : 'Đã nhận yêu cầu đặt lịch. Anh Thơ sẽ liên hệ xác nhận với bạn.')
      form.reset()
      setSelectedService('')
    } catch (error) {
      setBookingState('error')
      setMessage(error instanceof Error ? error.message : (en ? 'Connection error.' : 'Đã xảy ra lỗi kết nối.'))
    }
  }

  return (
    <main className={`site-shell booking-page${highContrast ? ' high-contrast' : ''}`}>
      <Navbar page="booking" language={language} highContrast={highContrast} onLanguageChange={setLanguage} onContrastChange={setHighContrast} onOpenCart={() => { window.location.href = '/products' }} onOpenAccount={() => { window.location.href = '/login' }} />
      <section className="booking-hero">
        <img src="/home/about-collage.png" alt="" />
        <div><p className="booking-script">{en ? 'Your visit' : 'Đặt lịch'}</p><h1>{en ? <>Choose a moment<br />to unwind</> : <>Chọn thời gian<br />thư giãn của bạn</>}</h1><p>{en ? 'Book a treatment and enjoy thoughtful care at Anh Tho Beauty & Spa.' : 'Đặt lịch ngay để trải nghiệm dịch vụ chăm sóc chuyên nghiệp tại Anh Thơ Beauty & Spa.'}</p></div>
      </section>

      <form className="booking-page-layout" onSubmit={submitBooking}>
        <div className="booking-page-main">
          <section className="booking-step-panel">
            <h2><span>1</span>{en ? 'Choose a date and time' : 'Chọn ngày và giờ'}</h2>
            <div className="booking-calendar">
              <div className="calendar-heading">
                <button type="button" disabled={month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth()} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label={en ? 'Previous month' : 'Tháng trước'}>‹</button>
                <strong>{new Intl.DateTimeFormat(en ? 'en-US' : 'vi-VN', { month: 'long', year: 'numeric' }).format(month)}</strong>
                <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label={en ? 'Next month' : 'Tháng sau'}>›</button>
              </div>
              <div className="calendar-grid">
                {weekdays[language].map((day) => <span className="calendar-weekday" key={day}>{day}</span>)}
                {calendarCells.map((day, i) => {
                  if (!day) return <span className="calendar-empty" key={`empty-${i}`} />
                  const date = new Date(month.getFullYear(), month.getMonth(), day)
                  const past = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                  return <button key={day} type="button" disabled={past} className={sameDay(date, selectedDate) ? 'selected' : ''} onClick={() => chooseDate(day)}>{day}</button>
                })}
              </div>
            </div>
            <h3>{en ? 'Choose a time' : 'Chọn khung giờ'}</h3>
            <div className="booking-time-grid">
              {availableTimes.map((time) => <button type="button" key={time} className={selectedTime === time ? 'selected' : ''} onClick={() => setSelectedTime(time)}>{time}</button>)}
              {!availableTimes.length && <p>{en ? 'No times left today. Choose another date.' : 'Hôm nay đã hết khung giờ. Vui lòng chọn ngày khác.'}</p>}
            </div>
          </section>

          <section className="booking-step-panel booking-service-step">
            <h2><span>2</span>{en ? 'Choose a treatment' : 'Chọn dịch vụ'}</h2>
            <label className="visually-hidden" htmlFor="booking-service-select">{en ? 'Treatment' : 'Dịch vụ'}</label>
            <select id="booking-service-select" name="service" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required>
              <option value="" disabled>{en ? 'Please choose a treatment' : 'Vui lòng chọn dịch vụ'}</option>
              {services.map((service) => <option key={service.id} value={service.id}>{service.name[language]}</option>)}
            </select>
          </section>

          <section className="booking-step-panel booking-contact-step">
            <h2><span>3</span>{en ? 'Contact details' : 'Thông tin liên hệ'}</h2>
            <label className="visually-hidden" htmlFor="booking-name">{en ? 'Full name' : 'Họ và tên'}</label>
            <input id="booking-name" name="name" placeholder={en ? 'Full name *' : 'Họ và tên *'} autoComplete="name" minLength={2} maxLength={120} required />
            <label className="visually-hidden" htmlFor="booking-phone">{en ? 'Phone number' : 'Số điện thoại'}</label>
            <input id="booking-phone" name="phone" type="tel" placeholder={en ? 'Phone number *' : 'Số điện thoại *'} autoComplete="tel" pattern="[+0-9 ().-]{9,20}" required />
            <button className="booking-page-submit" disabled={bookingState === 'sending'} type="submit">{bookingState === 'sending' ? (en ? 'Sending…' : 'Đang gửi…') : (en ? 'Book now' : 'Đặt lịch ngay')}</button>
            {message && <p className={`booking-page-message ${bookingState}`} role={bookingState === 'error' ? 'alert' : 'status'}>{message}</p>}
            <p className="booking-privacy"><span aria-hidden="true">♢</span>{en ? 'Your information is kept private and secure.' : 'Thông tin của bạn được bảo mật tuyệt đối.'}</p>
          </section>
        </div>

        <aside className="booking-page-aside">
          <section className="booking-selected-panel">
            <div className="booking-selected-heading"><h2>{en ? 'Selected treatment' : 'Dịch vụ đã chọn'}</h2><a href="/services">{en ? 'Browse all' : 'Xem tất cả dịch vụ'} →</a></div>
            {selected ? <article className="booking-selected-card"><img src={selected.image} alt="" /><div><h3>{selected.name[language]}</h3><p>◷ {selected.duration} {en ? 'minutes' : 'phút'}</p><strong>{money(selected.price, en)}</strong></div></article> : <p className="booking-select-prompt">{en ? 'Choose a treatment to see its details here.' : 'Chọn dịch vụ để xem thông tin tại đây.'}</p>}
            <div className="booking-summary-date"><span>{en ? 'Appointment' : 'Lịch hẹn'}</span><strong>{new Intl.DateTimeFormat(en ? 'en-US' : 'vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }).format(selectedDate)} · {selectedTime || (en ? 'Choose a time' : 'Chọn giờ')}</strong></div>
          </section>
          <section className="booking-benefits">
            {[
              { icon: '♡', title: en ? 'Private space' : 'Không gian riêng tư', text: en ? 'A peaceful place to unwind' : 'Thư giãn tuyệt đối' },
              { icon: '✿', title: en ? 'Skilled therapists' : 'Kỹ thuật viên chuyên nghiệp', text: en ? 'Gentle, attentive care' : 'Tận tâm, nhẹ nhàng' },
              { icon: '❋', title: en ? 'Carefully selected products' : 'Sản phẩm thiên nhiên', text: en ? 'Selected with care' : 'An toàn, lành tính' },
            ].map((item) => <article key={item.title}><span aria-hidden="true">{item.icon}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}
          </section>
          <section className="booking-trust"><strong>{en ? 'A little care, just for you' : 'Dành thời gian chăm sóc bản thân'}</strong><p>{en ? 'Our team will contact you to confirm your appointment.' : 'Anh Thơ sẽ liên hệ để xác nhận lịch hẹn phù hợp với bạn.'}</p></section>
        </aside>
      </form>

      <div className="booking-floating-links"><a className="floating-call" href="tel:08686868686" aria-label={en ? 'Call Anh Tho Spa' : 'Gọi Anh Thơ Spa'}><Icon name="phone" size={22} /></a><a className="floating-message" href="https://wa.me/8486868686" target="_blank" rel="noreferrer" aria-label={en ? 'Message on WhatsApp' : 'Nhắn tin WhatsApp'}><Icon name="whatsapp" size={24} /></a></div>
      <Footer year={2026} language={language} />
    </main>
  )
}
