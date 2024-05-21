/*
eslint-disable 
functional/no-classes,
functional/no-expression-statements
*/

export class BadRequestException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}

export class NotFoundException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
