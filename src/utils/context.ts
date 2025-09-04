const createCtx = <CtxValue>(ctxName: string) => {
  const ctxSymbol = Symbol(ctxName)

  const injectCtx = <T extends CtxValue | null | undefined = CtxValue>(
    fallback?: T,
  ): T extends null ? CtxValue | null : CtxValue => {
    const ctx = inject(ctxSymbol, fallback)

    if (ctx) return ctx
    if (ctx === null) return ctx as any

    throw new Error(`Injection \`${ctxSymbol.toString()}\` not found.`)
  }

  const provideCtx = (value: CtxValue) => {
    provide(ctxSymbol, value)
  }

  return [provideCtx, injectCtx] as const
}

export default createCtx
