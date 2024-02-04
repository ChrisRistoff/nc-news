"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverError = exports.customErrors = exports.sqlErrors = void 0;
const sqlErrors = (err, _, res, next) => {
    // invalid input
    if (err.code === "22P02") {
        return res.status(400).send({ msg: "Invalid input" });
    }
    // bad request
    if (err.code === "23503") {
        return res.status(400).send({ msg: "Bad request" });
    }
    // already exists
    if (err.code === "23505") {
        return res.status(409).send({ msg: "Already exists" });
    }
    // go to the next error handler
    next(err);
};
exports.sqlErrors = sqlErrors;
const customErrors = (err, _, res, next) => {
    // if the error has an error code, return the error code and message
    if (err.errCode) {
        return res.status(err.errCode).send({ msg: err.errMsg });
    }
    // go to the next error handler
    next(err);
};
exports.customErrors = customErrors;
const serverError = (err, _, res, __) => {
    // for any other error, return 500 and log the error
    console.log(err);
    return res.status(500).send({ msg: "Internal server error" });
};
exports.serverError = serverError;
