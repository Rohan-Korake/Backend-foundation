// extending the built-in JavaScript Error class
class apiError extends Error {
  constructor(
    statusCode, //HTTP response code
    message = "Something went wrong", //By default message
    errors = [], //detailed list of issues
    stack = "", //It creates a clean and readable debugging stack trace for custom errors
  ) {
    super(message); //Built-in Error class gets the message
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); //It creates a clean and readable debugging stack trace for custom errors
    }
  }
}

export { apiError };
