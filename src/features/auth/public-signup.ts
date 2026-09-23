export function publicSignupEnabled(value: string | undefined, dev: boolean) {
  return value === 'true' || (value === undefined && dev)
}
