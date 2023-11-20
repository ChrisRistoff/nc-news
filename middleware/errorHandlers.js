exports.sqlErrors = (err, req, res, next) => {
  next(err)
}

exports.customErrors = (err, req, res, next) => {
  if(err.errCode) {
    return res.status(err.errCode).send({msg: err.errMsg})
  } else {
    console.log(err)
    return res.status(500).send({msg: "Internal server error"})
  }

}
