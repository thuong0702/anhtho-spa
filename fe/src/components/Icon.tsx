export type IconName =
  | 'home'
  | 'search'
  | 'calendar'
  | 'chevron'
  | 'sliders'
  | 'bag'
  | 'user'
  | 'phone'
  | 'location'
  | 'whatsapp'

type IconProps = {
  name: IconName
  size?: number
}

export function Icon({ name, size = 21 }: IconProps) {
  const shared = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  switch (name) {
    case 'home':
      return <svg {...shared}><path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9M9 21v-7h6v7"/></svg>
    case 'search':
      return <svg {...shared}><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg>
    case 'calendar':
      return <svg {...shared}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/></svg>
    case 'chevron':
      return <svg {...shared}><path d="m6 9 6 6 6-6"/></svg>
    case 'sliders':
      return <svg {...shared}><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2" fill="var(--paper)"/><circle cx="15" cy="12" r="2" fill="var(--paper)"/><circle cx="10" cy="18" r="2" fill="var(--paper)"/></svg>
    case 'bag':
      return <svg {...shared}><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>
    case 'user':
      return <svg {...shared}><circle cx="10" cy="7" r="4"/><path d="M3 21c.5-4.3 3-6.5 7-6.5 2 0 3.5.5 4.7 1.6M19 14v7M15.5 17.5h7"/></svg>
    case 'phone':
      return <svg {...shared}><path d="M6.6 3.5 9 3l2 4.5-2 1.7a15 15 0 0 0 5.8 5.8l1.7-2 4.5 2-.5 2.4a3 3 0 0 1-3.3 2.4C10 19 5 14 4.2 6.8a3 3 0 0 1 2.4-3.3Z"/></svg>
    case 'location':
      return <svg {...shared}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
    case 'whatsapp':
      return <svg {...shared}><path d="M20.3 11.7a8.3 8.3 0 0 1-12.2 7.4L4 20l.9-4A8.3 8.3 0 1 1 20.3 11.7Z"/><path d="M8.6 8.4c.4-.5.8-.3 1 .1l.8 1.6c.2.4 0 .7-.4 1l-.5.4a7.1 7.1 0 0 0 2.9 2.9l.4-.5c.3-.4.6-.6 1-.4l1.6.8c.4.2.6.6.1 1-.5.6-1.2.9-2  .8-2.8-.4-5.7-3.3-6.1-6.1-.1-.7.2-1.5.8-2Z"/></svg>
  }
}
