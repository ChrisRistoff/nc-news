const {
  getArticleByIdModel,
  getAllArticlesModel,
  updateArticleByIdModel,
  createArticleModel,
  deleteArticleModel,
} = require("../models/articlesModel");

exports.getAllArticles = async (req, res, next) => {
  const { topic, order, sort_by, p, limit } = req.query;

  try {
    const result = await getAllArticlesModel(topic, order, sort_by, p, limit);

    res.status(200).send({ articles: result[0], total_count: result[1] });
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
  const { title, body, topic, article_img_url } = req.body;
  const author = req.user.username

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

exports.deleteArticle = async (req, res, next) => {
  const { article_id } = req.params;
  const username = req.user.username

  try {
    await deleteArticleModel(article_id, username)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
};
