'use client'

import { motion } from 'motion/react'

export default function ScrollProgressPreview() {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-zinc-500">
        Add to your layout — shows reading progress at top of page
      </p>
      <div className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
        <div className="h-[3px] w-full bg-zinc-800">
          <motion.div
            className="h-full rounded-full bg-violet-500"
            initial={{ width: '0%' }}
            animate={{ width: '70%' }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {[100, 80, 90, 60].map((w, i) => (
              <div key={i} className="h-2 rounded-full bg-zinc-800" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
