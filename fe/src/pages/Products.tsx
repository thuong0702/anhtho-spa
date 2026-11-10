import { useEffect, useMemo, useState } from 'react'
import '../App.css'
import { Footer } from '../components/Footer'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'
import { Navbar, type SiteLanguage } from '../components/Navbar'
import './Products.css'

export type ProductCategory = 'face' | 'body' | 'hair' | 'wellness' | 'gift'
export type Product = {
  id: string
  name: Record<SiteLanguage, string>
  category: ProductCategory
  categoryName: Record<SiteLanguage, string>
  description: Record<SiteLanguage, string>
  price: number
  oldPrice?: number
  image: string
  badge?: 'new' | 'best' | 'sale'
  rating: number
  reviews: number
}

export const products: Product[] = [
  { id: 'serum', name: { vi: 'Serum phục hồi da Anh Thơ Glow', en: 'Anh Tho Glow Repair Serum' }, category: 'face', categoryName: { vi: 'Chăm sóc da mặt', en: 'Face care' }, description: { vi: 'Cấp ẩm và nuôi dưỡng làn da rạng rỡ.', en: 'Hydrates and nourishes for a radiant glow.' }, price: 680000, oldPrice: 890000, image: '/products/serum.svg', badge: 'best', rating: 5, reviews: 155 },
  { id: 'cream', name: { vi: 'Kem dưỡng ẩm chuyên sâu', en: 'Deep Moisture Cream' }, category: 'face', categoryName: { vi: 'Chăm sóc da mặt', en: 'Face care' }, description: { vi: 'Dưỡng mềm, hỗ trợ hàng rào bảo vệ da.', en: 'Softens and supports the skin barrier.' }, price: 520000, image: '/products/cream.svg', badge: 'new', rating: 5, reviews: 82 },
  { id: 'cleanser', name: { vi: 'Sữa rửa mặt dịu nhẹ', en: 'Gentle Face Cleanser' }, category: 'face', categoryName: { vi: 'Chăm sóc da mặt', en: 'Face care' }, description: { vi: 'Làm sạch dịu nhẹ, không gây khô căng.', en: 'A gentle cleanse without dryness.' }, price: 320000, oldPrice: 390000, image: '/products/cleanser.svg', badge: 'sale', rating: 5, reviews: 96 },
  { id: 'body-oil', name: { vi: 'Tinh dầu dưỡng thể hoa cỏ', en: 'Botanical Body Oil' }, category: 'body', categoryName: { vi: 'Chăm sóc body', en: 'Body care' }, description: { vi: 'Nuôi dưỡng làn da mềm mại sau khi tắm.', en: 'Leaves skin feeling soft after bathing.' }, price: 450000, image: '/products/serum.svg', badge: 'new', rating: 5, reviews: 43 },
  { id: 'hair-serum', name: { vi: 'Tinh chất dưỡng tóc', en: 'Nourishing Hair Serum' }, category: 'hair', categoryName: { vi: 'Chăm sóc tóc', en: 'Hair care' }, description: { vi: 'Chăm sóc ngọn tóc khô xơ, tăng độ bóng mượt.', en: 'Nourishes dry ends for a silky finish.' }, price: 390000, image: '/products/cleanser.svg', rating: 4, reviews: 38 },
  { id: 'collagen', name: { vi: 'Thực phẩm bổ sung collagen', en: 'Collagen Wellness Blend' }, category: 'wellness', categoryName: { vi: 'Thực phẩm chức năng', en: 'Wellness' }, description: { vi: 'Bổ sung dưỡng chất cho quy trình chăm sóc toàn diện.', en: 'A thoughtful addition to your wellness routine.' }, price: 790000, image: '/products/cream.svg', badge: 'best', rating: 5, reviews: 71 },
  { id: 'gift-set', name: { vi: 'Bộ quà chăm sóc da', en: 'Skin Care Gift Set' }, category: 'gift', categoryName: { vi: 'Quà tặng', en: 'Gifts' }, description: { vi: 'Món quà dịu dàng dành cho người bạn yêu quý.', en: 'A gentle gift for someone you care about.' }, price: 980000, image: '/products/serum.svg', badge: 'new', rating: 5, reviews: 26 },
  { id: 'body-cream', name: { vi: 'Kem dưỡng thể mềm mịn', en: 'Silky Body Cream' }, category: 'body', categoryName: { vi: 'Chăm sóc body', en: 'Body care' }, description: { vi: 'Dưỡng ẩm mỗi ngày với hương thơm nhẹ nhàng.', en: 'Daily moisture with a soft, delicate scent.' }, price: 420000, oldPrice: 520000, image: '/products/cream.svg', badge: 'sale', rating: 5, reviews: 59 },
]

const categoryIcons: Record<ProductCategory, string> = { face: '♡', body: '♧', hair: '✿', wellness: '❋', gift: '✧' }

function formatPrice(price: number, en: boolean) {
  return `${new Intl.NumberFormat(en ? 'en-US' : 'vi-VN').format(price)}${en ? ' ₫' : 'đ'}`
}

export default function Products() {
  const [language, setLanguage] = useState<SiteLanguage>('vi')
  const [highContrast, setHighContrast] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'all'>('all')
  const [filter, setFilter] = useState<'all' | 'new' | 'sale' | 'best'>('all')
  const [featuredId, setFeaturedId] = useState('serum')
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem('anhtho-products-cart') ?? '{}')
      return stored && typeof stored === 'object' ? stored as Record<string, number> : {}
    } catch { return {} }
  })
  const [cartOpen, setCartOpen] = useState(() => new URLSearchParams(window.location.search).get('cart') === '1')
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
  }, [category, filter, searchQuery])

  useEffect(() => {
    localStorage.setItem('anhtho-products-cart', JSON.stringify(cart))
  }, [cart])

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category
    const matchesFilter = filter === 'all' || (filter === 'new' ? product.badge === 'new' : filter === 'sale' ? product.badge === 'sale' : product.badge === 'best')
    const query = searchQuery.trim().toLocaleLowerCase()
    const matchesSearch = !query || `${product.name.vi} ${product.name.en} ${product.categoryName.vi}`.toLocaleLowerCase().includes(query)
    return matchesCategory && matchesFilter && matchesSearch
  }), [category, filter, searchQuery])

  const featured = products.find((product) => product.id === featuredId) ?? products[0]
  const cartEntries = Object.entries(cart).filter(([, quantity]) => quantity > 0)
  const cartCount = cartEntries.reduce((sum, [, quantity]) => sum + quantity, 0)
  const cartTotal = cartEntries.reduce((sum, [id, quantity]) => sum + (products.find((product) => product.id === id)?.price ?? 0) * quantity, 0)

  function addToCart(productId: string) {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }))
  }

  const categories: { id: ProductCategory | 'all'; vi: string; en: string }[] = [
    { id: 'all', vi: 'Tất cả sản phẩm', en: 'All products' },
    { id: 'face', vi: 'Chăm sóc da mặt', en: 'Face care' },
    { id: 'body', vi: 'Chăm sóc body', en: 'Body care' },
    { id: 'hair', vi: 'Chăm sóc tóc', en: 'Hair care' },
    { id: 'wellness', vi: 'Thực phẩm chức năng', en: 'Wellness' },
    { id: 'gift', vi: 'Quà tặng', en: 'Gifts' },
  ]
  const filters: { id: typeof filter; vi: string; en: string }[] = [
    { id: 'all', vi: 'Tất cả', en: 'All' },
    { id: 'new', vi: 'Mới nhất', en: 'New' },
    { id: 'sale', vi: 'Giảm giá', en: 'On sale' },
    { id: 'best', vi: 'Bán chạy', en: 'Best sellers' },
  ]

  return (
    <main className={`site-shell products-page${highContrast ? ' high-contrast' : ''}`}>
      <Navbar
        page="products"
        activeHref="/products"
        language={language}
        highContrast={highContrast}
        cartCount={cartCount}
        onLanguageChange={setLanguage}
        onContrastChange={setHighContrast}
        onSearch={setSearchQuery}
        onOpenCart={() => { window.location.href = '/cart' }}
        onOpenAccount={() => { window.location.href = '/login' }}
      />

      <section className="products-hero">
        <div className="products-hero-copy">
          <span className="product-pill">{en ? 'BEAUTY ESSENTIALS' : 'SẢN PHẨM'}</span>
          <h1>{en ? <>Premium beauty<br />care essentials</> : <>Sản phẩm chăm sóc<br />sắc đẹp cao cấp</>}</h1>
          <p>{en ? 'Thoughtfully selected products to care for your skin, body, and everyday wellbeing.' : 'Được tuyển chọn kỹ lưỡng từ những thương hiệu uy tín, mang đến cho bạn làn da khỏe mạnh, rạng rỡ và tự nhiên nhất.'}</p>
          <span className="products-hero-rule" />
        </div>
        <div className="products-hero-image">
          <div className="products-hero-products" aria-label={en ? 'Featured beauty products' : 'Sản phẩm chăm sóc nổi bật'}>
            <img className="hero-burst-product hero-burst-product--left" src="/products/cream.svg" alt="" />
            <img className="hero-burst-product hero-burst-product--main" src={featured.image} alt={featured.name[language]} key={`${featured.id}-hero`} />
            <img className="hero-burst-product hero-burst-product--right" src="/products/cleanser.svg" alt="" />
            <span className="hero-product-spark hero-product-spark--left" aria-hidden="true">✦</span>
            <span className="hero-product-spark hero-product-spark--right" aria-hidden="true">✧</span>
          </div>
        </div>
      </section>

      <section className="product-catalog" aria-label={en ? 'Product catalog' : 'Danh mục sản phẩm'}>
        <aside className="product-sidebar">
          <h2>{en ? 'Categories' : 'Danh mục sản phẩm'}</h2>
          {categories.map((item) => (
            <button className={category === item.id ? 'active' : ''} key={item.id} onClick={() => setCategory(item.id)} type="button">
              {item.id !== 'all' && <span className="category-icon" aria-hidden="true">{categoryIcons[item.id]}</span>}
              {en ? item.en : item.vi}
            </button>
          ))}
          <a className="product-advice" href="https://wa.me/8486868686" target="_blank" rel="noreferrer">
            <img src="/products/cream.svg" alt="" />
            <span>{en ? 'Need help choosing the right product?' : 'Tư vấn sản phẩm phù hợp với làn da của bạn'}</span>
            <b>{en ? 'Chat with us' : 'Liên hệ ngay'} →</b>
          </a>
        </aside>

        <div className="product-listing">
          <div className="product-filters" role="group" aria-label={en ? 'Filter products' : 'Lọc sản phẩm'}>
            {filters.map((item) => <button className={filter === item.id ? 'active' : ''} key={item.id} onClick={() => setFilter(item.id)} type="button">{en ? item.en : item.vi}</button>)}
          </div>
          {visibleProducts.length ? (
            <div className="product-grid" data-reveal-stagger>
              {visibleProducts.map((product) => (
                <article className={`product-card${featuredId === product.id ? ' is-featured' : ''}`} key={product.id}>
                  <button className="product-card-image" type="button" onClick={() => { window.location.href = `/products/${product.id}` }} aria-label={`${en ? 'View' : 'Xem'} ${product.name[language]}`}>
                    <img src={product.image} alt="" />
                    {product.badge && <span className={`product-badge product-badge--${product.badge}`}>{product.badge === 'new' ? (en ? 'NEW' : 'Mới') : product.badge === 'sale' ? (en ? 'SALE' : 'Ưu đãi') : (en ? 'BEST SELLER' : 'Bán chạy')}</span>}
                  </button>
                  <div className="product-rating"><span aria-label={`${product.rating} ${en ? 'stars' : 'sao'}`}>{'★'.repeat(product.rating)}</span> <small>({product.reviews})</small></div>
                  <button className="product-name" type="button" onClick={() => { window.location.href = `/products/${product.id}` }}>{product.name[language]}</button>
                  <p>{formatPrice(product.price, en)} {product.oldPrice && <del>{formatPrice(product.oldPrice, en)}</del>}</p>
                  <button className="product-add" type="button" onClick={() => addToCart(product.id)}>{en ? 'Add to bag' : 'Thêm vào giỏ hàng'}</button>
                </article>
              ))}
            </div>
          ) : <p className="product-empty" role="status">{en ? 'No products found. Try another search.' : 'Không tìm thấy sản phẩm. Hãy thử từ khóa khác.'}</p>}
        </div>
      </section>

      <section className="product-feature" data-reveal>
        <div className="product-feature-visual" aria-label={en ? 'Featured products' : 'Các sản phẩm nổi bật'}>
          <img className="feature-product feature-product--left" src="/products/cream.svg" alt="" />
          <img className="feature-product feature-product--main" src={featured.image} alt={featured.name[language]} key={`${featured.id}-feature`} />
          <img className="feature-product feature-product--right" src="/products/cleanser.svg" alt="" />
          <span className="feature-product-spark feature-product-spark--one" aria-hidden="true">✦</span>
          <span className="feature-product-spark feature-product-spark--two" aria-hidden="true">✧</span>
        </div>
        <div>
          <p className="eyebrow">{en ? 'FEATURED PRODUCT' : 'SẢN PHẨM NỔI BẬT'}</p>
          <h2>{featured.name[language]}</h2>
          <p>{featured.description[language]} {en ? 'Carefully selected for your daily routine.' : 'Sản phẩm được tuyển chọn để bạn an tâm sử dụng mỗi ngày.'}</p>
          <div className="product-feature-buy"><strong>{formatPrice(featured.price, en)}</strong><button onClick={() => addToCart(featured.id)} type="button">{en ? 'Add to bag' : 'Thêm vào giỏ hàng'}</button><button className="feature-next" onClick={() => { const index = products.findIndex((item) => item.id === featured.id); setFeaturedId(products[(index + 1) % products.length].id) }} type="button" aria-label={en ? 'Next featured product' : 'Sản phẩm nổi bật tiếp theo'}><Icon name="chevron" size={18} /></button></div>
        </div>
      </section>

      <div className="product-floating-links">
        <a className="floating-call" href="tel:08686868686" aria-label={en ? 'Call Anh Tho Spa' : 'Gọi Anh Thơ Spa'}><Icon name="phone" size={22} /></a>
        <a className="floating-message" href="https://wa.me/8486868686" target="_blank" rel="noreferrer" aria-label={en ? 'Message on WhatsApp' : 'Nhắn tin WhatsApp'}><Icon name="whatsapp" size={24} /></a>
      </div>
      <Footer year={2026} language={language} />

      {cartOpen && (
        <Modal title={en ? 'Your shopping bag' : 'Giỏ hàng'} onClose={() => setCartOpen(false)}>
          {cartEntries.length ? <div className="product-cart-items">{cartEntries.map(([id, quantity]) => {
            const product = products.find((item) => item.id === id)!
            return <div key={id}><span>{product.name[language]} × {quantity}</span><strong>{formatPrice(product.price * quantity, en)}</strong></div>
          })}<strong className="product-cart-total">{en ? 'Total' : 'Tổng cộng'}: {formatPrice(cartTotal, en)}</strong><a href="https://wa.me/8486868686" target="_blank" rel="noreferrer">{en ? 'Order via WhatsApp' : 'Đặt hàng qua WhatsApp'}</a></div> : <p className="product-empty-cart">{en ? 'Your bag is empty. Add a product you like.' : 'Giỏ hàng đang trống. Hãy chọn sản phẩm bạn yêu thích.'}</p>}
        </Modal>
      )}
    </main>
  )
}
