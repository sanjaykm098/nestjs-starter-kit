import { HttpException } from '@nestjs/common';

export class Response {
  constructor(
    public data: any = {},
    public statusCode: number = 200,
    public message: string = 'Success',
  ) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
  }

  public send() {
    const result = {
      data: this.data,
      statusCode: this.statusCode,
      message: this.message,
    };
    throw new HttpException(result, this.statusCode);
  }
}
