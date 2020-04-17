class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); // Adding the "message" property
        this.code = errorCode;  // Adding the "code" property
    }
}

module.exports = HttpError;