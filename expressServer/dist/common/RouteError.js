class RouteError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
export default RouteError;
//# sourceMappingURL=RouteError.js.map