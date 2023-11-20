exports.sqlErrors = (err, req, res, next) => {
  if(err.code === "22P02") {
    return res.status(400).send({msg: "Invalid input"})
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
