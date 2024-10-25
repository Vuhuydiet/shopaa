const enum ErrorStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

const ErrorMessage = {
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
};

type ErrorObject = {
  statusCode: ErrorStatusCode;
  message: string;
};

class RequestError extends Error {
  statusCode: ErrorStatusCode;

  constructor({
    statusCode = ErrorStatusCode.INTERNAL_SERVER_ERROR,
    message = ErrorMessage.INTERNAL_SERVER_ERROR,
  }: ErrorObject) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotFoundError extends RequestError {
  constructor(message: string = ErrorMessage.NOT_FOUND) {
    super({ statusCode: ErrorStatusCode.NOT_FOUND, message });
  }
}

class BadRequestError extends RequestError {
  constructor(message: string = ErrorMessage.BAD_REQUEST) {
    super({ statusCode: ErrorStatusCode.BAD_REQUEST, message });
  }
}

class UnauthorizedError extends RequestError {
  constructor(message: string = ErrorMessage.UNAUTHORIZED) {
    super({ statusCode: ErrorStatusCode.UNAUTHORIZED, message });
  }
}

class ForbiddenError extends RequestError {
  constructor(message: string = ErrorMessage.FORBIDDEN) {
    super({ statusCode: ErrorStatusCode.FORBIDDEN, message });
  }
}

class InternalServerError extends RequestError {
  constructor(message: string = ErrorMessage.INTERNAL_SERVER_ERROR) {
    super({ statusCode: ErrorStatusCode.INTERNAL_SERVER_ERROR, message });
  }
}

export {
  RequestError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
};
