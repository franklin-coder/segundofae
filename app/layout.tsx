import type { Metadata } from 'next'
import { Berkshire_Swash, Della_Respira } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as HotToaster } from 'react-hot-toast'
import { CartProvider } from '@/components/cart/cart-context'
import { AuthProvider } from '@/contexts/auth-context'
import AdminControls from '@/components/admin/admin-controls'

const dellaRespira = Della_Respira({ 
  subsets: ['latin'],
  variable: '--font-della-respira',
  weight: '400'
})

const berkshireSwash = Berkshire_Swash({ 
  subsets: ['latin'],
  variable: '--font-berkshire-swash',
  weight: '400'
})

export const metadata: Metadata = {
  title: 'FaeLight Crafts - Artisan Jewelry & Handmade Accessories',
  description: 'Discover unique handcrafted jewelry and accessories by FaeLight Crafts. From elegant necklaces to statement earrings, each piece tells a story of artisanal excellence.',
  keywords: 'jewelry, handmade, artisan, crafts, necklaces, earrings, bracelets, accessories',
  authors: [{ name: 'FaeLight Crafts' }],
  openGraph: {
    title: 'FaeLight Crafts - Artisan Jewelry',
    description: 'Unique handcrafted jewelry and accessories',
    url: 'https://faelightcrafts.com',
    siteName: 'FaeLight Crafts',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dellaRespira.variable} ${berkshireSwash.variable} font-sans`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <AdminControls />
              <Toaster />
              <HotToaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#fff',
                    color: '#333',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
