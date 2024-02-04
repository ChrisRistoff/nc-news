"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateQuery = void 0;
const paginateQuery = (dbQuery, page, limit) => {
    // if page or limit are not passed, set default values
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
    // if page or limit are not numbers, return false
    if (isNaN(page) || isNaN(limit))
        return false;
    // calculate the offset
    const offset = (page - 1) * limit;
    // add the limit and offset to the query
    dbQuery += ` LIMIT ${limit} OFFSET ${offset}`;
    // return the query
    return dbQuery;
};
exports.paginateQuery = paginateQuery;
