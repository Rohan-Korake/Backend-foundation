// clean and consistent success responses
class apiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; //automatically deciding whether the response is success or failure
  }
}

export { apiResponse };
