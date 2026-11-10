import { useEffect, useMemo, useState } from 'react'
import '../../css/App.css'
import { Footer } from '../../components/Footer'
import { Icon } from '../../components/Icon'
import { Navbar, type SiteLanguage } from '../../components/Navbar'
import { products } from './Products'
import '../../css/Cart.css'

type CartMap = Record<string, number>

function readCart(): CartMap {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem('anhtho-products-cart') ?? '{}')
    if (!parsed || typeof parsed !== 'object') return {}
    return Object.fromEntries(Object.entries(parsed).filter(([id, quantity]) => products.some((product) => product.id === id) && Number(quantity) > 0).map(([id, quantity]) => [id, Math.floor(Number(quantity))]))
  } catch { return {} }
}

function formatPrice(price: number, language: SiteLanguage) {
  return `${new Intl.NumberFormat(language === 'en' ? 'en-US' : 'vi-VN').format(price)}${language === 'en' ? ' ₫' : 'đ'}`
}

function TrashIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m3 0-.8 13H6.8L6 7m4 4v5m4-5v5" /></svg>
}

export default function Cart() {
  const [language, setLanguage] = useState<SiteLanguage>('vi')
  const [highContrast, setHighContrast] = useState(false)
  const [cart, setCart] = useState<CartMap>(readCart)
  const [selected, setSelected] = useState<Record<string, boolean>>(() => Object.fromEntries(Object.keys(readCart()).map((id) => [id, true])))
  const en = language === 'en'
  const entries = useMemo(() => Object.entries(cart).filter(([id, quantity]) => quantity > 0 && products.some((product) => product.id === id)), [cart])
  const selectedEntries = entries.filter(([id]) => selected[id] !== false)
  const selectedCount = selectedEntries.reduce((sum, [, quantity]) => sum + quantity, 0)
  const total = selectedEntries.reduce((sum, [id, quantity]) => sum + (products.find((product) => product.id === id)?.price ?? 0) * quantity, 0)
  const allSelected = entries.length > 0 && entries.every(([id]) => selected[id] !== false)

  useEffect(() => {
    localStorage.setItem('anhtho-products-cart', JSON.stringify(cart))
  }, [cart])

  function changeQuantity(id: string, amount: number) {
    setCart((current) => ({ ...current, [id]: Math.max(1, (current[id] ?? 1) + amount) }))
  }

  function removeProducts(ids: string[]) {
    setCart((current) => Object.fromEntries(Object.entries(current).filter(([id]) => !ids.includes(id))))
    setSelected((current) => Object.fromEntries(Object.entries(current).filter(([id]) => !ids.includes(id))))
  }

  function checkout() {
    if (!selectedEntries.length) return
    sessionStorage.setItem('anhtho-checkout-items', JSON.stringify(selectedEntries.map(([id]) => id)))
    window.location.href = '/checkout'
  }

  return (
    <main className={`site-shell cart-page${highContrast ? ' high-contrast' : ''}`}>
      <Navbar page="products" activeHref="/products" language={language} highContrast={highContrast} cartCount={entries.reduce((sum, [, quantity]) => sum + quantity, 0)} onLanguageChange={setLanguage} onContrastChange={setHighContrast} onOpenCart={() => window.scrollTo({ top: 0, behavior: 'smooth' })} onOpenAccount={() => { window.location.href = '/login' }} />

      <section className="cart-content">
        <h1>{en ? 'Your shopping cart' : 'Giỏ hàng của bạn'}</h1>
        {entries.length ? (
          <div className="cart-sheet">
            <div className="cart-toolbar">
              <label className="cart-select-all"><input type="checkbox" checked={allSelected} onChange={(event) => setSelected(Object.fromEntries(entries.map(([id]) => [id, event.target.checked])))} /><span>{en ? `Select all (${entries.length})` : `Chọn tất cả (${entries.length})`}</span></label>
              <button className="cart-delete-selected" type="button" disabled={!selectedEntries.length} onClick={() => removeProducts(selectedEntries.map(([id]) => id))}><TrashIcon />{en ? 'Remove selected' : 'Xóa sản phẩm'}</button>
            </div>

            <div className="cart-lines">
              {entries.map(([id, quantity]) => {
                const product = products.find((item) => item.id === id)!
                return <article className="cart-line" key={id}>
                  <label className="cart-checkbox" aria-label={en ? `Select ${product.name[language]}` : `Chọn ${product.name[language]}`}><input type="checkbox" checked={selected[id] !== false} onChange={(event) => setSelected((current) => ({ ...current, [id]: event.target.checked }))} /></label>
                  <a className="cart-product-image" href={`/products/${product.id}`}><img src={product.image} alt={product.name[language]} /></a>
                  <div className="cart-product-copy"><a href={`/products/${product.id}`}>{product.name[language]}</a><small>{en ? 'Beauty care · 30 ml' : 'Dung tích: 30ml'}</small><strong>{formatPrice(product.price, language)}</strong></div>
                  <div className="cart-quantity" aria-label={en ? 'Quantity' : 'Số lượng'}><button type="button" onClick={() => changeQuantity(id, -1)} aria-label={en ? 'Decrease quantity' : 'Giảm số lượng'}>−</button><span>{quantity}</span><button type="button" onClick={() => changeQuantity(id, 1)} aria-label={en ? 'Increase quantity' : 'Tăng số lượng'}>+</button></div>
                  <button className="cart-remove" type="button" onClick={() => removeProducts([id])} aria-label={en ? `Remove ${product.name[language]}` : `Xóa ${product.name[language]}`}><TrashIcon /></button>
                </article>
              })}
            </div>

            <div className="cart-summary"><p>{en ? 'Selected items' : 'Đã chọn'}: <b>{selectedCount}</b></p><strong>{en ? 'Total:' : 'Tổng tiền:'} {formatPrice(total, language)}</strong><button type="button" disabled={!selectedEntries.length} onClick={checkout}>{en ? 'Checkout now' : 'Thanh toán ngay'} <span aria-hidden="true">→</span></button></div>
          </div>
        ) : (
          <div className="cart-empty"><span aria-hidden="true">♡</span><h2>{en ? 'Your cart is waiting for a little care' : 'Giỏ hàng đang chờ bạn chọn sản phẩm'}</h2><p>{en ? 'Explore our beauty care collection and find something you love.' : 'Khám phá các sản phẩm chăm sóc sắc đẹp và chọn món phù hợp với bạn nhé.'}</p><a href="/products">{en ? 'Explore products' : 'Khám phá sản phẩm'} →</a></div>
        )}

        <section className="cart-delivery-banner"><div className="delivery-art" aria-hidden="true"><span className="delivery-sun" /><span className="delivery-road" /><span className="delivery-truck">🚚</span></div><div><span>{en ? 'CAREFULLY PACKED FOR YOU' : 'GIAO HÀNG CHU ĐÁO'}</span><h2>{en ? 'A little self-care, delivered to your door' : 'Trao gửi yêu thương, chăm sóc tận nhà'}</h2><p>{en ? 'We will contact you to confirm your order and delivery details.' : 'Chúng tôi sẽ liên hệ xác nhận đơn hàng và thông tin giao nhận cùng bạn.'}</p></div></section>
      </section>

      <div className="cart-floating-links"><a className="floating-call" href="tel:08686868686" aria-label={en ? 'Call Anh Tho Spa' : 'Gọi Anh Thơ Spa'}><Icon name="phone" size={22} /></a><a className="floating-message" href="https://wa.me/8486868686" target="_blank" rel="noreferrer" aria-label={en ? 'Message on WhatsApp' : 'Nhắn tin WhatsApp'}><Icon name="whatsapp" size={24} /></a></div>
      <Footer year={2026} language={language} />
    </main>
  )
}
