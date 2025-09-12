// app/contact/page.tsx
import { Metadata } from 'next';
import ContactContent from '@/components/pages/contact-content';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export const metadata: Metadata = {
  title: 'Contact Us - FaeLight Crafts | Get in Touch',
  description: 'Have questions about our handcrafted jewelry? Get in touch with FaeLight Crafts. Based in Victoria, BC, we\'re here to help with all your jewelry needs.',
  openGraph: {
    title: 'Contact FaeLight Crafts - Victoria, BC',
    description: 'Get in touch with our artisan jewelry team in Victoria, British Columbia.',
  }
};

export default function ContactPage() {
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
              <BreadcrumbPage>Contact</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <ContactContent />
      </div>
    </div>
  );
}