import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Admin KabarKini',
  },
  robots: { index: false, follow: false },
}

// Auth guard is handled by middleware.ts — all /admin routes except /admin/login
// are protected before they reach this layout.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a1628]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-[#F1F5F9]">{children}</main>
    </div>
  )
}
