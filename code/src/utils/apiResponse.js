class apiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400; //https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
    }
}
