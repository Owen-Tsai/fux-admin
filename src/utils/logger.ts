class Logger {
  private static instance: Logger | null = null
  private readonly DEV: boolean

  // 私有构造函数，防止外部直接实例化
  private constructor(dev: boolean) {
    this.DEV = dev
  }

  /**
   * 初始化Logger实例
   * 应在应用启动时调用一次
   */
  static initialize(dev: boolean): void {
    if (!Logger.instance) {
      Logger.instance = new Logger(dev)
    }
  }

  /**
   * 获取Logger单例实例
   * 注意：使用前必须先调用initialize方法
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      throw new Error('Logger not initialized. Call Logger.initialize() first.')
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

  error(module: string, message?: string, ...args: any[]): void {
    if (this.DEV) {
      const prefix = Logger.formatPrefix(module)
      console.error(...prefix, message, ...args)
    }
  }

  warn(module: string, message?: string, ...args: any[]): void {
    if (this.DEV) {
      const prefix = Logger.formatPrefix(module)
      console.warn(...prefix, message, ...args)
    }
  }

  info(module: string, message?: string, ...args: any[]): void {
    if (this.DEV) {
      const prefix = Logger.formatPrefix(module)
      console.info(...prefix, message, ...args)
    }
  }

  debug(module: string, message?: string, ...args: any[]): void {
    if (this.DEV) {
      const prefix = Logger.formatPrefix(module)
      console.debug(...prefix, message, ...args)
    }
  }
}

export default Logger
