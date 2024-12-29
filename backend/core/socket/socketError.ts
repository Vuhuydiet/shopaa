
class SocketError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class MaxPoolSizeError extends SocketError {
  constructor() {
    super('Socket pool is full');
  }
}

class BadMessageError extends SocketError {
  constructor(message?: string) {
    super(message || 'Invalid message type');
  }
}

class EventNotFoundError extends SocketError {
  constructor() {
    super('Type not found');
  }
}

class DisconnectedError extends SocketError {
  constructor() {
    super('Socket is disconnected');
  }
}

class UnauthorizedError extends SocketError {
  constructor() {
    super('Unauthorized');
  }
}

export { MaxPoolSizeError, BadMessageError, EventNotFoundError, DisconnectedError, UnauthorizedError };