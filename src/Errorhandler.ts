export class MyError extends Error {
  status: number
  message: string

  constructor(message: string) {
    super()
    this.message = message
  }
}





