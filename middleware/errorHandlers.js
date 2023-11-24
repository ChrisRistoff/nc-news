exports.sqlErrors = (err, req, res, next) => {
  if(err.code === "22P02") {
    return res.status(400).send({msg: "Invalid input"})
  }
  if(err.code === "23503") {
    return res.status(400).send({msg: "Bad request"})
  }
  if(err.code === "23505") {
    return res.status(409).send({msg: "Already exists"})
  }

  next(err)
}

exports.customErrors = (err, req, res, next) => {
  if(err.errCode) {
    return res.status(err.errCode).send({msg: err.errMsg})
  }

  next(err)
}

exports.serverError = (err, req, res, next) => {
  console.log(err)
  return res.status(500).send({msg: "Internal server error"})
}
