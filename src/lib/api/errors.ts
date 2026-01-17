export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);

        this.name = "UnauthorizedError";
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);

        this.name = "NotFoundError";
    }
}
