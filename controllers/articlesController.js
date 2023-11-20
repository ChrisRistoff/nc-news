const { getArticleByIdModel } = require("../models/articlesModel");

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const article = await getArticleByIdModel(article_id);

    res.status(200).send({ article });
  } catch (error) {
    next(error)
  }
};
