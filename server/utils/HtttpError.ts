class HttpError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name; // Set the error name
    }
}

export default HttpError;