import { createPortal } from 'react-dom'

export default function Portal({ children }: { children: React.ReactNode }) {
  if (typeof document === 'undefined') return null // SSR check
  return createPortal(children, document.body)
}
