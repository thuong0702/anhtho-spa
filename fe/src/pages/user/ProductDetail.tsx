import { useEffect, useState } from 'react'
import { Footer } from '../../components/Footer'
import { Icon } from '../../components/Icon'
import { Navbar, type SiteLanguage } from '../../components/Navbar'
import '../../css/App.css'
import { products, type Product } from './Products'
import '../../css/ProductDetail.css'

type DetailCopy = {
  description: Record<SiteLanguage, string>
  ingredients: Record<SiteLanguage, string[]>
  benefits: Record<SiteLanguage, string[]>
  steps: Record<SiteLanguage, string[]>
}

const details: Record<string, DetailCopy> = {
  serum: {
    description: { vi: 'Serum phục hồi da với công thức tiên tiến, chiết xuất thiên nhiên và công nghệ hiện đại giúp làm sáng da, cấp ẩm sâu, phục hồi hàng rào bảo vệ da, mang lại làn da mịn màng căng bóng tươi trẻ.', en: 'A restorative serum with botanical extracts and modern skincare technology to hydrate deeply, support the skin barrier, and leave skin feeling smooth and radiant.' },
    ingredients: { vi: ['Hyaluronic acid cấp ẩm nhiều tầng', 'Chiết xuất thực vật làm dịu da', 'Vitamin B5 hỗ trợ phục hồi', 'Không chứa hương liệu nồng'], en: ['Multi-weight hyaluronic acid', 'Soothing botanical extracts', 'Vitamin B5 to support the skin barrier', 'No heavy fragrance'] },
    benefits: { vi: ['Làm dịu da, giảm kích ứng và mẩn đỏ', 'Cấp ẩm sâu, duy trì độ ẩm tự nhiên', 'Phục hồi hàng rào bảo vệ da', 'Hỗ trợ làm mờ vết thâm, sáng da'], en: ['Soothes visible redness and discomfort', 'Provides lasting hydration', 'Supports the skin barrier', 'Helps improve the look of dullness'] },
    steps: { vi: ['Làm sạch da và lau khô', 'Lấy 2–3 giọt thoa đều lên mặt', 'Massage nhẹ nhàng theo chiều nâng cơ', 'Sử dụng 2 lần mỗi ngày'], en: ['Cleanse and pat skin dry', 'Apply 2–3 drops to the face', 'Massage gently upward', 'Use morning and evening'] },
  },
}

function formatPrice(price: number, en: boolean) {
  return `${new Intl.NumberFormat(en ? 'en-US' : 'vi-VN').format(price)}${en ? ' ₫' : 'đ'}`
}

function readProductCart() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('anhtho-products-cart') ?? '{}')
    return value && typeof value === 'object' ? value as Record<string, number> : {}
  } catch { return {} }
}

export default function ProductDetail({ productId }: { productId: string }) {
  const product: Product = products.find((item) => item.id === productId) ?? products[0]
  const content = details[product.id] ?? {
    description: { vi: product.description.vi, en: product.description.en },
    ingredients: { vi: ['Thành phần được tuyển chọn phù hợp cho quy trình chăm sóc hằng ngày.', 'Sử dụng theo hướng dẫn trên bao bì.'], en: ['Carefully selected ingredients for your daily routine.', 'Use as directed on the product label.'] },
    benefits: { vi: [product.description.vi, 'Chăm sóc nhẹ nhàng mỗi ngày', 'Phù hợp với quy trình chăm sóc cá nhân'], en: [product.description.en, 'Gentle everyday care', 'A thoughtful part of your personal routine'] },
    steps: { vi: ['Làm sạch vùng da cần chăm sóc', 'Lấy một lượng sản phẩm vừa đủ', 'Thoa đều và massage nhẹ nhàng', 'Sử dụng theo nhu cầu mỗi ngày'], en: ['Cleanse the area first', 'Apply a suitable amount', 'Spread evenly and massage gently', 'Use daily as needed'] },
  }
  const [language, setLanguage] = useState<SiteLanguage>('vi')
  const [highContrast, setHighContrast] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(product.image)
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'usage'>('description')
  const [added, setAdded] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const en = language === 'en'
  const related = products.filter((item) => item.id !== product.id).slice(0, 4)
  const tabContent = activeTab === 'description' ? content.description[language] : activeTab === 'ingredients' ? content.ingredients[language].join(' · ') : content.steps[language].join('  →  ')
  const gallery = [product.image, ...related.slice(0, 3).map((item) => item.image)]

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger]')
    if (!('IntersectionObserver' in window)) { targets.forEach((target) => target.classList.add('is-visible')); return }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: .12, rootMargin: '0px 0px -30px 0px' })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const cart = readProductCart()
    setCartCount(Object.values(cart).reduce((sum, count) => sum + (Number(count) || 0), 0))
  }, [])

  function addToCart() {
    const cart = readProductCart()
    cart[product.id] = (cart[product.id] ?? 0) + quantity
    localStorage.setItem('anhtho-products-cart', JSON.stringify(cart))
    setCartCount(Object.values(cart).reduce((sum, count) => sum + (Number(count) || 0), 0))
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2600)
  }

  return (
    <main className={`site-shell product-detail-page${highContrast ? ' high-contrast' : ''}`}>
      <Navbar page="products" activeHref="/products" language={language} highContrast={highContrast} cartCount={cartCount} onLanguageChange={setLanguage} onContrastChange={setHighContrast} onOpenCart={() => { window.location.href = '/cart' }} onOpenAccount={() => { window.location.href = '/login' }} />

      <nav className="product-breadcrumb" aria-label={en ? 'Breadcrumb' : 'Đường dẫn'}>
        <a href="/" aria-label={en ? 'Home' : 'Trang chủ'}><Icon name="home" size={18} /></a><span>›</span><a href="/products">{en ? 'Products' : 'Sản phẩm'}</a><span>›</span><a href={`/products?category=${product.category}`}>{product.categoryName[language]}</a><span>›</span><strong>{product.name[language]}</strong>
      </nav>

      <section className="product-detail-top">
        <div className="product-detail-gallery">
          <div className="product-detail-main-image"><img src={activeImage} alt={product.name[language]} /></div>
          <div className="product-detail-thumbnails">{gallery.map((image, index) => <button className={activeImage === image ? 'active' : ''} key={`${image}-${index}`} type="button" onClick={() => setActiveImage(image)} aria-label={`${en ? 'Product image' : 'Ảnh sản phẩm'} ${index + 1}`}><img src={image} alt="" /></button>)}</div>
        </div>

        <section className="product-detail-summary">
          <p className="product-detail-category">{product.categoryName[language]}</p>
          <h1>{product.name[language]}</h1>
          <div className="detail-rating"><span aria-label={`${product.rating} stars`}>★★★★★</span><a href="#product-reviews">({product.reviews} {en ? 'reviews' : 'đánh giá'})</a></div>
          <div className="detail-prices"><strong>{formatPrice(product.price, en)}</strong>{product.oldPrice && <del>{formatPrice(product.oldPrice, en)}</del>}</div>
          <p className="detail-intro">{content.description[language]}</p>
          <div className="detail-buy-row">
            <div className="quantity-control" aria-label={en ? 'Quantity' : 'Số lượng'}><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label={en ? 'Decrease quantity' : 'Giảm số lượng'}>−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label={en ? 'Increase quantity' : 'Tăng số lượng'}>+</button></div>
            <button className="detail-add-button" type="button" onClick={addToCart}><Icon name="bag" size={18} />{added ? (en ? 'Added to bag' : 'Đã thêm vào giỏ') : (en ? 'Add to bag' : 'Thêm vào giỏ hàng')}</button>
          </div>
          {added && <p className="product-added-message" role="status">{en ? 'Added to your shopping bag.' : 'Sản phẩm đã được thêm vào giỏ hàng.'}</p>}
          <div className="detail-assurances"><span>♧ <b>{en ? 'Authentic' : 'Chính hãng'}<small>100%</small></b></span><span>◉ <b>{en ? 'Free shipping' : 'Miễn phí vận chuyển'}<small>{en ? 'Orders over 500k' : 'Đơn từ 500.000đ'}</small></b></span><span>♧ <b>{en ? 'Returns' : 'Hỗ trợ trả hàng'}<small>{en ? 'Within 7 days' : 'Trong 7 ngày'}</small></b></span></div>
        </section>
      </section>

      <section className="product-information" id="product-reviews">
        <div className="product-info-tabs" role="tablist">
          <button className={activeTab === 'description' ? 'active' : ''} onClick={() => setActiveTab('description')} role="tab" type="button">{en ? 'Description' : 'Mô tả sản phẩm'}</button>
          <button className={activeTab === 'ingredients' ? 'active' : ''} onClick={() => setActiveTab('ingredients')} role="tab" type="button">{en ? 'Ingredients' : 'Thành phần'}</button>
          <button className={activeTab === 'usage' ? 'active' : ''} onClick={() => setActiveTab('usage')} role="tab" type="button">{en ? 'How to use' : 'Hướng dẫn sử dụng'}</button>
        </div>
        <div className="product-info-content">
          <div><h2>{activeTab === 'description' ? (en ? 'A daily ritual for healthy-looking skin' : 'Dưỡng da phục hồi, tự tin tỏa sáng') : activeTab === 'ingredients' ? (en ? 'Thoughtfully selected ingredients' : 'Thành phần được chọn lọc') : (en ? 'How to use' : 'Hướng dẫn sử dụng')}</h2><span className="product-info-rule" /><p>{tabContent}</p></div>
          <ul>{content.benefits[language].map((benefit) => <li key={benefit}><span aria-hidden="true">↗</span>{benefit}</li>)}</ul>
        </div>
        <div className="product-usage-panel"><div><h2>{en ? 'A simple way to use' : 'Hướng dẫn sử dụng'}</h2><ol>{content.steps[language].map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol></div><img src="/products/serum.svg" alt="" /></div>
      </section>

      <section className="related-products">
        <div className="related-heading"><div><p>{en ? 'Related products' : 'Sản phẩm liên quan'}</p><h2>{en ? 'You may also like' : 'Có thể bạn sẽ thích'}</h2></div><a href="/products">{en ? 'View all' : 'Xem tất cả'} →</a></div>
        <div className="related-grid">{related.map((item) => <a className="related-card" href={`/products/${item.id}`} key={item.id}><img src={item.image} alt="" /><span>{item.name[language]}</span><strong>{formatPrice(item.price, en)}</strong><i aria-hidden="true">→</i></a>)}</div>
      </section>

      <div className="detail-floating-links"><a className="floating-call" href="tel:08686868686" aria-label={en ? 'Call Anh Tho Spa' : 'Gọi Anh Thơ Spa'}><Icon name="phone" size={22} /></a><a className="floating-message" href="https://wa.me/8486868686" target="_blank" rel="noreferrer" aria-label={en ? 'Message on WhatsApp' : 'Nhắn tin WhatsApp'}><Icon name="whatsapp" size={24} /></a></div>
      <Footer year={2026} language={language} />
    </main>
  )
}
