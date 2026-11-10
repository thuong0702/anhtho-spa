import { useMemo, useState, type FormEvent } from 'react'
import '../App.css'
import { Footer } from '../components/Footer'
import { Icon } from '../components/Icon'
import { Navbar, type SiteLanguage } from '../components/Navbar'
import { products } from './Products'
import './Checkout.css'

type CartMap = Record<string, number>
type CheckoutContact = { name: string; phone: string; address: string; note: string }

function readOrderItems(): { cart: CartMap; selectedIds: string[] } {
  try {
    const rawCart: unknown = JSON.parse(localStorage.getItem('anhtho-products-cart') ?? '{}')
    const rawSelected: unknown = JSON.parse(sessionStorage.getItem('anhtho-checkout-items') ?? '[]')
    const storedCart = rawCart && typeof rawCart === 'object' ? rawCart as CartMap : {}
    const cart = Object.fromEntries(Object.entries(storedCart).filter(([id, quantity]) => products.some((product) => product.id === id) && Number(quantity) > 0).map(([id, quantity]) => [id, Math.floor(Number(quantity))]))
    const validIds = Object.keys(cart)
    const selectedIds = Array.isArray(rawSelected) ? rawSelected.filter((id): id is string => typeof id === 'string' && validIds.includes(id)) : []
    return { cart, selectedIds: selectedIds.length ? selectedIds : validIds }
  } catch { return { cart: {}, selectedIds: [] } }
}

function formatPrice(price: number) {
  return `${new Intl.NumberFormat('vi-VN').format(price)}đ`
}

export default function Checkout() {
  const [language, setLanguage] = useState<SiteLanguage>('vi')
  const [highContrast, setHighContrast] = useState(false)
  const [orderItems] = useState(readOrderItems)
  const [payment, setPayment] = useState<'cod' | 'bank'>('cod')
  const [sent, setSent] = useState(false)
  const [contact, setContact] = useState<CheckoutContact>({ name: '', phone: '', address: '', note: '' })
  const en = language === 'en'
  const items = useMemo(() => orderItems.selectedIds.flatMap((id) => {
    const product = products.find((item) => item.id === id)
    return product ? [{ product, quantity: orderItems.cart[id] }] : []
  }), [orderItems])
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = items.length ? 30000 : 0
  const total = subtotal + shipping

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const itemLines = items.map(({ product, quantity }) => `• ${product.name.vi} × ${quantity}: ${formatPrice(product.price * quantity)}`)
    const paymentLabel = payment === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'
    const message = [
      'ĐƠN ĐẶT HÀNG — ANH THƠ BEAUTY & SPA',
      `Họ tên: ${contact.name}`,
      `Số điện thoại: ${contact.phone}`,
      `Địa chỉ: ${contact.address}`,
      contact.note ? `Ghi chú: ${contact.note}` : '',
      '',
      ...itemLines,
      '',
      `Tạm tính: ${formatPrice(subtotal)}`,
      `Phí vận chuyển: ${formatPrice(shipping)}`,
      `Tổng thanh toán: ${formatPrice(total)}`,
      `Phương thức: ${paymentLabel}`,
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/8486868686?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <main className={`site-shell checkout-page${highContrast ? ' high-contrast' : ''}`}>
      <Navbar page="products" activeHref="/products" language={language} highContrast={highContrast} cartCount={Object.values(orderItems.cart).reduce((sum, value) => sum + Number(value || 0), 0)} onLanguageChange={setLanguage} onContrastChange={setHighContrast} onOpenCart={() => { window.location.href = '/cart' }} onOpenAccount={() => { window.location.href = '/login' }} />

      <div className="checkout-back"><a href="/cart">← <span>{en ? 'Back to cart' : 'Quay lại giỏ hàng'}</span></a></div>
      <form className="checkout-layout" onSubmit={submitOrder}>
        <div className="checkout-main-column">
          <section className="checkout-address-card">
            <div className="checkout-section-heading"><h1>{en ? 'Delivery address' : 'Địa chỉ giao hàng'}</h1><Icon name="location" size={21} /></div>
            <div className="checkout-contact-fields">
              <label>{en ? 'Full name' : 'Họ và tên'}<input autoComplete="name" required value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} placeholder={en ? 'Enter your full name' : 'Nhập họ và tên'} /></label>
              <label>{en ? 'Phone number' : 'Số điện thoại'}<input autoComplete="tel" type="tel" inputMode="tel" pattern="[0-9+() .-]{9,16}" required value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} placeholder={en ? 'Enter your phone number' : 'Nhập số điện thoại'} /></label>
              <label className="checkout-address-input">{en ? 'Street address' : 'Địa chỉ nhận hàng'}<input autoComplete="street-address" required value={contact.address} onChange={(event) => setContact({ ...contact, address: event.target.value })} placeholder={en ? 'House number, street, ward, district, province' : 'Số nhà, đường, xã/phường, quận/huyện, tỉnh/thành'} /></label>
              <label className="checkout-note-input">{en ? 'Order note (optional)' : 'Ghi chú (không bắt buộc)'}<input value={contact.note} onChange={(event) => setContact({ ...contact, note: event.target.value })} placeholder={en ? 'Delivery instructions...' : 'Dặn dò giao hàng...'} /></label>
            </div>
          </section>

          <section className="checkout-items-card">
            <div className="checkout-section-heading"><h2>{en ? 'Your order' : 'Sản phẩm đặt mua'}</h2><span>{items.length} {en ? 'items' : 'mặt hàng'}</span></div>
            {items.length ? items.map(({ product, quantity }) => <article className="checkout-item" key={product.id}><a href={`/products/${product.id}`} className="checkout-item-image"><img src={product.image} alt={product.name[language]} /></a><div className="checkout-item-copy"><a href={`/products/${product.id}`}>{product.name[language]}</a><span>{en ? 'Quantity' : 'Số lượng'}: {quantity}</span><strong>{formatPrice(product.price * quantity)}</strong></div></article>) : <div className="checkout-no-items"><p>{en ? 'Your cart is empty.' : 'Giỏ hàng chưa có sản phẩm.'}</p><a href="/products">{en ? 'Browse products' : 'Chọn sản phẩm'} →</a></div>}
          </section>

          <section className="checkout-payment-card">
            <h2>{en ? 'Payment method' : 'Phương thức thanh toán'}</h2>
            <label className={`checkout-payment-option${payment === 'cod' ? ' selected' : ''}`}><input type="radio" name="payment" checked={payment === 'cod'} onChange={() => setPayment('cod')} /><span><b>{en ? 'Cash on delivery' : 'Thanh toán khi nhận hàng'}</b><small>{en ? 'Pay the courier when your order arrives.' : 'Thanh toán cho nhân viên giao hàng khi nhận đơn.'}</small></span></label>
            <label className={`checkout-payment-option${payment === 'bank' ? ' selected' : ''}`}><input type="radio" name="payment" checked={payment === 'bank'} onChange={() => setPayment('bank')} /><span><b>{en ? 'Bank transfer' : 'Thanh toán bằng tài khoản'}</b><small>{en ? 'We will send transfer details after confirming your order.' : 'Spa sẽ gửi thông tin chuyển khoản sau khi xác nhận đơn hàng.'}</small></span></label>
          </section>
        </div>

        <aside className="checkout-summary-card">
          <h2>{en ? 'Payment summary' : 'Chi tiết thanh toán'}</h2>
          <div><span>{en ? 'Subtotal' : 'Tổng tiền hàng'}</span><strong>{formatPrice(subtotal)}</strong></div>
          <div><span>{en ? 'Shipping fee' : 'Tổng phí vận chuyển'}</span><strong>{formatPrice(shipping)}</strong></div>
          <div className="checkout-grand-total"><span>{en ? 'Total payment' : 'Tổng thanh toán'}</span><strong>{formatPrice(total)}</strong></div>
          <button type="submit" disabled={!items.length}>{sent ? (en ? 'Send again via WhatsApp' : 'Gửi lại yêu cầu đặt hàng') : (en ? 'Place order' : 'Đặt hàng ngay')} <span aria-hidden="true">→</span></button>
          {sent && <p className="checkout-sent-message" role="status">{en ? 'WhatsApp opened with your order details. Send the message to confirm your order.' : 'WhatsApp đã mở kèm thông tin đơn hàng. Hãy gửi tin nhắn để spa xác nhận đơn.'}</p>}
          <p className="checkout-secure-note">♧ {en ? 'Your information is kept private and only used to deliver your order.' : 'Thông tin của bạn được bảo mật và chỉ dùng để giao hàng.'}</p>
        </aside>
      </form>

      <div className="checkout-floating-links"><a className="floating-call" href="tel:08686868686" aria-label={en ? 'Call Anh Tho Spa' : 'Gọi Anh Thơ Spa'}><Icon name="phone" size={22} /></a><a className="floating-message" href="https://wa.me/8486868686" target="_blank" rel="noreferrer" aria-label={en ? 'Message on WhatsApp' : 'Nhắn tin WhatsApp'}><Icon name="whatsapp" size={24} /></a></div>
      <Footer year={2026} language={language} />
    </main>
  )
}
