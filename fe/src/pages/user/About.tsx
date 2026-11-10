import { useEffect, useState } from 'react'
import '../../css/App.css'
import { Footer } from '../../components/Footer'
import { Icon } from '../../components/Icon'
import { Navbar, type SiteLanguage } from '../../components/Navbar'
import '../../css/About.css'

const values = [
  {
    icon: '♡',
    viTitle: 'Tận tâm',
    enTitle: 'Thoughtful care',
    viText: 'Luôn đặt trải nghiệm và sự hài lòng của khách hàng lên hàng đầu.',
    enText: 'Your comfort and experience always come first.',
  },
  {
    icon: '✿',
    viTitle: 'Chuyên nghiệp',
    enTitle: 'Professional',
    viText: 'Đội ngũ được đào tạo bài bản, chăm sóc bạn bằng sự chu đáo.',
    enText: 'A trained team that looks after every detail.',
  },
  {
    icon: '✧',
    viTitle: 'An toàn',
    enTitle: 'Safe',
    viText: 'Sản phẩm rõ nguồn gốc và quy trình vệ sinh nghiêm túc.',
    enText: 'Trusted products and careful hygiene at every step.',
  },
  {
    icon: '❀',
    viTitle: 'Cá nhân hóa',
    enTitle: 'Personalized',
    viText: 'Liệu trình được tư vấn phù hợp với nhu cầu riêng của bạn.',
    enText: 'Treatments are tailored to your individual needs.',
  },
]

export default function About() {
  const [language, setLanguage] = useState<SiteLanguage>('vi')
  const [highContrast, setHighContrast] = useState(false)
  const en = language === 'en'

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger]')
    const counters = document.querySelectorAll<HTMLElement>('[data-count]')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    counters.forEach((counter) => {
      const target = Number(counter.dataset.count)
      const suffix = counter.dataset.suffix ?? ''
      counter.textContent = reduceMotion ? `${target}${suffix}` : `0${suffix}`
    })

    if (!('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-visible'))
      counters.forEach((counter) => {
        counter.textContent = `${counter.dataset.count}${counter.dataset.suffix ?? ''}`
      })
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

    targets.forEach((target) => observer.observe(target))

    const counterFrames = new Map<HTMLElement, number>()
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const counter = entry.target as HTMLElement
        const target = Number(counter.dataset.count)
        const suffix = counter.dataset.suffix ?? ''
        const startTime = performance.now()
        const duration = 1500

        function updateCount(now: number) {
          const progress = Math.min((now - startTime) / duration, 1)
          const easedProgress = 1 - (1 - progress) ** 3
          counter.textContent = `${Math.round(target * easedProgress)}${suffix}`
          if (progress < 1) counterFrames.set(counter, requestAnimationFrame(updateCount))
        }

        counterFrames.set(counter, requestAnimationFrame(updateCount))
        counterObserver.unobserve(counter)
      })
    }, { threshold: 0.45 })

    if (!reduceMotion) counters.forEach((counter) => counterObserver.observe(counter))
    return () => {
      observer.disconnect()
      counterObserver.disconnect()
      counterFrames.forEach((frame) => cancelAnimationFrame(frame))
    }
  }, [])

  return (
    <main className={`site-shell about-page${highContrast ? ' high-contrast' : ''}`}>
      <Navbar
        page="about"
        activeHref="/about"
        language={language}
        highContrast={highContrast}
        onLanguageChange={setLanguage}
        onContrastChange={setHighContrast}
        onOpenCart={() => { window.location.href = '/#booking' }}
        onOpenAccount={() => { window.location.href = '/login' }}
      />

      <section className="about-hero" aria-label={en ? 'About Anh Tho Beauty & Spa' : 'Về Anh Thơ Beauty & Spa'}>
        <img src="/home/about-collage.png" alt="" />
        <div className="about-hero-copy">
          <p className="eyebrow">{en ? 'ABOUT US' : 'VỀ CHÚNG TÔI'}</p>
          <h1>ANH THƠ<br />BEAUTY &amp; SPA</h1>
          <p className="about-hero-script">{en ? 'Beauty, cared for with heart' : 'Nơi vẻ đẹp được nâng niu'}</p>
          <p className="about-hero-description">
            {en
              ? 'We believe everyone deserves thoughtful care. Discover a calm space and treatments designed around you.'
              : 'Chúng tôi tin rằng mỗi người đều xứng đáng được chăm sóc và yêu thương. Anh Thơ Beauty & Spa mang đến những liệu trình an toàn, thư giãn và tận tâm.'}
          </p>
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-image">
          <img src="/home/spa-model.png" alt={en ? 'A guest relaxing during a spa treatment' : 'Khách hàng thư giãn trong liệu trình chăm sóc tại spa'} />
          <span>{en ? 'A moment just for you' : 'Một khoảng thời gian dành riêng cho bạn'}</span>
        </div>
        <div className="about-story-copy">
          <p className="eyebrow">{en ? 'OUR STORY' : 'GIỚI THIỆU'}</p>
          <h2>{en ? 'A journey to care for beauty from within' : 'Hành trình kiến tạo vẻ đẹp từ tâm'}</h2>
          <p>
            {en
              ? 'Anh Tho Beauty & Spa is a place to slow down, recharge, and feel cared for. We combine attentive service with carefully selected treatments to help every guest feel comfortable and confident.'
              : 'Anh Thơ Beauty & Spa là thương hiệu chăm sóc sắc đẹp và thư giãn cao cấp, được thành lập với mong muốn mang đến cho khách hàng những liệu trình an toàn, hiệu quả và cá nhân hóa. Chúng tôi không chỉ chăm sóc làn da, vóc dáng mà còn đồng hành cùng bạn trên hành trình tìm lại sự tự tin và cân bằng trong cuộc sống.'}
          </p>
          <a className="about-cta" href="/#services">
            {en ? 'Explore our services' : 'Khám phá dịch vụ'} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="about-values" data-reveal-stagger aria-label={en ? 'Our values' : 'Giá trị cốt lõi'}>
        <div className="about-values-lead">
          <p className="eyebrow">{en ? 'WHAT WE BELIEVE IN' : 'GIÁ TRỊ CỐT LÕI'}</p>
          <h2>{en ? 'Care that makes a difference' : 'Điều làm nên sự khác biệt'}</h2>
        </div>
        {values.map((value) => (
          <article className="about-value" key={value.viTitle}>
            <span className="about-value-icon" aria-hidden="true">{value.icon}</span>
            <h3>{en ? value.enTitle : value.viTitle}</h3>
            <p>{en ? value.enText : value.viText}</p>
          </article>
        ))}
      </section>

      <section className="about-experience">
        <div className="about-experience-copy">
          <p className="eyebrow">{en ? 'THE ANH THO EXPERIENCE' : 'TRẢI NGHIỆM TẠI ANH THƠ'}</p>
          <h2>{en ? 'More than beauty, a moment to restore yourself' : 'Không chỉ làm đẹp, mà là một trải nghiệm'}</h2>
          <p>
            {en
              ? 'We bring modern techniques and thoughtful rituals together in a peaceful setting. Take a breath, leave the rush behind, and let our team care for you.'
              : 'Tại Anh Thơ, chúng tôi kết hợp công nghệ hiện đại và liệu pháp thiên nhiên, mang đến không gian thư giãn tuyệt đối. Hãy dành thời gian cho bản thân và tận hưởng trải nghiệm chăm sóc dịu dàng, tận tâm.'}
          </p>
          <a className="about-cta" href="/#booking">
            {en ? 'Book a visit' : 'Đặt lịch trải nghiệm'} <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="about-photo-grid">
          <img className="about-photo-main" src="/home/about-collage.png" alt={en ? 'A peaceful spa interior' : 'Không gian thư giãn tại spa'} />
          <img src="/home/service-facial.png" alt={en ? 'A facial treatment' : 'Liệu trình chăm sóc da mặt'} />
          <img src="/home/service-headspa.png" alt={en ? 'A relaxing head spa treatment' : 'Liệu trình gội đầu thư giãn'} />
        </div>
      </section>

      <section className="about-stats" data-reveal-stagger aria-label={en ? 'Anh Tho Spa in numbers' : 'Anh Thơ qua những con số'}>
        <div><strong data-count="2000" data-suffix="+">0+</strong><span>{en ? 'Returning guests' : 'Khách hàng thân thiết'}</span></div>
        <div><strong data-count="10" data-suffix="+">0+</strong><span>{en ? 'Years of experience' : 'Năm kinh nghiệm'}</span></div>
        <div><strong data-count="20" data-suffix="+">0+</strong><span>{en ? 'Care services' : 'Dịch vụ chăm sóc'}</span></div>
        <div><strong data-count="100" data-suffix="%">0%</strong><span>{en ? 'Trusted products' : 'Sản phẩm chính hãng'}</span></div>
      </section>

      <div className="about-floating-links">
        <a className="floating-call" href="tel:08686868686" aria-label={en ? 'Call Anh Tho Spa' : 'Gọi Anh Thơ Spa'}><Icon name="phone" size={22} /></a>
        <a className="floating-message" href="https://wa.me/8486868686" target="_blank" rel="noreferrer" aria-label={en ? 'Message Anh Tho Spa on WhatsApp' : 'Nhắn tin WhatsApp cho Anh Thơ Spa'}><Icon name="whatsapp" size={24} /></a>
      </div>
      <Footer year={2026} language={language} />
    </main>
  )
}
