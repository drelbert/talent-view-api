class HttpError extends Error {
    //Method that allows for addition of logic to run when class is instansiated
    //Has two arguments
    constructor(message, errorCode) { 
        super(message); //Adding 'message' property
        this.code = errorCode; //Adding 'code' property with 'this'
    }
}

module.exports = HttpError;