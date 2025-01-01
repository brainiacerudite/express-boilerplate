class ValidationException extends Error {
  constructor(status = 400, message = "Validation error", errors = null) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

module.exports = ValidationException;
