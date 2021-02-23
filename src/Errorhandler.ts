export class API_Error extends Error {
  status: number
  message: string

  constructor(message: string, status: number) {
    super()
    this.message = message
    this.status = status
  }
}





