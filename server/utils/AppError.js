class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.error = errors;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
