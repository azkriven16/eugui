import { codeToHtml } from 'shiki'

interface CodeBlockProps {
  code: string
  lang?: string
}

export async function CodeBlock({ code, lang = 'tsx' }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: 'github-dark',
  })

  return (
    <div
      className="overflow-x-auto rounded-b-lg border border-zinc-800 bg-[#0d1117] text-sm [&>pre]:p-4"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is trusted
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
