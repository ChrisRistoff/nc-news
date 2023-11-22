exports.paginateQuery = (dbQuery, page, limit) => {
  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;

  if(isNaN(page) || isNaN(limit))
    return false

  const offset = (page-1) * limit
  dbQuery += ` LIMIT ${limit} OFFSET ${offset}`

  return dbQuery
};
