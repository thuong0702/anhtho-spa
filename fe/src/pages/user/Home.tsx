import { useEffect, useMemo, useState, type FormEvent } from 'react'
import '../../css/App.css'
import { Footer } from '../../components/Footer'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'
import { Navbar, type SiteLanguage } from '../../components/Navbar'

const heroImage = '/home/spa-model.png'
const bodyImage = '/home/service-body.png'
const facialImage = '/home/service-facial.png'
const acupressureImage = '/home/service-acupressure.png'
const acneImage = '/home/service-acne.png'
const headSpaImage = '/home/service-headspa.png'
const aboutImage = '/home/about-collage.png'
const reviewImage = '/home/review-portrait.png'

if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('scroll-reveal')
}

type Service = {
  id: string
  name: Record<SiteLanguage, string>
  description: Record<SiteLanguage, string>
  image: string
  keywords: string
}

type CartItem = { serviceId: string; quantity: number }
type BookingState = 'idle' | 'sending' | 'success' | 'error'

const services: Service[] = [
  {
    id: 'body',
    name: { vi: 'Chăm sóc body', en: 'Body care' },
    description: { vi: 'Thư giãn cơ thể với liệu trình chăm sóc toàn thân.', en: 'Relax with a restorative full body treatment.' },
    image: bodyImage,
    keywords: 'body massage massage body toàn thân thư giãn',
  },
  {
    id: 'facial',
    name: { vi: 'Massage mặt', en: 'Facial massage' },
    description: { vi: 'Chăm sóc nhẹ nhàng, giúp làn da tươi sáng và thư thái.', en: 'A gentle facial ritual for refreshed, radiant skin.' },
    image: facialImage,
    keywords: 'mặt facial da massage chăm sóc skin',
  },
  {
    id: 'acupressure',
    name: { vi: 'Bấm huyệt', en: 'Acupressure' },
    description: { vi: 'Liệu trình thư giãn tập trung vào các huyệt đạo.', en: 'A relaxing treatment focused on pressure points.' },
    image: acupressureImage,
    keywords: 'bấm huyệt massage pressure thư giãn',
  },
  {
    id: 'acne',
    name: { vi: 'Nặn mụn', en: 'Acne care' },
    description: { vi: 'Làm sạch và chăm sóc da theo tình trạng của bạn.', en: 'A cleansing facial tailored to your skin needs.' },
    image: acneImage,
    keywords: 'mụn acne nặn mụn chăm sóc da facial',
  },
  {
    id: 'headspa',
    name: { vi: 'Gội đầu thư giãn', en: 'Relaxing head spa' },
    description: { vi: 'Thả lỏng với liệu trình gội đầu và massage da đầu.', en: 'Unwind with a soothing wash and scalp massage.' },
    image: headSpaImage,
    keywords: 'gội đầu head spa tóc massage thư giãn hair',
  },
]

const featuredServices = services

const copy = {
  vi: {
    heroKicker: 'ANH THƠ BEAUTY & SPA',
    heroTitle: 'Chăm sóc vẻ đẹp, nâng niu những phút giây thư thái',
    heroDescription: 'Dành thời gian cho chính mình với các liệu trình chăm sóc da và cơ thể được thực hiện tận tâm.',
    book: 'Đặt lịch tư vấn',
    explore: 'Khám phá dịch vụ',
    welcome: 'Chào mừng bạn đến với Anh Thơ Beauty & Spa',
    servicesTitle: 'Chăm sóc chuyên sâu, vẻ đẹp bền lâu',
    servicesIntro: 'Chọn dịch vụ bạn quan tâm để xem thông tin và đặt lịch.',
    choose: 'Chọn dịch vụ',
    addToCart: 'Thêm vào giỏ',
    promotionCta: 'Khám phá các dịch vụ ưu đãi',
    aboutTitle: 'Về Anh Thơ Beauty & Spa',
    aboutText: 'Spa Anh Thơ là không gian chăm sóc sắc đẹp và thư giãn dành cho những ai muốn tìm lại sự cân bằng và vẻ đẹp tự nhiên. Đội ngũ của chúng tôi lắng nghe nhu cầu của từng khách hàng, tư vấn rõ ràng và chăm sóc tận tâm trong từng liệu trình.',
    aboutMore: 'Tại spa, bạn có thể lựa chọn các dịch vụ chăm sóc da, massage thư giãn, bấm huyệt và chăm sóc cơ thể. Hãy để lại thông tin đặt lịch, chúng tôi sẽ liên hệ để cùng bạn chọn thời gian phù hợp.',
    readMore: 'Xem thêm',
    readLess: 'Thu gọn',
    reviewsTitle: 'Khách hàng nói gì',
    bookingTitle: 'Đặt lịch chăm sóc',
    name: 'Họ và tên',
    phone: 'Số điện thoại',
    selectService: 'Chọn dịch vụ',
    appointmentTime: 'Ngày và giờ mong muốn',
    submitBooking: 'Gửi yêu cầu đặt lịch',
    sending: 'Đang gửi…',
    success: 'Đã nhận yêu cầu. Anh Thơ Spa sẽ liên hệ xác nhận lịch với bạn.',
    emptyCart: 'Giỏ dịch vụ đang trống. Chọn dịch vụ bạn quan tâm để thêm vào đây.',
    cartTitle: 'Dịch vụ đã chọn',
    contactTitle: 'Chăm sóc khách hàng',
    contactText: 'Bạn chưa cần tạo tài khoản để đặt lịch. Gửi yêu cầu, gọi cho spa hoặc nhắn WhatsApp để được tư vấn.',
    accountBook: 'Đến form đặt lịch',
    remove: 'Xóa',
    continueShopping: 'Tiếp tục chọn dịch vụ',
    searchEmpty: 'Không tìm thấy dịch vụ phù hợp. Hãy thử từ khóa khác.',
    allServices: 'Tất cả dịch vụ',
    bookingError: 'Chưa gửi được yêu cầu. Hãy kiểm tra kết nối backend và MySQL rồi thử lại.',
    reviewQuotes: [
      'Dịch vụ tốt, nhân viên nhiệt tình, tôi sẽ quay lại.',
      'Không gian thư giãn, chăm sóc rất nhẹ nhàng và chu đáo.',
      'Da cải thiện rõ rệt sau liệu trình. Rất đáng trải nghiệm!',
    ],
  },
  en: {
    heroKicker: 'ANH THO BEAUTY & SPA',
    heroTitle: 'Thoughtful care for your beauty and wellbeing',
    heroDescription: 'Make time for yourself with attentive skin and body treatments in a calm, welcoming space.',
    book: 'Book a consultation',
    explore: 'Explore treatments',
    welcome: 'Welcome to Anh Tho Beauty & Spa',
    servicesTitle: 'Expert care, lasting beauty',
    servicesIntro: 'Choose a treatment to see details and make an appointment.',
    choose: 'Choose treatment',
    addToCart: 'Add to bag',
    promotionCta: 'Explore spa offers',
    aboutTitle: 'About Anh Tho Beauty & Spa',
    aboutText: 'Anh Tho Spa is a welcoming space for beauty care and relaxation. Our team listens to each guest, offers clear guidance, and provides attentive care throughout every treatment.',
    aboutMore: 'Choose from skin care, relaxing massage, acupressure, and body treatments. Send an appointment request and we will help you find a convenient time.',
    readMore: 'Read more',
    readLess: 'Show less',
    reviewsTitle: 'What our guests say',
    bookingTitle: 'Book your treatment',
    name: 'Full name',
    phone: 'Phone number',
    selectService: 'Choose a treatment',
    appointmentTime: 'Preferred date and time',
    submitBooking: 'Request an appointment',
    sending: 'Sending…',
    success: 'Request received. Anh Tho Spa will contact you to confirm your appointment.',
    emptyCart: 'Your bag is empty. Add a treatment you are interested in.',
    cartTitle: 'Selected treatments',
    contactTitle: 'Guest care',
    contactText: 'You do not need an account to book. Send a request, call the spa, or message us on WhatsApp.',
    accountBook: 'Go to appointment form',
    remove: 'Remove',
    continueShopping: 'Explore treatments',
    searchEmpty: 'No matching treatments. Try another search term.',
    allServices: 'All treatments',
    bookingError: 'Your request could not be sent. Check the backend and MySQL connection, then try again.',
    reviewQuotes: [
      'Lovely service and such a caring team. I will be back.',
      'A calm space and a very relaxing, attentive treatment.',
      'My skin feels so much better after the treatment. Highly recommend!',
    ],
  },
} as const

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim()
}

function getNextHour() {
  const date = new Date()
  date.setHours(date.getHours() + 1, 0, 0, 0)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 16)
}

function loadCart(): CartItem[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem('anhtho-spa-cart') ?? '[]')
    if (!Array.isArray(saved)) return []
    return saved.filter((item): item is CartItem =>
      item &&
      typeof item.serviceId === 'string' &&
      services.some((service) => service.id === item.serviceId) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0,
    )
  } catch {
    return []
  }
}

function Home() {
  const [reviewIndex, setReviewIndex] = useState(0)
  const [bookingState, setBookingState] = useState<BookingState>('idle')
  const [bookingError, setBookingError] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>(loadCart)
  const [activeModal, setActiveModal] = useState<'cart' | 'account' | null>(null)
  const [aboutExpanded, setAboutExpanded] = useState(false)
  const [language, setLanguage] = useState<SiteLanguage>('vi')
  const [highContrast, setHighContrast] = useState(false)
  const content = copy[language]

  useEffect(() => {
    localStorage.setItem('anhtho-spa-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const revealTargets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger]')
    if (!('IntersectionObserver' in window)) {
      revealTargets.forEach((target) => target.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' })

    revealTargets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  const visibleServices = useMemo(() => {
    if (!searchQuery) return featuredServices
    const query = normalize(searchQuery)
    return services.filter((service) =>
      normalize(`${service.name.vi} ${service.name.en} ${service.description.vi} ${service.keywords}`).includes(query),
    )
  }, [searchQuery])

  const selectedCartItems = cart
    .map((item) => ({
      ...item,
      service: services.find((service) => service.id === item.serviceId),
    }))
    .filter((item): item is CartItem & { service: Service } => Boolean(item.service))
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  function scrollToBooking(serviceId?: string) {
    if (serviceId) setSelectedService(serviceId)
    setBookingState('idle')
    setBookingError('')
    setActiveModal(null)
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.setTimeout(() => document.getElementById('booking-name')?.focus({ preventScroll: true }), 350)
  }

  function addToCart(serviceId: string) {
    setCart((current) => {
      const existing = current.find((item) => item.serviceId === serviceId)
      if (existing) {
        return current.map((item) => item.serviceId === serviceId
          ? { ...item, quantity: item.quantity + 1 }
          : item)
      }
      return [...current, { serviceId, quantity: 1 }]
    })
  }

  function removeFromCart(serviceId: string) {
    setCart((current) => current.filter((item) => item.serviceId !== serviceId))
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const chosenService = services.find((service) => service.id === String(formData.get('service')))

    setBookingState('sending')
    setBookingError('')

    try {
      const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')
      const response = await fetch(`${apiBase}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          phone: formData.get('phone'),
          service: chosenService?.name[language] ?? '',
          appointmentAt: formData.get('appointmentAt'),
        }),
      })
      const result = await response.json().catch(() => ({})) as { message?: string | string[] }
      if (!response.ok) {
        const message = Array.isArray(result.message) ? result.message.join(' ') : result.message
        throw new Error(message || content.bookingError)
      }
      form.reset()
      setSelectedService('')
      setBookingState('success')
    } catch (error) {
      setBookingState('error')
      setBookingError(error instanceof Error ? error.message : content.bookingError)
    }
  }

  const promotionServices = [services[0], services[1], services[3], services[4]]

  return (
    <main className={`site-shell${highContrast ? ' high-contrast' : ''}`}>
      <Navbar
        activeHref="#home"
        cartCount={cartCount}
        highContrast={highContrast}
        language={language}
        onContrastChange={setHighContrast}
        onLanguageChange={setLanguage}
        onOpenAccount={() => { window.location.href = '/login' }}
        onOpenCart={() => setActiveModal('cart')}
        onSearch={setSearchQuery}
      />

      <section className="hero-section" id="home" aria-label="Anh Thơ Beauty & Spa" data-reveal>
        <div className="hero-copy">
          <p className="hero-kicker">{content.heroKicker}</p>
          <h1>{content.heroTitle}</h1>
          <p className="hero-description">{content.heroDescription}</p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => scrollToBooking()} type="button">
              <Icon name="calendar" size={18} /> {content.book}
            </button>
            <a className="text-action" href="#services">{content.explore} <span aria-hidden="true">→</span></a>
          </div>
          <div className="hero-trust"><span>✦</span> {language === 'vi' ? 'Tận tâm trong từng liệu trình' : 'Thoughtful care in every treatment'}</div>
        </div>
        <div className="hero-visual">
          <img src={heroImage} alt={language === 'vi' ? 'Khách hàng thư giãn tại spa' : 'A guest relaxing at the spa'} />
          <div className="hero-note"><span>ANH THƠ</span><small>Beauty in balance</small></div>
        </div>
      </section>

      <a className="floating-call" href="tel:08686868686" aria-label={language === 'vi' ? 'Gọi Anh Thơ Spa' : 'Call Anh Tho Spa'}>
        <Icon name="phone" size={24} />
      </a>
      <a
        className="floating-message"
        href="https://wa.me/8486868686"
        target="_blank"
        rel="noreferrer"
        aria-label={language === 'vi' ? 'Nhắn tin WhatsApp cho Anh Thơ Spa' : 'Message Anh Tho Spa on WhatsApp'}
        title={language === 'vi' ? 'Nhắn tin WhatsApp' : 'Message on WhatsApp'}
      >
        <Icon name="whatsapp" size={25} />
      </a>

      <div className="welcome-title" data-reveal>{content.welcome}</div>

      <section className="services-section" id="services" data-reveal>
        <div className="section-heading">
          <div>
            <p className="eyebrow">{language === 'vi' ? 'DỊCH VỤ CỦA CHÚNG TÔI' : 'OUR TREATMENTS'}</p>
            <h2>{content.servicesTitle}</h2>
            <p>{content.servicesIntro}</p>
          </div>
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')} type="button">
              {content.allServices} <span aria-hidden="true">×</span>
            </button>
          )}
        </div>

        {visibleServices.length > 0 ? (
          <div className="service-grid" data-reveal-stagger>
            {visibleServices.map((service) => (
              <article className="service-card service-card--round" key={service.id}>
                <button className="service-image-button" onClick={() => scrollToBooking(service.id)} type="button" aria-label={`${content.choose}: ${service.name[language]}`}>
                  <img src={service.image} alt="" />
                </button>
                <div className="service-card-copy">
                  <h3>{service.name[language]}</h3>
                  <p>{service.description[language]}</p>
                  <div className="service-card-actions">
                    <button className="card-book-button" onClick={() => scrollToBooking(service.id)} type="button">{content.book}</button>
                    <button className="card-add-button" onClick={() => addToCart(service.id)} type="button" aria-label={`${content.addToCart}: ${service.name[language]}`} title={content.addToCart}>
                      <Icon name="bag" size={19} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-search" role="status">{content.searchEmpty}</div>
        )}
      </section>

      <section className="promotions-section" id="promotions" aria-label={language === 'vi' ? 'Ưu đãi dịch vụ' : 'Spa offers'} data-reveal>
        <div className="promo-gallery">
          {promotionServices.map((service) => (
            <button
              className="promo-tile"
              key={`promotion-${service.id}`}
              onClick={() => scrollToBooking(service.id)}
              type="button"
              aria-label={`${content.book}: ${service.name[language]}`}
            >
              <img src={service.image} alt="" />
              <span>{service.name[language]}</span>
            </button>
          ))}
          <button
            className="promo-explore"
            onClick={() => {
              setSearchQuery('')
              document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
            }}
            type="button"
          >
            {content.promotionCta} <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <section className="about-section" id="about" data-reveal>
        <div className="about-image-wrap"><img src={aboutImage} alt={language === 'vi' ? 'Không gian thư giãn tại Anh Thơ Spa' : 'A relaxing space at Anh Tho Spa'} /></div>
        <div className="about-copy">
          <p className="eyebrow">{language === 'vi' ? 'VỀ CHÚNG TÔI' : 'OUR STORY'}</p>
          <h2>{content.aboutTitle}</h2>
          <p>{content.aboutText}</p>
          {aboutExpanded && <p className="about-extra">{content.aboutMore}</p>}
          <button className="small-button" onClick={() => setAboutExpanded(!aboutExpanded)} type="button">
            {aboutExpanded ? content.readLess : content.readMore} <span aria-hidden="true">{aboutExpanded ? '−' : '+'}</span>
          </button>
        </div>
      </section>

      <section className="engagement-section" data-reveal>
        <div className="review-panel">
          <p className="eyebrow">{language === 'vi' ? 'LỜI NHẮN TỪ KHÁCH HÀNG' : 'KIND WORDS'}</p>
          <h2>{content.reviewsTitle}</h2>
          <div className="review-card">
            <button className="review-arrow" aria-label={language === 'vi' ? 'Đánh giá trước' : 'Previous review'} onClick={() => setReviewIndex((reviewIndex + content.reviewQuotes.length - 1) % content.reviewQuotes.length)} type="button">‹</button>
            <img src={reviewImage} alt={language === 'vi' ? 'Khách hàng của Anh Thơ Spa' : 'An Anh Tho Spa guest'} />
            <div className="review-content">
              <div className="stars" aria-label="5 stars">★★★★★</div>
              <p>{content.reviewQuotes[reviewIndex]}</p>
            </div>
            <button className="review-arrow" aria-label={language === 'vi' ? 'Đánh giá tiếp theo' : 'Next review'} onClick={() => setReviewIndex((reviewIndex + 1) % content.reviewQuotes.length)} type="button">›</button>
          </div>
        </div>

        <div className="booking-panel" id="booking">
          <div className="booking-heading">
            <p className="eyebrow">{language === 'vi' ? 'CHÚNG TÔI SẴN SÀNG LẮNG NGHE' : 'WE ARE HERE TO HELP'}</p>
            <h2>{content.bookingTitle}</h2>
          </div>
          <form onSubmit={submitBooking}>
            <label className="visually-hidden" htmlFor="booking-name">{content.name}</label>
            <input id="booking-name" name="name" placeholder={content.name} minLength={2} maxLength={120} autoComplete="name" required />
            <label className="visually-hidden" htmlFor="booking-phone">{content.phone}</label>
            <input id="booking-phone" name="phone" type="tel" placeholder={content.phone} autoComplete="tel" pattern="[+0-9 ().-]{9,20}" title={language === 'vi' ? 'Nhập số điện thoại hợp lệ' : 'Enter a valid phone number'} required />
            <label className="visually-hidden" htmlFor="booking-service">{content.selectService}</label>
            <select id="booking-service" name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)} required>
              <option value="" disabled>{content.selectService}</option>
              {services.map((service) => <option key={service.id} value={service.id}>{service.name[language]}</option>)}
            </select>
            <label className="datetime-label" htmlFor="booking-time">{content.appointmentTime}</label>
            <input id="booking-time" name="appointmentAt" type="datetime-local" min={getNextHour()} required />
            <button className="booking-submit" disabled={bookingState === 'sending'} type="submit">
              {bookingState === 'sending' ? content.sending : content.submitBooking}
            </button>
            {bookingState === 'success' && <p className="booking-confirmation success" role="status">{content.success}</p>}
            {bookingState === 'error' && <p className="booking-confirmation error" role="alert">{bookingError || content.bookingError}</p>}
          </form>
        </div>
      </section>

      <Footer year={2026} language={language} />

      {activeModal === 'cart' && (
        <Modal title={content.cartTitle} onClose={() => setActiveModal(null)}>
          <div className="modal-body">
            {selectedCartItems.length === 0 ? (
              <p>{content.emptyCart}</p>
            ) : (
              <ul className="cart-list">
                {selectedCartItems.map(({ service, quantity }) => (
                  <li className="cart-item" key={service.id}>
                    <span>{service.name[language]}{quantity > 1 ? ` × ${quantity}` : ''}</span>
                    <div className="cart-item-actions">
                      <button type="button" onClick={() => scrollToBooking(service.id)}>{content.book}</button>
                      <button type="button" onClick={() => removeFromCart(service.id)}>{content.remove}</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="modal-actions">
              <button className="secondary-action" onClick={() => setActiveModal(null)} type="button">{content.continueShopping}</button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'account' && (
        <Modal title={content.contactTitle} onClose={() => setActiveModal(null)}>
          <div className="modal-body">
            <p>{content.contactText}</p>
            <div className="modal-actions">
              <button onClick={() => scrollToBooking()} type="button">{content.accountBook}</button>
              <a href="tel:08686868686"><Icon name="phone" size={17} /> {language === 'vi' ? 'Gọi 0868 686 8686' : 'Call 0868 686 8686'}</a>
            </div>
          </div>
        </Modal>
      )}
    </main>
  )
}

export default Home
