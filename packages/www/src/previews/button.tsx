'use client'

import { Button } from '@/ui/button'

export default function ButtonPreview() {
  return (
    <div className="flex flex-col gap-6">
      {/* Variants */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Variants</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Sizes</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      {/* Disabled */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Disabled</p>
        <div className="flex flex-wrap gap-3">
          <Button disabled>Default</Button>
          <Button variant="outline" disabled>Outline</Button>
        </div>
      </div>
    </div>
  )
}
