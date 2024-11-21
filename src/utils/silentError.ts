export default class SilentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SilentError"
  }
}
