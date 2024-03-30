import { Exclude, Expose, Transform } from 'class-transformer';

export class ResponseEntity<T> {
  @Exclude() private readonly _statusCode: string;
  @Exclude() private readonly _message: string;
  @Exclude() private readonly _data?: T;

  constructor(statusCode: string, message: string, data?: T) {
    this._statusCode = statusCode;
    this._message = message;
    this._data = data;
  }

  static OK(): any {
    return new ResponseEntity<string>('200', 'Success', null);
  }

  static OK_WITH<T>(data: T): ResponseEntity<T> {
    return new ResponseEntity<T>('200', 'Success', data);
  }

  static ERROR(): any {
    return {
      error: {
        code: '500',
        message: 'Internal Server Error',
      },
    };
  }

  static ERROR_WITH_ONLY_TWO(message: string, statusCode: string = '500'): any {
    return {
      error: {
        code: statusCode,
        message: message,
      },
    };
  }

  static ERROR_WITH_DATA<T>(
    message: string,
    data: T,
    statusCode: string = '500',
  ): any {
    return {
      error: {
        code: statusCode,
        message: message,
      },
      data: data,
    };
  }

  @Expose()
  get statusCode(): string {
    return this._statusCode;
  }

  @Expose()
  get message(): string {
    return this._message;
  }

  @Expose()
  @Transform(({ value }) => (value !== null ? value : undefined), {
    toClassOnly: true,
  })
  get data(): T | undefined {
    return this._data;
  }
}
