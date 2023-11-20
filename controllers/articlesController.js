const { getAllArticlesModel } = require("../models/articlesModel")

exports.getAllArticles = async (req, res, next) => {
  try {
    const articles = await getAllArticlesModel()

    res.status(200).send({articles})
  } catch (error) {
    next(error)
  }
}
