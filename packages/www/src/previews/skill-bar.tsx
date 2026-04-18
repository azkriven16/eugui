'use client'

import { SkillBar } from '@/ui/skill-bar'

const SKILLS = [
  { label: 'TypeScript', value: 92, color: '#60a5fa' },
  { label: 'React / Next.js', value: 88, color: '#a78bfa' },
  { label: 'Node.js', value: 75, color: '#34d399' },
  { label: 'Rust', value: 45, color: '#fb923c' },
]

export default function SkillBarPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {SKILLS.map(({ label, value, color }) => (
        <SkillBar key={label} label={label} value={value} color={color} />
      ))}
    </div>
  )
}
