'use client'

import { motion } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface SkillCategory {
  name: string
  skills: string[]
}

export interface SkillsSectionProps {
  heading?: string
  subheading?: string
  categories: SkillCategory[]
  className?: string
}

export function SkillsSection({
  heading = 'Skills',
  subheading,
  categories,
  className,
}: SkillsSectionProps) {
  return (
    <section className={cn('bg-zinc-950 px-4 py-24', className)}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-50">{heading}</h2>
          {subheading && <p className="text-zinc-500">{subheading}</p>}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ name, skills }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
            >
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                {name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span
                    key={skill}
                    className="rounded-lg border border-zinc-700/60 bg-zinc-800/80 px-2.5 py-1 text-sm font-medium text-zinc-300 transition-colors hover:border-violet-500/40 hover:text-violet-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
