const { getAllCommentsForArticleModel } = require("../models/commentsModel");

exports.getAllCommentsForArticle = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const comments = await getAllCommentsForArticleModel(article_id);

    res.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
};
