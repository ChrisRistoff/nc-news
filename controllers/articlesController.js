const {
  getArticleByIdModel,
  getAllArticlesModel,
  updateArticleByIdModel,
  createArticleModel,
} = require("../models/articlesModel");

exports.getAllArticles = async (req, res, next) => {
  const { topic, order, sort_by, p, limit } = req.query;

  try {
    const articles = await getAllArticlesModel(topic, order, sort_by, p, limit);

    res.status(200).send({ articles });
  } catch (error) {
    next(error);
  }
};

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const article = await getArticleByIdModel(article_id);

    res.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};

exports.updateArticleById = async (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  try {
    const newArticle = await updateArticleByIdModel(article_id, inc_votes);

    res.status(200).send({ newArticle });
  } catch (error) {
    next(error);
  }
};

exports.createArticle = async (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  try {
    const article = await createArticleModel(
      author,
      title,
      body,
      topic,
      article_img_url,
    );

    res.status(201).send({ article });
  } catch (error) {
    next(error);
  }
};
