"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverError = exports.customErrors = exports.sqlErrors = void 0;
const sqlErrors = (err, _, res, next) => {
    if (err.code === "22P02") {
        return res.status(400).send({ msg: "Invalid input" });
    }
    if (err.code === "23503") {
        return res.status(400).send({ msg: "Bad request" });
    }
    if (err.code === "23505") {
        return res.status(409).send({ msg: "Already exists" });
    }
    next(err);
};
exports.sqlErrors = sqlErrors;
const customErrors = (err, _, res, next) => {
    if (err.errCode) {
        return res.status(err.errCode).send({ msg: err.errMsg });
    }
    next(err);
};
exports.customErrors = customErrors;
const serverError = (err, _, res, __) => {
    console.log(err);
    return res.status(500).send({ msg: "Internal server error" });
};
exports.serverError = serverError;
