const { getAllArticlesModel } = require("../models/articlesModel");

exports.getAllArticles = async (req, res, next) => {
  const { topic } = req.query;

  try {
    const articles = await getAllArticlesModel(topic);

    res.status(200).send({ articles });
  } catch (error) {
    next(error);
  }
};

const { getArticleByIdModel } = require("../models/articlesModel");

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const article = await getArticleByIdModel(article_id);

    res.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};
