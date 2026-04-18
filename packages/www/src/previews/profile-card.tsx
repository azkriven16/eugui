'use client'

import { ProfileCard } from '@/ui/profile-card'

export default function ProfileCardPreview() {
  return (
    <ProfileCard
      name="Alex Rivera"
      role="Full-Stack Developer"
      location="San Francisco, CA"
      bio="Building things for the web. Open source contributor and coffee enthusiast."
      links={[
        { platform: 'github', label: 'GitHub', url: '#' },
        { platform: 'twitter', label: 'Twitter', url: '#' },
        { platform: 'linkedin', label: 'LinkedIn', url: '#' },
      ]}
      className="w-72"
    />
  )
}
