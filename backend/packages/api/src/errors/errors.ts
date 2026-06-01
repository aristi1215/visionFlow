
const ErrorFactory = function (name:string) {
    return class AppError extends Error {
        constructor(message:string) {
            super(message);
            this.name = name;
        }
    }
}

export const ValidationError = ErrorFactory("ValidationError");
export const DatabaseError = ErrorFactory("DatabaseError");
export const NotFoundError = ErrorFactory("NotFoundError");
export const UnauthorizedError = ErrorFactory("UnauthorizedError");
