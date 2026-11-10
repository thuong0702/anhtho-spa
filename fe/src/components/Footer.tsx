import { Icon } from './Icon'
import '../css/Footer.css'

type FooterProps = {
  address?: string
  phoneNumber?: string
  phoneHref?: string
  year?: number
  language?: 'vi' | 'en'
}

export function Footer({
  address = 'Số 8386 - Nam đàn, Nghệ An',
  phoneNumber = '8686868686',
  phoneHref = 'tel:08686868686',
  year = new Date().getFullYear(),
  language = 'vi',
}: FooterProps) {
  const isEnglish = language === 'en'

  return (
    <footer className="site-footer" id="footer" data-reveal>
      <div className="footer-brand">
        <a className="footer-brand-name" href="#home">ANH THƠ <span>BEAUTY & SPA</span></a>
        <p>{isEnglish ? 'A calm space for beauty, care, and a little time for yourself.' : 'Không gian chăm sóc sắc đẹp và thư giãn dành riêng cho bạn.'}</p>
      <ul className="promise-list">
        <li>{isEnglish ? 'Trust us — reveal your beauty.' : 'Đặt niềm tin – Trao trọn vẻ đẹp.'}</li>
        <li>{isEnglish ? 'Dedicated care — thoughtful offers.' : 'Dịch vụ tận tâm – Ưu đãi hấp dẫn.'}</li>
        <li>{isEnglish ? 'Quality products — peace of mind.' : 'Sản phẩm chất lượng – An tâm lựa chọn.'}</li>
        <li>{isEnglish ? 'A caring team — attentive service.' : 'Đội ngũ nhiệt tình – Chăm sóc tận tâm.'}</li>
      </ul>
      </div>
      <div className="footer-map-wrap">
        <h2>{isEnglish ? 'Find us' : 'Tìm chúng tôi'}</h2>
      <iframe
        className="footer-map"
        title={isEnglish ? 'Map of Nam Dan, Nghe An' : 'Bản đồ khu vực Nam Đàn, Nghệ An'}
        src="https://maps.google.com/maps?q=Nam%20%C4%90%C3%A0n%2C%20Ngh%E1%BB%87%20An%2C%20Vietnam&t=&z=13&ie=UTF8&iwloc=&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      </div>
      <div className="contact-info">
        <h2>{isEnglish ? 'Contact' : 'Liên hệ'}</h2>
        <p><Icon name="location" size={21} /> {address}</p>
        <a href={phoneHref}><Icon name="phone" size={21} /> {phoneNumber}</a>
        <a href="https://wa.me/8486868686" target="_blank" rel="noreferrer" aria-label="WhatsApp">
          <Icon name="whatsapp" size={20} /> WhatsApp
        </a>
        <div className="social-links" aria-label="Mạng xã hội">
          <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">♪</a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
        </div>
      </div>
      <p className="copyright">© {year} ANH THƠ BEAUTY. {isEnglish ? 'All Rights Reserved.' : 'Bảo lưu mọi quyền.'}</p>
    </footer>
  )
}
