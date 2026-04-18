'use client'

import { GradientMesh } from '@/ui/gradient-mesh'

export default function GradientMeshPreview() {
  return (
    <GradientMesh
      className="flex min-h-48 w-full items-center justify-center rounded-xl"
      colors={['#a78bfa', '#60a5fa', '#34d399', '#f472b6']}
    >
      <div className="text-center">
        <p className="text-2xl font-bold tracking-tight text-white">
          Gradient Mesh
        </p>
        <p className="mt-1 text-sm text-white/60">
          Animated color mesh background
        </p>
      </div>
    </GradientMesh>
  )
}
