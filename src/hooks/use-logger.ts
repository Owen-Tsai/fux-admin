import Logger from '@/utils/logger'

const useLogger = () => {
  const logger = Logger.getInstance()

  return logger
}

export default useLogger
