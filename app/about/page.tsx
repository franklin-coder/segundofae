
import { Metadata } from 'next'
import AboutContent from '@/components/pages/about-content'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'About Us - FaeLight Crafts | Our Story & Artisan Journey',
  description: 'Meet Julia, the artisan behind FaeLight Crafts. Discover our story of handcrafted jewelry making in beautiful Victoria, Canada, and our commitment to sustainable, beautiful pieces.',
  openGraph: {
    title: 'About FaeLight Crafts - Artisan Jewelry from Victoria, Canada',
    description: 'Meet Julia and discover our story of handcrafted macramé jewelry making in Victoria, BC.',
  }
}

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen" style={{ backgroundColor: '#FAF5EF' }}>
      <div className="container py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>About Us</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <AboutContent />
      </div>
    </div>
  )
}
