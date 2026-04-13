import { Project } from 'ts-morph'

export interface TransformOptions {
  /** Map of alias-from → alias-to, e.g. `{ '@/lib/utils': '@/utils' }` */
  aliases: Record<string, string>
  tsx: boolean
}

/**
 * Rewrites import path aliases inside a TypeScript/TSX source file.
 *
 * Layer 1 — AST: rewrites import declarations via ts-morph.
 * Layer 2 — String: catches string literals that are not standard imports
 *           (e.g. dynamic imports, template strings).
 */
export function transformFile(
  content: string,
  filename: string,
  opts: TransformOptions,
): string {
  if (Object.keys(opts.aliases).length === 0) return content

  const project = new Project({ useInMemoryFileSystem: true })
  const file = project.createSourceFile(filename, content)

  // Layer 1: AST import rewriting
  for (const decl of file.getImportDeclarations()) {
    const specifier = decl.getModuleSpecifierValue()
    for (const [from, to] of Object.entries(opts.aliases)) {
      if (specifier === from) {
        decl.setModuleSpecifier(to)
        break
      }
      if (specifier.startsWith(`${from}/`)) {
        decl.setModuleSpecifier(specifier.replace(from, to))
        break
      }
    }
  }

  let result = file.getFullText()

  // Layer 2: string literal substitutions for non-import usages
  for (const [from, to] of Object.entries(opts.aliases)) {
    result = result.replaceAll(`"${from}"`, `"${to}"`)
    result = result.replaceAll(`'${from}'`, `'${to}'`)
  }

  return result
}
