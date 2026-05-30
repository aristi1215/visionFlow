
const ErrorFactory = function (name:string) {
    return class AppError extends Error {
        constructor(message:string) {
            super(message);
            this.name = name;
        }
    }
}