class ErrorHandler extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        // Ensure compatibility with Node.js stack trace handling
        (Error as any).captureStackTrace?.(this, this.constructor);
    }
}

export default ErrorHandler
