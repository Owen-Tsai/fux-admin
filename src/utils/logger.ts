class Logger {
  private DEV: boolean = true
  private static instance: Logger | null = null

  private constructor(dev: boolean) {
    this.DEV = dev
  }

  static getInstance(dev: boolean) {
    if (!Logger.instance) {
      Logger.instance = new Logger(dev)
    }

    return Logger.instance
  }

  private static formatPrefix(module: string): string[] {
    const moduleName = module.split('/src')[1].split('?')[0]
    return [
      `%cFusionX %c[${moduleName}]`,
      `background-color: #2f54eb; color: #fff; padding: 2px 7px; text-align: center; border-radius: 20px; font-weight: bold;`,
      `color: #eb2f96`,
    ]
  }

  error(module: string, message?: string, ...args: any): void {
    if (this.DEV) {
      const prefix = Logger.formatPrefix(module)
      console.error(...prefix, message, ...args)
    }
  }

  warn(module: string, message?: string, ...args: any): void {
    if (this.DEV) {
      const prefix = Logger.formatPrefix(module)
      console.warn(...prefix, message, ...args)
    }
  }
}

export default Logger
