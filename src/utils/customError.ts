/*
eslint-disable 
functional/no-classes,
functional/no-expression-statements
*/

export class BadRequestException extends Error {
  public statusCode: number;
  constructor(message: string = "") {
    super(message);
    this.statusCode = 400;
  }
}

export class NotFoundException extends Error {
  public statusCode: number;
  constructor(message: string = "") {
    super(message);
    this.statusCode = 404;
  }
}

export class InternalServerException extends Error {
  public statusCode: number;
  constructor(message: string = "") {
    super(message);
    this.statusCode = 500;
  }
}
