import { useEffect, useState } from 'react'
import '../../css/App.css'
import { Footer } from '../../components/Footer'
import { Icon } from '../../components/Icon'
import { Navbar, type SiteLanguage } from '../../components/Navbar'
import '../../css/Services.css'

type Treatment = {
  id: string
  name: Record<SiteLanguage, string>
  short: Record<SiteLanguage, string>
  detail: Record<SiteLanguage, string>
  subtitle: Record<SiteLanguage, string>
  price: string
  image: string
  secondary: string[]
}

const treatments: Treatment[] = [
  {
    id: 'facial',
    name: { vi: 'Chăm sóc da mặt', en: 'Facial care' },
    short: { vi: 'Làm sạch · cấp ẩm · trẻ hóa làn da', en: 'Cleanse · hydrate · refresh' },
    detail: { vi: 'Liệu trình chăm sóc da mặt được điều chỉnh theo tình trạng da, kết hợp làm sạch sâu, cấp ẩm và massage thư giãn để làn da rạng rỡ, mềm mịn hơn.', en: 'A facial tailored to your skin, combining deep cleansing, hydration, and a relaxing massage for a refreshed, radiant complexion.' },
    subtitle: { vi: 'Làn da tươi sáng, mịn màng', en: 'A fresh, radiant complexion' },
    price: '299.000đ', image: '/home/service-facial.png', secondary: ['/home/service-acne.png', '/home/service-body.png', '/home/service-facial.png'],
  },
  {
    id: 'massage',
    name: { vi: 'Massage thư giãn', en: 'Relaxing massage' },
    short: { vi: 'Thả lỏng · cân bằng · phục hồi', en: 'Unwind · rebalance · restore' },
    detail: { vi: 'Những động tác massage nhẹ nhàng giúp cơ thể thả lỏng, xoa dịu căng thẳng và đưa bạn trở về trạng thái cân bằng.', en: 'Gentle massage techniques help release tension, relax the body, and restore a sense of balance.' },
    subtitle: { vi: 'Thư giãn sâu, tái tạo năng lượng', en: 'Deep relaxation, renewed energy' },
    price: '349.000đ', image: '/home/service-acupressure.png', secondary: ['/home/service-body.png', '/home/service-headspa.png', '/home/service-acupressure.png'],
  },
  {
    id: 'body',
    name: { vi: 'Chăm sóc body', en: 'Body care' },
    short: { vi: 'Thư giãn · thải độc · tôn dáng', en: 'Relax · refresh · renew' },
    detail: { vi: 'Liệu trình chăm sóc body tại Anh Thơ kết hợp massage chuyên sâu cùng tinh chất thiên nhiên, giúp cơ thể thư giãn và làn da mềm mại, săn chắc hơn.', en: 'A restorative body ritual pairing expert massage with natural care to relax the body and leave skin feeling soft and smooth.' },
    subtitle: { vi: 'Chăm sóc toàn thân chuyên sâu', en: 'A complete body ritual' },
    price: '399.000đ', image: '/home/service-body.png', secondary: ['/home/service-body.png', '/home/service-acupressure.png', '/home/about-collage.png'],
  },
  {
    id: 'acne',
    name: { vi: 'Chăm sóc da mụn', en: 'Acne care' },
    short: { vi: 'Làm sạch · dịu da · chăm sóc đúng cách', en: 'Cleanse · calm · care' },
    detail: { vi: 'Chăm sóc da mụn nhẹ nhàng với quy trình làm sạch và lựa chọn sản phẩm phù hợp, giúp làn da thông thoáng và dễ chịu hơn.', en: 'A gentle acne-care routine with a thorough cleanse and products selected for your skin, leaving it calm and comfortable.' },
    subtitle: { vi: 'Dịu nhẹ theo tình trạng làn da', en: 'Gentle care for your skin' },
    price: '329.000đ', image: '/home/service-acne.png', secondary: ['/home/service-facial.png', '/home/service-acne.png', '/home/about-collage.png'],
  },
  {
    id: 'headspa',
    name: { vi: 'Gội đầu thư giãn', en: 'Relaxing head spa' },
    short: { vi: 'Làm sạch · cấp ẩm · chăm sóc tóc', en: 'Cleanse · nourish · unwind' },
    detail: { vi: 'Gội đầu kết hợp massage da đầu nhẹ nhàng, giúp bạn thả lỏng sau ngày dài và chăm sóc tóc, da đầu một cách chu đáo.', en: 'A soothing hair wash with a gentle scalp massage to help you unwind and care for your hair and scalp.' },
    subtitle: { vi: 'Khoảng lặng thư thái cho bạn', en: 'A calming pause for you' },
    price: '249.000đ', image: '/home/service-headspa.png', secondary: ['/home/service-headspa.png', '/home/service-facial.png', '/home/about-collage.png'],
  },
]

export default function Services() {
  const [language, setLanguage] = useState<SiteLanguage>('vi')
  const [highContrast, setHighContrast] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(2)
  const [flippedId, setFlippedId] = useState<string | null>(null)
  const [pageDirection, setPageDirection] = useState(1)
  const selected = treatments[selectedIndex]
  const en = language === 'en'
  const menuPages = [-2, -1, 0, 1, 2].map((offset) => {
    const index = (selectedIndex + offset + treatments.length) % treatments.length
    return { treatment: treatments[index], index, offset }
  })

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
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  function moveSelection(direction: number) {
    const nextIndex = (selectedIndex + direction + treatments.length) % treatments.length
    setPageDirection(direction)
    setSelectedIndex(nextIndex)
    setFlippedId(null)
  }

  function selectTreatment(index: number) {
    const difference = index - selectedIndex
    setPageDirection(Math.abs(difference) > treatments.length / 2 ? -Math.sign(difference) : Math.sign(difference) || 1)
    setSelectedIndex(index)
    setFlippedId((current) => current === treatments[index].id ? null : treatments[index].id)
  }

  return (
    <main className={`site-shell services-page${highContrast ? ' high-contrast' : ''}`}>
      <Navbar
        page="services"
        activeHref="/services"
        language={language}
        highContrast={highContrast}
        onLanguageChange={setLanguage}
        onContrastChange={setHighContrast}
        onOpenCart={() => { window.location.href = '/#booking' }}
        onOpenAccount={() => { window.location.href = '/login' }}
      />

      <section className="services-hero">
        <img src="/home/spa-model.png" alt="" />
        <div className="services-hero-copy">
          <p className="services-script">{en ? 'Treatments' : 'Dịch vụ'}</p>
          <h1>{en ? <>Complete beauty<br />and wellness care</> : <>Chăm sóc sắc đẹp<br /><em>toàn diện</em></>}</h1>
          <p>{en ? 'Discover thoughtful treatments to help you relax, restore, and feel your best.' : 'Tại Anh Thơ Beauty & Spa, chúng tôi mang đến đa dạng liệu trình chăm sóc, giúp bạn thư giãn, phục hồi và tỏa sáng vẻ đẹp tự nhiên.'}</p>
        </div>
      </section>

      <section className="services-book-heading">
        <p>{en ? 'Explore our treatments' : 'Khám phá các dịch vụ của chúng tôi'}</p>
        <h2>{en ? 'Find the ritual that feels right' : 'Lựa chọn liệu trình phù hợp'}</h2>
        <div className="services-heading-flourish"><span /><b>❀</b><span /></div>
      </section>

      <section className="treatment-menu" aria-label={en ? 'Treatment menu' : 'Menu dịch vụ'}>
        <button className="menu-arrow menu-arrow--left" onClick={() => moveSelection(-1)} type="button" aria-label={en ? 'Previous treatment' : 'Dịch vụ trước'}>
          <Icon name="chevron" size={20} />
        </button>
        <div className={`menu-book-row ${pageDirection > 0 ? 'turn-forward' : 'turn-back'}`} key={selected.id}>
          {menuPages.map(({ treatment, index, offset }) => (
            <article className={`menu-book menu-book--${offset === 0 ? 'center' : Math.abs(offset) === 1 ? (offset < 0 ? 'left' : 'right') : (offset < 0 ? 'far-left' : 'far-right')}${selectedIndex === index ? ' is-selected' : ''}${flippedId === treatment.id ? ' is-flipped' : ''}`} key={treatment.id}>
              <div className="menu-book-inner">
                <div className="menu-book-face menu-book-front">
                  <button className="menu-book-cover" type="button" onClick={() => selectTreatment(index)} aria-label={`${en ? 'View' : 'Xem'} ${treatment.name[language]}`}>
                    <img src={treatment.image} alt="" />
                    <span className="menu-book-title">{treatment.name[language]}</span>
                    <span className="menu-book-short">{treatment.short[language]}</span>
                    <span className="menu-book-hint">{en ? 'Turn the page' : 'Lật xem'} <span aria-hidden="true">↗</span></span>
                  </button>
                </div>
                <div className="menu-book-face menu-book-back">
                  <p className="eyebrow">{en ? 'TREATMENT' : 'LIỆU TRÌNH'}</p>
                  <h3>{treatment.name[language]}</h3>
                  <p>{treatment.short[language]}</p>
                  <strong>{en ? 'From ' : 'Chỉ từ '}{treatment.price}</strong>
                  <button type="button" onClick={() => { setSelectedIndex(index); document.getElementById('treatment-detail')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    {en ? 'View details' : 'Xem chi tiết'} →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <button className="menu-arrow menu-arrow--right" onClick={() => moveSelection(1)} type="button" aria-label={en ? 'Next treatment' : 'Dịch vụ tiếp theo'}>
          <Icon name="chevron" size={20} />
        </button>
        <div className="menu-dots" aria-label={en ? 'Select a treatment' : 'Chọn dịch vụ'}>
          {treatments.map((treatment, index) => (
            <button className={selectedIndex === index ? 'active' : ''} key={treatment.id} onClick={() => { selectTreatment(index); setFlippedId(null) }} type="button" aria-label={`${en ? 'Go to' : 'Đến'} ${treatment.name[language]}`} />
          ))}
        </div>
      </section>

      <section className="treatment-detail" id="treatment-detail" data-reveal>
        <div className="treatment-gallery">
          <img className="treatment-main-image" src={selected.image} alt={selected.name[language]} key={selected.image} />
          <div className="treatment-thumbnails">
            {selected.secondary.map((image, index) => <img src={image} alt="" key={`${image}-${index}`} />)}
          </div>
          <span className="treatment-count">{selectedIndex + 1}/{treatments.length}</span>
        </div>
        <div className="treatment-copy" key={selected.id}>
          <span className="treatment-label">{en ? 'FEATURED TREATMENT' : 'DỊCH VỤ NỔI BẬT'}</span>
          <h2>{selected.name[language]} {en ? 'ritual' : 'cao cấp'}</h2>
          <h3>{selected.subtitle[language]}</h3>
          <p>{selected.detail[language]}</p>
          <div className="treatment-actions">
            <span>{en ? 'From ' : 'Chỉ từ '}{selected.price}</span>
            <a href="/#booking">{en ? 'Book now' : 'Đặt lịch ngay'}</a>
          </div>
        </div>
      </section>

      <section className="services-reasons" data-reveal>
        <div className="services-reasons-copy">
          <p className="eyebrow">{en ? 'WHY ANH THO' : 'VÌ SAO NÊN CHỌN'}</p>
          <h2>{en ? 'Care that feels personal' : 'Anh Thơ Beauty & Spa?'}</h2>
          <p>{en ? 'A caring team, a peaceful setting, and thoughtful treatments designed around you.' : 'Chúng tôi luôn đặt sự hài lòng lên hàng đầu, với không gian thư giãn, đội ngũ chuyên viên giàu kinh nghiệm và liệu trình phù hợp.'}</p>
          <a href="/about">{en ? 'Learn about us' : 'Tìm hiểu thêm'} →</a>
        </div>
        {[
          { title: en ? 'Expert team' : 'Đội ngũ chuyên viên', text: en ? 'Experienced, caring professionals' : 'Giàu kinh nghiệm, tận tâm' },
          { title: en ? 'Quality products' : 'Sản phẩm cao cấp', text: en ? 'Carefully selected for you' : 'An toàn, lành tính, hiệu quả' },
          { title: en ? 'A calm space' : 'Không gian thư giãn', text: en ? 'A peaceful moment to recharge' : 'Sang trọng, riêng tư, ấm cúng' },
          { title: en ? 'Modern care' : 'Công nghệ hiện đại', text: en ? 'Thoughtful techniques, clear results' : 'Liệu trình chuẩn khoa học' },
        ].map((reason) => (
          <article className="service-reason-card" key={reason.title}>
            <span aria-hidden="true">✿</span>
            <h3>{reason.title}</h3>
            <p>{reason.text}</p>
          </article>
        ))}
      </section>

      <div className="service-floating-links">
        <a className="floating-call" href="tel:08686868686" aria-label={en ? 'Call Anh Tho Spa' : 'Gọi Anh Thơ Spa'}><Icon name="phone" size={22} /></a>
        <a className="floating-message" href="https://wa.me/8486868686" target="_blank" rel="noreferrer" aria-label={en ? 'Message on WhatsApp' : 'Nhắn tin WhatsApp'}><Icon name="whatsapp" size={24} /></a>
      </div>
      <Footer year={2026} language={language} />
    </main>
  )
}
