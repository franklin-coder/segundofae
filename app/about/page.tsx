
import { Metadata } from 'next'
import AboutContent from '@/components/pages/about-content'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'About the Crafter - FaeLight Crafts | Julia\'s Story & Creative Journey',
  description: 'Meet Julia, the crafter behind FaeLight Crafts. Discover her story of handcrafted treasures made with love, from crochet creatures to sparkling resin pieces and playful bookmarks.',
  openGraph: {
    title: 'About the Crafter',
    description: 'Meet Julia and discover her story of handcrafted magic, made with love and a cup of coffee.',
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
              <BreadcrumbPage>About the Crafter</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <AboutContent />
      </div>
    </div>
  )
}
