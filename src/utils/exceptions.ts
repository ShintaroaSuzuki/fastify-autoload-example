/*
eslint-disable 
functional/no-classes,
functional/no-expression-statements
*/

export class HTTPException extends Error {
  public statusCode: number;
  public error: string;

  constructor(statusCode: number, error: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    Object.setPrototypeOf(this, HTTPException.prototype);
  }
}

export class BadRequestException extends HTTPException {
  constructor(message: string) {
    super(400, "Bad Request", message);
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}
export class NotFoundException extends HTTPException {
  constructor(message: string) {
    super(404, "Not Found", message);
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}
