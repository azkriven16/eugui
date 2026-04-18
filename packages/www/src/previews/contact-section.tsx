'use client'

import { ContactSection } from '@/ui/contact-section'

export default function ContactSectionPreview() {
  return (
    <ContactSection
      heading="Let's work together"
      subheading="Have a project in mind? I'd love to hear about it."
      email="alex@example.com"
      links={[
        { label: 'GitHub', href: '#', external: true },
        { label: 'Twitter', href: '#', external: true },
        { label: 'LinkedIn', href: '#', external: true },
      ]}
      className="py-16"
    />
  )
}
