export interface CSSVars {
  light?: Record<string, string>
  dark?: Record<string, string>
}

export function injectCSSVars(css: string, vars: CSSVars): string {
  let result = css
  if (vars.light && Object.keys(vars.light).length > 0) {
    result = injectIntoSelector(result, ':root', vars.light)
  }
  if (vars.dark && Object.keys(vars.dark).length > 0) {
    result = injectIntoSelector(result, '.dark', vars.dark)
  }
  return result
}

function injectIntoSelector(
  css: string,
  selector: string,
  vars: Record<string, string>,
): string {
  const varLines = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')

  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped}\\s*\\{)([^}]*)\\}`)

  if (regex.test(css)) {
    return css.replace(regex, (_, open: string, body: string) => `${open}${body}${varLines}\n}`)
  }

  // Selector not found — append a new block
  return `${css}\n${selector} {\n${varLines}\n}\n`
}
